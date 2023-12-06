// To parse this data:
//
//   import { Convert } from "./file";
//
//   const argoResponse = Convert.toArgoResponse(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface ArgoResponse {
  metadata: Metadata;
  spec: Spec;
  status: Status;
  operation?: ArgoResponseOperation;
}

export interface Metadata {
  name: string;
  namespace: string;
  uid: string;
  resourceVersion: string;
  generation: number;
  creationTimestamp: Date;
  annotations: { [key: string]: string };
  managedFields: ManagedField[];
  labels?: Labels;
  finalizers?: string[];
}

export interface Labels {
  env: string;
  'deploy-notification'?: string;
  team?: string;
  app?: string;
  owner?: string;
}

export interface ManagedField {
  manager: string;
  operation: string;
  apiVersion: string;
  time: Date;
  fieldsType: string;
  fieldsV1: FieldsV1;
}

export interface FieldsV1 {
  'f:metadata'?: FMetadata;
  'f:spec'?: FSpec;
  'f:status'?: FStatus;
  'f:operation'?: FieldsV1FOperation;
}

export interface FMetadata {
  'f:annotations': { [key: string]: Jsonnet };
  'f:finalizers'?: FFinalizers;
  'f:labels'?: { [key: string]: Jsonnet };
}

export interface Jsonnet {}

export interface FFinalizers {
  '.': Jsonnet;
  'v:"resources-finalizer.argocd.argoproj.io"': Jsonnet;
}

export interface FieldsV1FOperation {
  '.': Jsonnet;
  'f:initiatedBy': PurpleFInitiatedBy;
  'f:retry': FRetry;
  'f:sync': PurpleFSync;
}

export interface PurpleFInitiatedBy {
  '.': Jsonnet;
  'f:automated': Jsonnet;
}

export interface FRetry {
  '.'?: Jsonnet;
  'f:limit'?: Jsonnet;
}

export interface PurpleFSync {
  '.': Jsonnet;
  'f:prune': Jsonnet;
  'f:revision': Jsonnet;
  'f:syncOptions': Jsonnet;
}

export interface FSpec {
  '.'?: Jsonnet;
  'f:destination'?: FDestination;
  'f:project'?: Jsonnet;
  'f:source'?: FSource;
  'f:syncPolicy'?: FSyncPolicy;
  'f:ignoreDifferences'?: Jsonnet;
}

export interface FDestination {
  '.'?: Jsonnet;
  'f:name'?: Jsonnet;
  'f:namespace'?: Jsonnet;
  'f:server'?: Jsonnet;
}

export interface FSource {
  '.'?: Jsonnet;
  'f:path'?: Jsonnet;
  'f:repoURL'?: Jsonnet;
  'f:targetRevision'?: Jsonnet;
  'f:helm'?: FHelm;
  'f:directory'?: FDirectory;
  'f:chart'?: Jsonnet;
}

export interface FDirectory {
  '.'?: Jsonnet;
  'f:recurse'?: Jsonnet;
  'f:jsonnet'?: Jsonnet;
}

export interface FHelm {
  '.'?: Jsonnet;
  'f:valueFiles'?: Jsonnet;
  'f:values'?: Jsonnet;
  'f:skipCrds'?: Jsonnet;
  'f:releaseName'?: Jsonnet;
}

export interface FSyncPolicy {
  '.'?: Jsonnet;
  'f:automated'?: FAutomated;
  'f:syncOptions'?: Jsonnet;
}

export interface FAutomated {
  '.'?: Jsonnet;
  'f:prune'?: Jsonnet;
  'f:selfHeal'?: Jsonnet;
}

export interface FStatus {
  '.'?: Jsonnet;
  'f:health'?: FHealth;
  'f:history'?: Jsonnet;
  'f:operationState'?: FOperationState;
  'f:reconciledAt'?: Jsonnet;
  'f:resources'?: Jsonnet;
  'f:sourceType'?: Jsonnet;
  'f:summary'?: FSummary;
  'f:sync'?: FStatusFSync;
  'f:conditions'?: Jsonnet;
}

export interface FHealth {
  '.'?: Jsonnet;
  'f:status'?: Jsonnet;
}

export interface FOperationState {
  '.': Jsonnet;
  'f:finishedAt'?: Jsonnet;
  'f:message': Jsonnet;
  'f:operation': FOperationStateFOperation;
  'f:phase': Jsonnet;
  'f:startedAt': Jsonnet;
  'f:syncResult': FSyncResult;
  'f:retryCount'?: Jsonnet;
}

export interface FOperationStateFOperation {
  '.': Jsonnet;
  'f:initiatedBy': FluffyFInitiatedBy;
  'f:retry': FRetry;
  'f:sync': FluffyFSync;
}

export interface FluffyFInitiatedBy {
  '.': Jsonnet;
  'f:automated'?: Jsonnet;
  'f:username'?: Jsonnet;
}

export interface FluffyFSync {
  '.': Jsonnet;
  'f:prune'?: Jsonnet;
  'f:revision': Jsonnet;
  'f:syncOptions'?: Jsonnet;
  'f:resources'?: Jsonnet;
  'f:syncStrategy'?: FSyncStrategy;
}

export interface FSyncStrategy {
  '.': Jsonnet;
  'f:hook': Jsonnet;
}

export interface FSyncResult {
  '.': Jsonnet;
  'f:resources'?: Jsonnet;
  'f:revision': Jsonnet;
  'f:source': FSource;
}

export interface FSummary {
  'f:images'?: Jsonnet;
  '.'?: Jsonnet;
}

export interface FStatusFSync {
  '.'?: Jsonnet;
  'f:comparedTo'?: FComparedTo;
  'f:revision'?: Jsonnet;
  'f:status'?: Jsonnet;
}

export interface FComparedTo {
  '.'?: Jsonnet;
  'f:destination'?: FDestination;
  'f:source': FSource;
}

export interface ArgoResponseOperation {
  sync: PurpleSync;
  initiatedBy: PurpleInitiatedBy;
  retry: Retry;
}

export interface PurpleInitiatedBy {
  automated: boolean;
}

export interface Retry {
  limit?: number;
}

export interface PurpleSync {
  revision: string;
  prune: boolean;
  syncOptions: string[];
}

export interface Spec {
  source: Source;
  destination: Destination;
  project: string;
  syncPolicy?: SyncPolicy;
  ignoreDifferences?: IgnoreDifference[];
}

export interface Destination {
  namespace?: string;
  name?: string;
  server?: string;
}

export interface IgnoreDifference {
  group?: string;
  kind: string;
  managedFieldsManagers?: string[];
  jsonPointers?: string[];
  jqPathExpressions?: string[];
}

export interface Source {
  repoURL: string;
  path?: string;
  targetRevision: string;
  helm?: Helm;
  directory?: Directory;
  chart?: string;
}

export interface Directory {
  recurse: boolean;
  jsonnet: Jsonnet;
}

export interface Helm {
  valueFiles?: string[];
  values?: string;
  skipCrds?: boolean;
  releaseName?: string;
}

export interface SyncPolicy {
  automated?: Automated;
  syncOptions?: string[];
}

export interface Automated {
  prune?: boolean;
  selfHeal?: boolean;
}

export interface Status {
  resources?: StatusResource[];
  sync: StatusSync;
  health: StatusHealth;
  history?: History[];
  reconciledAt: Date;
  operationState?: OperationState;
  sourceType?: string;
  summary: Summary;
  conditions?: Condition[];
}

export interface Condition {
  type: string;
  message: string;
  lastTransitionTime: Date;
}

export interface StatusHealth {
  status: string;
}

export interface History {
  revision: string;
  deployedAt: Date;
  id: number;
  source: Source;
  deployStartedAt: Date;
}

export interface OperationState {
  operation: OperationStateOperation;
  phase: string;
  message: string;
  syncResult: SyncResult;
  startedAt: Date;
  finishedAt?: Date;
  retryCount?: number;
}

export interface OperationStateOperation {
  sync: FluffySync;
  initiatedBy: FluffyInitiatedBy;
  retry: Retry;
}

export interface FluffyInitiatedBy {
  automated?: boolean;
  username?: string;
}

export interface FluffySync {
  revision: string;
  prune?: boolean;
  syncOptions?: string[];
  resources?: SyncResource[];
  syncStrategy?: SyncStrategy;
}

export interface SyncResource {
  group?: string;
  kind: string;
  name: string;
  namespace?: string;
}

export interface SyncStrategy {
  hook: Jsonnet;
}

export interface SyncResult {
  resources?: SyncResultResource[];
  revision: string;
  source: Source;
}

export interface SyncResultResource {
  group: string;
  version: string;
  kind: string;
  namespace: string;
  name: string;
  status?: string;
  message: string;
  hookPhase: string;
  syncPhase: string;
  hookType?: string;
}

export interface StatusResource {
  group?: string;
  version: string;
  kind: string;
  namespace?: string;
  name: string;
  status?: string;
  health?: ResourceHealth;
  hook?: boolean;
  requiresPruning?: boolean;
}

export interface ResourceHealth {
  status: string;
  message?: string;
}

export interface Summary {
  images?: string[];
}

export interface StatusSync {
  status: string;
  comparedTo: ComparedTo;
  revision?: string;
}

export interface ComparedTo {
  source: Source;
  destination: Destination;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toArgoResponse(json: string): ArgoResponse[] {
    return cast(JSON.parse(json), a(r('ArgoResponse')));
  }

  public static argoResponseToJson(value: ArgoResponse[]): string {
    return JSON.stringify(uncast(value, a(r('ArgoResponse'))), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
  if (key) {
    throw Error(
      `Invalid value for key "${key}". Expected type ${JSON.stringify(
        typ
      )} but got ${JSON.stringify(val)}`
    );
  }
  throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`);
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(cases, val);
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue('array', val);
    return val.map(el => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue('Date', val);
    }
    return d;
  }

  function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
    if (val === null || typeof val !== 'object' || Array.isArray(val)) {
      return invalidValue('object', val);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach(key => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, prop.key);
    });
    Object.getOwnPropertyNames(val).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key);
      }
    });
    return result;
  }

  if (typ === 'any') return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val);
  }
  if (typ === false) return invalidValue(typ, val);
  while (typeof typ === 'object' && typ.ref !== undefined) {
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === 'object') {
    return typ.hasOwnProperty('unionMembers')
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty('arrayItems')
      ? transformArray(typ.arrayItems, val)
      : typ.hasOwnProperty('props')
      ? transformObject(getProps(typ), typ.additional, val)
      : invalidValue(typ, val);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== 'number') return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  ArgoResponse: o(
    [
      { json: 'metadata', js: 'metadata', typ: r('Metadata') },
      { json: 'spec', js: 'spec', typ: r('Spec') },
      { json: 'status', js: 'status', typ: r('Status') },
      { json: 'operation', js: 'operation', typ: u(undefined, r('ArgoResponseOperation')) }
    ],
    false
  ),
  Metadata: o(
    [
      { json: 'name', js: 'name', typ: '' },
      { json: 'namespace', js: 'namespace', typ: '' },
      { json: 'uid', js: 'uid', typ: '' },
      { json: 'resourceVersion', js: 'resourceVersion', typ: '' },
      { json: 'generation', js: 'generation', typ: 0 },
      { json: 'creationTimestamp', js: 'creationTimestamp', typ: Date },
      { json: 'annotations', js: 'annotations', typ: m('') },
      { json: 'managedFields', js: 'managedFields', typ: a(r('ManagedField')) },
      { json: 'labels', js: 'labels', typ: u(undefined, r('Labels')) },
      { json: 'finalizers', js: 'finalizers', typ: u(undefined, a('')) }
    ],
    false
  ),
  Labels: o(
    [
      { json: 'env', js: 'env', typ: '' },
      { json: 'deploy-notification', js: 'deploy-notification', typ: u(undefined, '') },
      { json: 'team', js: 'team', typ: u(undefined, '') },
      { json: 'app', js: 'app', typ: u(undefined, '') },
      { json: 'owner', js: 'owner', typ: u(undefined, '') }
    ],
    false
  ),
  ManagedField: o(
    [
      { json: 'manager', js: 'manager', typ: '' },
      { json: 'operation', js: 'operation', typ: '' },
      { json: 'apiVersion', js: 'apiVersion', typ: '' },
      { json: 'time', js: 'time', typ: Date },
      { json: 'fieldsType', js: 'fieldsType', typ: '' },
      { json: 'fieldsV1', js: 'fieldsV1', typ: r('FieldsV1') }
    ],
    false
  ),
  FieldsV1: o(
    [
      { json: 'f:metadata', js: 'f:metadata', typ: u(undefined, r('FMetadata')) },
      { json: 'f:spec', js: 'f:spec', typ: u(undefined, r('FSpec')) },
      { json: 'f:status', js: 'f:status', typ: u(undefined, r('FStatus')) },
      { json: 'f:operation', js: 'f:operation', typ: u(undefined, r('FieldsV1FOperation')) }
    ],
    false
  ),
  FMetadata: o(
    [
      { json: 'f:annotations', js: 'f:annotations', typ: m(r('Jsonnet')) },
      { json: 'f:finalizers', js: 'f:finalizers', typ: u(undefined, r('FFinalizers')) },
      { json: 'f:labels', js: 'f:labels', typ: u(undefined, m(r('Jsonnet'))) }
    ],
    false
  ),
  Jsonnet: o([], false),
  FFinalizers: o(
    [
      { json: '.', js: '.', typ: r('Jsonnet') },
      {
        json: 'v:"resources-finalizer.argocd.argoproj.io"',
        js: 'v:"resources-finalizer.argocd.argoproj.io"',
        typ: r('Jsonnet')
      }
    ],
    false
  ),
  FieldsV1FOperation: o(
    [
      { json: '.', js: '.', typ: r('Jsonnet') },
      { json: 'f:initiatedBy', js: 'f:initiatedBy', typ: r('PurpleFInitiatedBy') },
      { json: 'f:retry', js: 'f:retry', typ: r('FRetry') },
      { json: 'f:sync', js: 'f:sync', typ: r('PurpleFSync') }
    ],
    false
  ),
  PurpleFInitiatedBy: o(
    [
      { json: '.', js: '.', typ: r('Jsonnet') },
      { json: 'f:automated', js: 'f:automated', typ: r('Jsonnet') }
    ],
    false
  ),
  FRetry: o(
    [
      { json: '.', js: '.', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:limit', js: 'f:limit', typ: u(undefined, r('Jsonnet')) }
    ],
    false
  ),
  PurpleFSync: o(
    [
      { json: '.', js: '.', typ: r('Jsonnet') },
      { json: 'f:prune', js: 'f:prune', typ: r('Jsonnet') },
      { json: 'f:revision', js: 'f:revision', typ: r('Jsonnet') },
      { json: 'f:syncOptions', js: 'f:syncOptions', typ: r('Jsonnet') }
    ],
    false
  ),
  FSpec: o(
    [
      { json: '.', js: '.', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:destination', js: 'f:destination', typ: u(undefined, r('FDestination')) },
      { json: 'f:project', js: 'f:project', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:source', js: 'f:source', typ: u(undefined, r('FSource')) },
      { json: 'f:syncPolicy', js: 'f:syncPolicy', typ: u(undefined, r('FSyncPolicy')) },
      { json: 'f:ignoreDifferences', js: 'f:ignoreDifferences', typ: u(undefined, r('Jsonnet')) }
    ],
    false
  ),
  FDestination: o(
    [
      { json: '.', js: '.', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:name', js: 'f:name', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:namespace', js: 'f:namespace', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:server', js: 'f:server', typ: u(undefined, r('Jsonnet')) }
    ],
    false
  ),
  FSource: o(
    [
      { json: '.', js: '.', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:path', js: 'f:path', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:repoURL', js: 'f:repoURL', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:targetRevision', js: 'f:targetRevision', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:helm', js: 'f:helm', typ: u(undefined, r('FHelm')) },
      { json: 'f:directory', js: 'f:directory', typ: u(undefined, r('FDirectory')) },
      { json: 'f:chart', js: 'f:chart', typ: u(undefined, r('Jsonnet')) }
    ],
    false
  ),
  FDirectory: o(
    [
      { json: '.', js: '.', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:recurse', js: 'f:recurse', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:jsonnet', js: 'f:jsonnet', typ: u(undefined, r('Jsonnet')) }
    ],
    false
  ),
  FHelm: o(
    [
      { json: '.', js: '.', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:valueFiles', js: 'f:valueFiles', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:values', js: 'f:values', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:skipCrds', js: 'f:skipCrds', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:releaseName', js: 'f:releaseName', typ: u(undefined, r('Jsonnet')) }
    ],
    false
  ),
  FSyncPolicy: o(
    [
      { json: '.', js: '.', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:automated', js: 'f:automated', typ: u(undefined, r('FAutomated')) },
      { json: 'f:syncOptions', js: 'f:syncOptions', typ: u(undefined, r('Jsonnet')) }
    ],
    false
  ),
  FAutomated: o(
    [
      { json: '.', js: '.', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:prune', js: 'f:prune', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:selfHeal', js: 'f:selfHeal', typ: u(undefined, r('Jsonnet')) }
    ],
    false
  ),
  FStatus: o(
    [
      { json: '.', js: '.', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:health', js: 'f:health', typ: u(undefined, r('FHealth')) },
      { json: 'f:history', js: 'f:history', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:operationState', js: 'f:operationState', typ: u(undefined, r('FOperationState')) },
      { json: 'f:reconciledAt', js: 'f:reconciledAt', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:resources', js: 'f:resources', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:sourceType', js: 'f:sourceType', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:summary', js: 'f:summary', typ: u(undefined, r('FSummary')) },
      { json: 'f:sync', js: 'f:sync', typ: u(undefined, r('FStatusFSync')) },
      { json: 'f:conditions', js: 'f:conditions', typ: u(undefined, r('Jsonnet')) }
    ],
    false
  ),
  FHealth: o(
    [
      { json: '.', js: '.', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:status', js: 'f:status', typ: u(undefined, r('Jsonnet')) }
    ],
    false
  ),
  FOperationState: o(
    [
      { json: '.', js: '.', typ: r('Jsonnet') },
      { json: 'f:finishedAt', js: 'f:finishedAt', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:message', js: 'f:message', typ: r('Jsonnet') },
      { json: 'f:operation', js: 'f:operation', typ: r('FOperationStateFOperation') },
      { json: 'f:phase', js: 'f:phase', typ: r('Jsonnet') },
      { json: 'f:startedAt', js: 'f:startedAt', typ: r('Jsonnet') },
      { json: 'f:syncResult', js: 'f:syncResult', typ: r('FSyncResult') },
      { json: 'f:retryCount', js: 'f:retryCount', typ: u(undefined, r('Jsonnet')) }
    ],
    false
  ),
  FOperationStateFOperation: o(
    [
      { json: '.', js: '.', typ: r('Jsonnet') },
      { json: 'f:initiatedBy', js: 'f:initiatedBy', typ: r('FluffyFInitiatedBy') },
      { json: 'f:retry', js: 'f:retry', typ: r('FRetry') },
      { json: 'f:sync', js: 'f:sync', typ: r('FluffyFSync') }
    ],
    false
  ),
  FluffyFInitiatedBy: o(
    [
      { json: '.', js: '.', typ: r('Jsonnet') },
      { json: 'f:automated', js: 'f:automated', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:username', js: 'f:username', typ: u(undefined, r('Jsonnet')) }
    ],
    false
  ),
  FluffyFSync: o(
    [
      { json: '.', js: '.', typ: r('Jsonnet') },
      { json: 'f:prune', js: 'f:prune', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:revision', js: 'f:revision', typ: r('Jsonnet') },
      { json: 'f:syncOptions', js: 'f:syncOptions', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:resources', js: 'f:resources', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:syncStrategy', js: 'f:syncStrategy', typ: u(undefined, r('FSyncStrategy')) }
    ],
    false
  ),
  FSyncStrategy: o(
    [
      { json: '.', js: '.', typ: r('Jsonnet') },
      { json: 'f:hook', js: 'f:hook', typ: r('Jsonnet') }
    ],
    false
  ),
  FSyncResult: o(
    [
      { json: '.', js: '.', typ: r('Jsonnet') },
      { json: 'f:resources', js: 'f:resources', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:revision', js: 'f:revision', typ: r('Jsonnet') },
      { json: 'f:source', js: 'f:source', typ: r('FSource') }
    ],
    false
  ),
  FSummary: o(
    [
      { json: 'f:images', js: 'f:images', typ: u(undefined, r('Jsonnet')) },
      { json: '.', js: '.', typ: u(undefined, r('Jsonnet')) }
    ],
    false
  ),
  FStatusFSync: o(
    [
      { json: '.', js: '.', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:comparedTo', js: 'f:comparedTo', typ: u(undefined, r('FComparedTo')) },
      { json: 'f:revision', js: 'f:revision', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:status', js: 'f:status', typ: u(undefined, r('Jsonnet')) }
    ],
    false
  ),
  FComparedTo: o(
    [
      { json: '.', js: '.', typ: u(undefined, r('Jsonnet')) },
      { json: 'f:destination', js: 'f:destination', typ: u(undefined, r('FDestination')) },
      { json: 'f:source', js: 'f:source', typ: r('FSource') }
    ],
    false
  ),
  ArgoResponseOperation: o(
    [
      { json: 'sync', js: 'sync', typ: r('PurpleSync') },
      { json: 'initiatedBy', js: 'initiatedBy', typ: r('PurpleInitiatedBy') },
      { json: 'retry', js: 'retry', typ: r('Retry') }
    ],
    false
  ),
  PurpleInitiatedBy: o([{ json: 'automated', js: 'automated', typ: true }], false),
  Retry: o([{ json: 'limit', js: 'limit', typ: u(undefined, 0) }], false),
  PurpleSync: o(
    [
      { json: 'revision', js: 'revision', typ: '' },
      { json: 'prune', js: 'prune', typ: true },
      { json: 'syncOptions', js: 'syncOptions', typ: a('') }
    ],
    false
  ),
  Spec: o(
    [
      { json: 'source', js: 'source', typ: r('Source') },
      { json: 'destination', js: 'destination', typ: r('Destination') },
      { json: 'project', js: 'project', typ: '' },
      { json: 'syncPolicy', js: 'syncPolicy', typ: u(undefined, r('SyncPolicy')) },
      {
        json: 'ignoreDifferences',
        js: 'ignoreDifferences',
        typ: u(undefined, a(r('IgnoreDifference')))
      }
    ],
    false
  ),
  Destination: o(
    [
      { json: 'namespace', js: 'namespace', typ: u(undefined, '') },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'server', js: 'server', typ: u(undefined, '') }
    ],
    false
  ),
  IgnoreDifference: o(
    [
      { json: 'group', js: 'group', typ: u(undefined, '') },
      { json: 'kind', js: 'kind', typ: '' },
      { json: 'managedFieldsManagers', js: 'managedFieldsManagers', typ: u(undefined, a('')) },
      { json: 'jsonPointers', js: 'jsonPointers', typ: u(undefined, a('')) },
      { json: 'jqPathExpressions', js: 'jqPathExpressions', typ: u(undefined, a('')) }
    ],
    false
  ),
  Source: o(
    [
      { json: 'repoURL', js: 'repoURL', typ: '' },
      { json: 'path', js: 'path', typ: u(undefined, '') },
      { json: 'targetRevision', js: 'targetRevision', typ: '' },
      { json: 'helm', js: 'helm', typ: u(undefined, r('Helm')) },
      { json: 'directory', js: 'directory', typ: u(undefined, r('Directory')) },
      { json: 'chart', js: 'chart', typ: u(undefined, '') }
    ],
    false
  ),
  Directory: o(
    [
      { json: 'recurse', js: 'recurse', typ: true },
      { json: 'jsonnet', js: 'jsonnet', typ: r('Jsonnet') }
    ],
    false
  ),
  Helm: o(
    [
      { json: 'valueFiles', js: 'valueFiles', typ: u(undefined, a('')) },
      { json: 'values', js: 'values', typ: u(undefined, '') },
      { json: 'skipCrds', js: 'skipCrds', typ: u(undefined, true) },
      { json: 'releaseName', js: 'releaseName', typ: u(undefined, '') }
    ],
    false
  ),
  SyncPolicy: o(
    [
      { json: 'automated', js: 'automated', typ: u(undefined, r('Automated')) },
      { json: 'syncOptions', js: 'syncOptions', typ: u(undefined, a('')) }
    ],
    false
  ),
  Automated: o(
    [
      { json: 'prune', js: 'prune', typ: u(undefined, true) },
      { json: 'selfHeal', js: 'selfHeal', typ: u(undefined, true) }
    ],
    false
  ),
  Status: o(
    [
      { json: 'resources', js: 'resources', typ: u(undefined, a(r('StatusResource'))) },
      { json: 'sync', js: 'sync', typ: r('StatusSync') },
      { json: 'health', js: 'health', typ: r('StatusHealth') },
      { json: 'history', js: 'history', typ: u(undefined, a(r('History'))) },
      { json: 'reconciledAt', js: 'reconciledAt', typ: Date },
      { json: 'operationState', js: 'operationState', typ: u(undefined, r('OperationState')) },
      { json: 'sourceType', js: 'sourceType', typ: u(undefined, '') },
      { json: 'summary', js: 'summary', typ: r('Summary') },
      { json: 'conditions', js: 'conditions', typ: u(undefined, a(r('Condition'))) }
    ],
    false
  ),
  Condition: o(
    [
      { json: 'type', js: 'type', typ: '' },
      { json: 'message', js: 'message', typ: '' },
      { json: 'lastTransitionTime', js: 'lastTransitionTime', typ: Date }
    ],
    false
  ),
  StatusHealth: o([{ json: 'status', js: 'status', typ: '' }], false),
  History: o(
    [
      { json: 'revision', js: 'revision', typ: '' },
      { json: 'deployedAt', js: 'deployedAt', typ: Date },
      { json: 'id', js: 'id', typ: 0 },
      { json: 'source', js: 'source', typ: r('Source') },
      { json: 'deployStartedAt', js: 'deployStartedAt', typ: Date }
    ],
    false
  ),
  OperationState: o(
    [
      { json: 'operation', js: 'operation', typ: r('OperationStateOperation') },
      { json: 'phase', js: 'phase', typ: '' },
      { json: 'message', js: 'message', typ: '' },
      { json: 'syncResult', js: 'syncResult', typ: r('SyncResult') },
      { json: 'startedAt', js: 'startedAt', typ: Date },
      { json: 'finishedAt', js: 'finishedAt', typ: u(undefined, Date) },
      { json: 'retryCount', js: 'retryCount', typ: u(undefined, 0) }
    ],
    false
  ),
  OperationStateOperation: o(
    [
      { json: 'sync', js: 'sync', typ: r('FluffySync') },
      { json: 'initiatedBy', js: 'initiatedBy', typ: r('FluffyInitiatedBy') },
      { json: 'retry', js: 'retry', typ: r('Retry') }
    ],
    false
  ),
  FluffyInitiatedBy: o(
    [
      { json: 'automated', js: 'automated', typ: u(undefined, true) },
      { json: 'username', js: 'username', typ: u(undefined, '') }
    ],
    false
  ),
  FluffySync: o(
    [
      { json: 'revision', js: 'revision', typ: '' },
      { json: 'prune', js: 'prune', typ: u(undefined, true) },
      { json: 'syncOptions', js: 'syncOptions', typ: u(undefined, a('')) },
      { json: 'resources', js: 'resources', typ: u(undefined, a(r('SyncResource'))) },
      { json: 'syncStrategy', js: 'syncStrategy', typ: u(undefined, r('SyncStrategy')) }
    ],
    false
  ),
  SyncResource: o(
    [
      { json: 'group', js: 'group', typ: u(undefined, '') },
      { json: 'kind', js: 'kind', typ: '' },
      { json: 'name', js: 'name', typ: '' },
      { json: 'namespace', js: 'namespace', typ: u(undefined, '') }
    ],
    false
  ),
  SyncStrategy: o([{ json: 'hook', js: 'hook', typ: r('Jsonnet') }], false),
  SyncResult: o(
    [
      { json: 'resources', js: 'resources', typ: u(undefined, a(r('SyncResultResource'))) },
      { json: 'revision', js: 'revision', typ: '' },
      { json: 'source', js: 'source', typ: r('Source') }
    ],
    false
  ),
  SyncResultResource: o(
    [
      { json: 'group', js: 'group', typ: '' },
      { json: 'version', js: 'version', typ: '' },
      { json: 'kind', js: 'kind', typ: '' },
      { json: 'namespace', js: 'namespace', typ: '' },
      { json: 'name', js: 'name', typ: '' },
      { json: 'status', js: 'status', typ: u(undefined, '') },
      { json: 'message', js: 'message', typ: '' },
      { json: 'hookPhase', js: 'hookPhase', typ: '' },
      { json: 'syncPhase', js: 'syncPhase', typ: '' },
      { json: 'hookType', js: 'hookType', typ: u(undefined, '') }
    ],
    false
  ),
  StatusResource: o(
    [
      { json: 'group', js: 'group', typ: u(undefined, '') },
      { json: 'version', js: 'version', typ: '' },
      { json: 'kind', js: 'kind', typ: '' },
      { json: 'namespace', js: 'namespace', typ: u(undefined, '') },
      { json: 'name', js: 'name', typ: '' },
      { json: 'status', js: 'status', typ: u(undefined, '') },
      { json: 'health', js: 'health', typ: u(undefined, r('ResourceHealth')) },
      { json: 'hook', js: 'hook', typ: u(undefined, true) },
      { json: 'requiresPruning', js: 'requiresPruning', typ: u(undefined, true) }
    ],
    false
  ),
  ResourceHealth: o(
    [
      { json: 'status', js: 'status', typ: '' },
      { json: 'message', js: 'message', typ: u(undefined, '') }
    ],
    false
  ),
  Summary: o([{ json: 'images', js: 'images', typ: u(undefined, a('')) }], false),
  StatusSync: o(
    [
      { json: 'status', js: 'status', typ: '' },
      { json: 'comparedTo', js: 'comparedTo', typ: r('ComparedTo') },
      { json: 'revision', js: 'revision', typ: u(undefined, '') }
    ],
    false
  ),
  ComparedTo: o(
    [
      { json: 'source', js: 'source', typ: r('Source') },
      { json: 'destination', js: 'destination', typ: r('Destination') }
    ],
    false
  )
};
