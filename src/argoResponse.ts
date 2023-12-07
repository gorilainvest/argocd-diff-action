export interface ArgoResponse {
    metadata:   Metadata;
    spec:       Spec;
    status:     Status;
    operation?: ArgoResponseOperation;
}

export interface Metadata {
    name:              string;
    namespace:         string;
    uid:               string;
    resourceVersion:   string;
    generation:        number;
    creationTimestamp: Date;
    annotations:       { [key: string]: string };
    managedFields:     ManagedField[];
    labels?:           Labels;
    finalizers?:       string[];
}

export interface Labels {
    env:                    string;
    "deploy-notification"?: string;
    team?:                  string;
    app?:                   string;
    owner?:                 string;
}

export interface ManagedField {
    manager:    string;
    operation:  string;
    apiVersion: string;
    time:       Date;
    fieldsType: string;
    fieldsV1:   FieldsV1;
}

export interface FieldsV1 {
    "f:metadata"?:  FMetadata;
    "f:spec"?:      FSpec;
    "f:status"?:    FStatus;
    "f:operation"?: FieldsV1FOperation;
}

export interface FMetadata {
    "f:annotations": { [key: string]: Jsonnet };
    "f:finalizers"?: FFinalizers;
    "f:labels"?:     { [key: string]: Jsonnet };
}

export interface Jsonnet {
}

export interface FFinalizers {
    ".":                                            Jsonnet;
    "v:\"resources-finalizer.argocd.argoproj.io\"": Jsonnet;
}

export interface FieldsV1FOperation {
    ".":             Jsonnet;
    "f:initiatedBy": PurpleFInitiatedBy;
    "f:retry":       FRetry;
    "f:sync":        PurpleFSync;
}

export interface PurpleFInitiatedBy {
    ".":           Jsonnet;
    "f:automated": Jsonnet;
}

export interface FRetry {
    "."?:       Jsonnet;
    "f:limit"?: Jsonnet;
}

export interface PurpleFSync {
    ".":             Jsonnet;
    "f:prune":       Jsonnet;
    "f:revision":    Jsonnet;
    "f:syncOptions": Jsonnet;
}

export interface FSpec {
    "."?:                   Jsonnet;
    "f:destination"?:       FDestination;
    "f:project"?:           Jsonnet;
    "f:source"?:            FSource;
    "f:syncPolicy"?:        FSyncPolicy;
    "f:ignoreDifferences"?: Jsonnet;
}

export interface FDestination {
    "."?:           Jsonnet;
    "f:name"?:      Jsonnet;
    "f:namespace"?: Jsonnet;
    "f:server"?:    Jsonnet;
}

export interface FSource {
    "."?:                Jsonnet;
    "f:path"?:           Jsonnet;
    "f:repoURL"?:        Jsonnet;
    "f:targetRevision"?: Jsonnet;
    "f:helm"?:           FHelm;
    "f:directory"?:      FDirectory;
    "f:chart"?:          Jsonnet;
}

export interface FDirectory {
    "."?:         Jsonnet;
    "f:recurse"?: Jsonnet;
    "f:jsonnet"?: Jsonnet;
}

export interface FHelm {
    "."?:             Jsonnet;
    "f:valueFiles"?:  Jsonnet;
    "f:values"?:      Jsonnet;
    "f:skipCrds"?:    Jsonnet;
    "f:releaseName"?: Jsonnet;
}

export interface FSyncPolicy {
    "."?:             Jsonnet;
    "f:automated"?:   FAutomated;
    "f:syncOptions"?: Jsonnet;
}

export interface FAutomated {
    "."?:          Jsonnet;
    "f:prune"?:    Jsonnet;
    "f:selfHeal"?: Jsonnet;
}

export interface FStatus {
    "."?:                Jsonnet;
    "f:health"?:         FHealth;
    "f:history"?:        Jsonnet;
    "f:operationState"?: FOperationState;
    "f:reconciledAt"?:   Jsonnet;
    "f:resources"?:      Jsonnet;
    "f:sourceType"?:     Jsonnet;
    "f:summary"?:        FSummary;
    "f:sync"?:           FStatusFSync;
    "f:conditions"?:     Jsonnet;
}

export interface FHealth {
    "."?:        Jsonnet;
    "f:status"?: Jsonnet;
}

export interface FOperationState {
    ".":             Jsonnet;
    "f:finishedAt"?: Jsonnet;
    "f:message":     Jsonnet;
    "f:operation":   FOperationStateFOperation;
    "f:phase":       Jsonnet;
    "f:startedAt":   Jsonnet;
    "f:syncResult":  FSyncResult;
    "f:retryCount"?: Jsonnet;
}

export interface FOperationStateFOperation {
    ".":             Jsonnet;
    "f:initiatedBy": FluffyFInitiatedBy;
    "f:retry":       FRetry;
    "f:sync":        FluffyFSync;
}

export interface FluffyFInitiatedBy {
    ".":            Jsonnet;
    "f:automated"?: Jsonnet;
    "f:username"?:  Jsonnet;
}

export interface FluffyFSync {
    ".":               Jsonnet;
    "f:prune"?:        Jsonnet;
    "f:revision":      Jsonnet;
    "f:syncOptions"?:  Jsonnet;
    "f:resources"?:    Jsonnet;
    "f:syncStrategy"?: FSyncStrategy;
}

export interface FSyncStrategy {
    ".":      Jsonnet;
    "f:hook": Jsonnet;
}

export interface FSyncResult {
    ".":            Jsonnet;
    "f:resources"?: Jsonnet;
    "f:revision":   Jsonnet;
    "f:source":     FSource;
}

export interface FSummary {
    "f:images"?: Jsonnet;
    "."?:        Jsonnet;
}

export interface FStatusFSync {
    "."?:            Jsonnet;
    "f:comparedTo"?: FComparedTo;
    "f:revision"?:   Jsonnet;
    "f:status"?:     Jsonnet;
}

export interface FComparedTo {
    "."?:             Jsonnet;
    "f:destination"?: FDestination;
    "f:source":       FSource;
}

export interface ArgoResponseOperation {
    sync:        PurpleSync;
    initiatedBy: PurpleInitiatedBy;
    retry:       Retry;
}

export interface PurpleInitiatedBy {
    automated: boolean;
}

export interface Retry {
    limit?: number;
}

export interface PurpleSync {
    revision:    string;
    prune:       boolean;
    syncOptions: string[];
}

export interface Spec {
    source:             Source;
    destination:        Destination;
    project:            string;
    syncPolicy?:        SyncPolicy;
    ignoreDifferences?: IgnoreDifference[];
}

export interface Destination {
    namespace?: string;
    name?:      string;
    server?:    string;
}

export interface IgnoreDifference {
    group?:                 string;
    kind:                   string;
    managedFieldsManagers?: string[];
    jsonPointers?:          string[];
    jqPathExpressions?:     string[];
}

export interface Source {
    repoURL:        string;
    path?:          string;
    targetRevision: string;
    helm?:          Helm;
    directory?:     Directory;
    chart?:         string;
}

export interface Directory {
    recurse: boolean;
    jsonnet: Jsonnet;
}

export interface Helm {
    valueFiles?:  string[];
    values?:      string;
    skipCrds?:    boolean;
    releaseName?: string;
}

export interface SyncPolicy {
    automated?:   Automated;
    syncOptions?: string[];
}

export interface Automated {
    prune?:    boolean;
    selfHeal?: boolean;
}

export interface Status {
    resources?:      StatusResource[];
    sync:            StatusSync;
    health:          StatusHealth;
    history?:        History[];
    reconciledAt:    Date;
    operationState?: OperationState;
    sourceType?:     string;
    summary:         Summary;
    conditions?:     Condition[];
}

export interface Condition {
    type:               string;
    message:            string;
    lastTransitionTime: Date;
}

export interface StatusHealth {
    status: string;
}

export interface History {
    revision:        string;
    deployedAt:      Date;
    id:              number;
    source:          Source;
    deployStartedAt: Date;
}

export interface OperationState {
    operation:   OperationStateOperation;
    phase:       string;
    message:     string;
    syncResult:  SyncResult;
    startedAt:   Date;
    finishedAt?: Date;
    retryCount?: number;
}

export interface OperationStateOperation {
    sync:        FluffySync;
    initiatedBy: FluffyInitiatedBy;
    retry:       Retry;
}

export interface FluffyInitiatedBy {
    automated?: boolean;
    username?:  string;
}

export interface FluffySync {
    revision:      string;
    prune?:        boolean;
    syncOptions?:  string[];
    resources?:    SyncResource[];
    syncStrategy?: SyncStrategy;
}

export interface SyncResource {
    group?:     string;
    kind:       string;
    name:       string;
    namespace?: string;
}

export interface SyncStrategy {
    hook: Jsonnet;
}

export interface SyncResult {
    resources?: SyncResultResource[];
    revision:   string;
    source:     Source;
}

export interface SyncResultResource {
    group:     string;
    version:   string;
    kind:      string;
    namespace: string;
    name:      string;
    status?:   string;
    message:   string;
    hookPhase: string;
    syncPhase: string;
    hookType?: string;
}

export interface StatusResource {
    group?:           string;
    version:          string;
    kind:             string;
    namespace?:       string;
    name:             string;
    status?:          string;
    health?:          ResourceHealth;
    hook?:            boolean;
    requiresPruning?: boolean;
}

export interface ResourceHealth {
    status:   string;
    message?: string;
}

export interface Summary {
    images?: string[];
}

export interface StatusSync {
    status:     string;
    comparedTo: ComparedTo;
    revision?:  string;
}

export interface ComparedTo {
    source:      Source;
    destination: Destination;
}
