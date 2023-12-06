import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import { exec, ExecException, ExecOptions } from 'child_process';
import * as github from '@actions/github';
import * as fs from 'fs';
import * as path from 'path';
import { ArgoResponse, Convert } from './argoResponse';
import Bottleneck from "bottleneck";


interface ExecResult {
  err?: Error | undefined;
  stdout: string;
  stderr: string;
}

const ARCH = process.env.ARCH || 'linux';
const githubToken = core.getInput('github-token');

const ARGOCD_SERVER_URL = core.getInput('argocd-server-url');
const ARGOCD_TOKEN = core.getInput('argocd-token');
const VERSION = core.getInput('argocd-version');
const PLAINTEXT = core.getInput('plaintext').toLowerCase() === 'true';
const CONCURRENCY = core.getInput('concurrency');
const maxConcurrent = CONCURRENCY ? parseInt(CONCURRENCY) : 1;
const argoRateLimiter = new Bottleneck({ maxConcurrent });
let EXTRA_CLI_ARGS = core.getInput('argocd-extra-cli-args');
if (PLAINTEXT) {
  EXTRA_CLI_ARGS += ' --plaintext';
}

let repoUrl = core.getInput('repo-url');

const octokit = github.getOctokit(githubToken);

const legend = `| Legend | Status |
| :---:  | :---   |
| ✅     | The app is synced in ArgoCD, and diffs you see are solely from this PR. |
| ⚠️      | The app is out-of-sync in ArgoCD, and the diffs you see include those changes plus any from this PR. |
| 🛑     | There was an error generating the ArgoCD diffs due to changes in this PR. |
`;

async function minimizeComment(commentId: string): Promise<void> {
  const mutation = `
    mutation {
      minimizeComment(input: {subjectId: "${commentId}", classifier: OUTDATED}) {
        clientMutationId
      }
    }
  `;
  try {
    const response = await octokit.graphql(mutation);
    core.debug(JSON.stringify(response));
    core.info('Previous comment minimized successfully');
  } catch (error) {
    core.error(`Error minimizing comment: ${error}`);
  }
}

async function execCommand(
  command: string,
  options: ExecOptions = { maxBuffer: 8192 * 1024 * 1024 }
): Promise<ExecResult> {
  const p = new Promise<ExecResult>(async (done, failed) => {
    exec(command, options, (err: ExecException | null, stdout: string, stderr: string): void => {
      const res: ExecResult = {
        stdout: scrubSecrets(stdout),
        stderr: scrubSecrets(stderr)
      };
      if (err) {
        res.err = err;
        failed(res);
        return;
      }
      done(res);
    });
  });
  return await p;
}

function scrubSecrets(input: string): string {
  let output = input;
  const authTokenMatches = input.match(/--auth-token=([\w.\S]+)/);
  if (authTokenMatches) {
    output = output.replace(new RegExp(authTokenMatches[1], 'g'), '***');
  }
  return output;
}

type Argo = (params: string) => ReturnType<typeof execCommand>;

async function setupArgoCDCommand(): Promise<(params: string) => Promise<ExecResult>> {
  const argoBinaryPath = 'bin/argo';
  const url = `https://github.com/argoproj/argo-cd/releases/download/${VERSION}/argocd-${ARCH}-amd64`;
  core.info(`Downloading argo cli from: ${url}`);
  await tc.downloadTool(url, argoBinaryPath);
  fs.chmodSync(path.join(argoBinaryPath), '755');
  core.info(`Download complete`);

  return async (params: string) =>
    argoRateLimiter.schedule(async () => {
      const command = `${argoBinaryPath} ${params} --auth-token=${ARGOCD_TOKEN} --server=${ARGOCD_SERVER_URL} ${EXTRA_CLI_ARGS}`
      core.info(`Running: argocd ${command}`);
      return execCommand(command);
    });
}

async function getApps(argocd: Argo): Promise<ArgoResponse[]> {
  core.info('Listing applications...');
  try {
    const res = await argocd(`app list --output=json --repo=${repoUrl}`);
    const argoResponse = Convert.toArgoResponse(res.stdout);
    return argoResponse;
  } catch (e) {
    const res = e as ExecResult;
    core.debug(`stdout: ${res.stdout}`);
    core.debug(`stderr: ${res.stderr}`);
    throw e;
  }
}

interface Diff {
  app: ArgoResponse;
  diff: string;
  error?: ExecResult;
}
async function postDiffComment(diffs: Diff[]): Promise<void> {
  const { owner, repo } = github.context.repo;
  const sha = github.context.payload.pull_request?.head?.sha;

  const commitLink = `https://github.com/${owner}/${repo}/pull/${github.context.issue.number}/commits/${sha}`;
  const shortCommitSha = String(sha).substr(0, 7);

  const diffOutput = diffs.map(
    ({ app, diff, error }) => `   
App: [\`${app.metadata.name}\`](https://${ARGOCD_SERVER_URL}/applications/${app.metadata.name}) 
YAML generation: ${error ? ' Error 🛑' : 'Success 🟢'}
App sync status: ${app.status.sync.status === 'Synced' ? 'Synced ✅' : 'Out of Sync ⚠️ '}
${
  error
    ? `
**\`stderr:\`**
\`\`\`
${error.stderr}
\`\`\`

**\`command:\`**
\`\`\`json
${JSON.stringify(error.err)}
\`\`\`
`
    : ''
}

${
  diff
    ? `
<details>

\`\`\`diff
${diff}
\`\`\`

</details>
`
    : ''
}
---
`
  );

  const prefixHeader = `## ArgoCD Diff`;
  const output = scrubSecrets(`${prefixHeader} for commit [\`${shortCommitSha}\`](${commitLink})
_Updated at ${new Date().toLocaleString('pt-br', { timeZone: 'America/Sao_Paulo' })} GMT-3_ 
  ${diffOutput.join('\n')}

${legend}
`);

  // Only post a new comment when there are changes
  if (diffs.length) {
    const commentsResponse = await octokit.rest.issues.listComments({
      issue_number: github.context.issue.number,
      owner,
      repo
    });
    // Delete stale comments
    for (const comment of commentsResponse.data) {
      if (comment.body?.includes(prefixHeader)) {
        core.info(`minimizing comment ${comment.id}`);
        await minimizeComment(comment.node_id);
      }
    }
    octokit.rest.issues.createComment({
      issue_number: github.context.issue.number,
      owner,
      repo,
      body: output
    });
  }
}

async function run(): Promise<void> {
  if (!repoUrl) {
    core.info('No repo-url provided, fetching from GitHub API');
    const repo = github.context.repo.repo;
    const owner = github.context.repo.owner;
    const response = await octokit.rest.repos.get({ owner, repo });
    repoUrl = response.data.ssh_url;
  }
  core.info(`Only apps matching repoUrl:${repoUrl} will be diffed`);
  const argocd = await setupArgoCDCommand();
  const apps = await getApps(argocd);

  core.info(`Found apps: ${apps.map(a => a.metadata.name).join(', ')}`);

  const diffs: Diff[] = [];

  const diffJobs = apps.map(async app => {
    const command = `app diff ${app.metadata.name} --local=${app.spec.source.path}`;
    try {
      // ArgoCD app diff will exit 1 if there is a diff, so always catch,
      // and then consider it a success if there's a diff in stdout
      // https://github.com/argoproj/argo-cd/issues/3588
      await argocd(command);
    } catch (e) {
      const res = (e as unknown) as ExecResult;
      core.info(`stdout: ${res.stdout}`);
      core.info(`stderr: ${res.stderr}`);
      if (res.stdout) {
        diffs.push({ app, diff: res.stdout });
      } else {
        diffs.push({
          app,
          diff: '',
          error: res
        });
      }
    }
  });

  await Promise.all(diffJobs);

  await postDiffComment(diffs);
  const diffsWithErrors = diffs.filter(d => d.error);
  if (diffsWithErrors.length) {
    core.setFailed(`ArgoCD diff failed: Encountered ${diffsWithErrors.length} errors`);
  }
}

run().catch(e => core.setFailed(e.message));
