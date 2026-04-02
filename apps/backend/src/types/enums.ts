// Auto-generated enums from DBML schema

export enum UserProvider {
  GITHUB = 'GITHUB',
  ETHEREUM = 'ETHEREUM',
  CARDANO = 'CARDANO',
}

export enum CeremonyType {
  PHASE1 = 'PHASE1',
  PHASE2 = 'PHASE2',
}

export enum CeremonyState {
  SCHEDULED = 'SCHEDULED',
  OPENED = 'OPENED', // Start ParticipantStatus State machine.
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

/**
 * Outer state machine for a participant within an OPENED ceremony.
 * Tracks where the participant is in the ceremony flow.
 *
 * Regular participant path:
 *   CREATED → WAITING → READY → CONTRIBUTING → CONTRIBUTED → DONE
 *
 * Timeout path:
 *   READY | CONTRIBUTING → TIMEDOUT → (penalty expires) → EXHUMED → re-queue
 *
 * Coordinator path:
 *   READY → FINALIZING → FINALIZED → DONE
 *
 * @see ParticipantContributionStep for the inner state machine active during CONTRIBUTING
 */
export enum ParticipantStatus {
  CREATED = 'CREATED',
  WAITING = 'WAITING',
  READY = 'READY',
  CONTRIBUTING = 'CONTRIBUTING', // Start ParticipantContributionStep State machine.
  CONTRIBUTED = 'CONTRIBUTED',
  DONE = 'DONE',
  FINALIZING = 'FINALIZING',
  FINALIZED = 'FINALIZED',
  TIMEDOUT = 'TIMEDOUT',
  EXHUMED = 'EXHUMED',
}

/**
 * Inner state machine active only when ParticipantStatus === CONTRIBUTING.
 * Tracks the fine-grained progress of the participant's local contribution work.
 * Outside of CONTRIBUTING status, this field is stale and should not be relied upon.
 *
 * @see ParticipantStatus for the outer state machine
 */
export enum ParticipantContributionStep {
  DOWNLOADING = 'DOWNLOADING',
  COMPUTING = 'COMPUTING',
  UPLOADING = 'UPLOADING',
  VERIFYING = 'VERIFYING',
  COMPLETED = 'COMPLETED',
}

/**
 * The cause of a participant's timeout infraction.
 * Used to identify which phase of the contribution flow the participant failed to complete in time.
 */
export enum ParticipantTimeoutType {
  BLOCKING_CONTRIBUTION = 'BLOCKING_CONTRIBUTION',
  BLOCKING_BACKEND_FUNCTION = 'BLOCKING_BACKEND_FUNCTION',
  BLOCKING_VERIFICATION = 'BLOCKING_VERIFICATION',
  UNKNOWN = 'UNKNOWN',
}

export enum VerificationMachineType {
  SERVER = 'server',
  VM = 'vm',
}
