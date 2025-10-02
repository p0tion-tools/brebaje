// Auto-generated enums from DBML schema

export enum UserProvider {
  GITHUB = 'GITHUB',
  ETH = 'ETH',
}

export enum CeremonyType {
  PHASE1 = 'PHASE1',
  PHASE2 = 'PHASE2',
}

export enum CeremonyState {
  SCHEDULED = 'SCHEDULED',
  OPENED = 'OPENED',
  PAUSED = 'PAUSED',
  CLOSED = 'CLOSED',
  CANCELED = 'CANCELED',
  FINALIZED = 'FINALIZED',
}

export enum CircuitTimeoutType {
  DYNAMIC = 'DYNAMIC',
  FIXED = 'FIXED',
  LOBBY = 'LOBBY',
}

export enum ParticipantStatus {
  CREATED = 'CREATED',
  WAITING = 'WAITING',
  READY = 'READY',
  CONTRIBUTING = 'CONTRIBUTING',
  CONTRIBUTED = 'CONTRIBUTED',
  DONE = 'DONE',
  FINALIZING = 'FINALIZING',
  FINALIZED = 'FINALIZED',
  TIMEDOUT = 'TIMEDOUT',
  EXHUMED = 'EXHUMED',
}

export enum ParticipantContributionStep {
  DOWNLOADING = 'DOWNLOADING',
  COMPUTING = 'COMPUTING',
  UPLOADING = 'UPLOADING',
  VERIFYING = 'VERIFYING',
  COMPLETED = 'COMPLETED',
}
