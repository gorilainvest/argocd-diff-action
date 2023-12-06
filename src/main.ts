import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import { exec, ExecException, ExecOptions } from 'child_process';
import * as github from '@actions/github';
import * as fs from 'fs';
import * as path from 'path';
import { ArgoResponse, Convert } from './argoResponse';

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
const ENV = core.getInput('environment');
const PLAINTEXT = core.getInput('plaintext').toLowerCase() === 'true';
let EXTRA_CLI_ARGS = core.getInput('argocd-extra-cli-args');
if (PLAINTEXT) {
  EXTRA_CLI_ARGS += ' --plaintext';
}

let repoUrl = core.getInput('repo-url');

const octokit = github.getOctokit(githubToken);

async function execCommand(
  command: string,
  options: ExecOptions = { maxBuffer: 8192 * 1024 * 1024 }
): Promise<ExecResult> {
  const p = new Promise<ExecResult>(async (done, failed) => {
    exec(command, options, (err: ExecException | null, stdout: string, stderr: string): void => {
      const res: ExecResult = {
        stdout,
        stderr
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
    execCommand(
      `${argoBinaryPath} ${params} --auth-token=${ARGOCD_TOKEN} --server=${ARGOCD_SERVER_URL} ${EXTRA_CLI_ARGS}`
    );
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

  const output = scrubSecrets(`
## ArgoCD Diff on ${ENV} for commit [\`${shortCommitSha}\`](${commitLink})
_Updated at ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PT_
  ${diffOutput.join('\n')}

| Legend | Status |
| :---:  | :---   |
| ✅     | The app is synced in ArgoCD, and diffs you see are solely from this PR. |
| ⚠️      | The app is out-of-sync in ArgoCD, and the diffs you see include those changes plus any from this PR. |
| 🛑     | There was an error generating the ArgoCD diffs due to changes in this PR. |
`);

  // Only post a new comment when there are changes
  if (diffs.length) {
    octokit.rest.issues.createComment({
      issue_number: github.context.issue.number,
      owner,
      repo,
      body: output
    });
  }
}

async function asyncForEach<T>(
  array: T[],
  callback: (item: T, i: number, arr: T[]) => Promise<void>
): Promise<void> {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
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
  const argocd = await setupArgoCDCommand();
  const apps = await getApps(argocd);

  core.info(`Found apps: ${apps.map(a => a.metadata.name).join(', ')}`);

  const diffs: Diff[] = [];

  await asyncForEach(apps, async app => {
    const command = `app diff ${app.metadata.name} --local=${app.spec.source.path}`;
    try {
      core.info(`Running: argocd ${command}`);
      // ArgoCD app diff will exit 1 if there is a diff, so always catch,
      // and then consider it a success if there's a diff in stdout
      // https://github.com/argoproj/argo-cd/issues/3588
      await argocd(command);
    } catch (e) {
      const res = e as ExecResult;
      core.info(`stdout: ${res.stdout}`);
      core.info(`stderr: ${res.stderr}`);
      if (res.stdout) {
        diffs.push({ app, diff: res.stdout });
      } else {
        diffs.push({
          app,
          diff: '',
          error: e
        });
      }
    }
  });
  await postDiffComment(diffs);
  const diffsWithErrors = diffs.filter(d => d.error);
  if (diffsWithErrors.length) {
    core.setFailed(`ArgoCD diff failed: Encountered ${diffsWithErrors.length} errors`);
  }
}

run().catch(e => core.setFailed(e.message));
