import { ParticipantStatus, ParticipantContributionStep } from 'src/types/enums';

/**
 * Allowed participant states for creating a contribution record.
 *
 * In the p0tion ceremony flow, a contribution document is created when the
 * participant is the current contributor (`CONTRIBUTING`) and has reached the
 * upload or verification phase (`UPLOADING` or `VERIFYING`).
 *
 * Earlier steps (`DOWNLOADING`, `COMPUTING`) mean the participant has not yet
 * produced a zKey to record; later/other statuses mean the contribution window
 * has passed.
 */
const ALLOWED_CREATE_STATUSES = new Set<ParticipantStatus>([ParticipantStatus.CONTRIBUTING]);

const ALLOWED_CREATE_STEPS = new Set<ParticipantContributionStep>([
  ParticipantContributionStep.UPLOADING,
  ParticipantContributionStep.VERIFYING,
]);

/**
 * Allowed participant states for setting the `valid` field on a contribution.
 *
 * Verification results are recorded after the participant has contributed
 * (`CONTRIBUTED` or `FINALIZED`) and the contribution step is in
 * `VERIFYING` (verification running) or `COMPLETED` (verification finished).
 *
 * This ensures that `valid` can only be set once the actual verification
 * process has been reached, aligning with p0tion's `verifycontribution` flow.
 */
const ALLOWED_SET_VALID_STATUSES = new Set<ParticipantStatus>([
  ParticipantStatus.CONTRIBUTED,
  ParticipantStatus.FINALIZED,
]);

const ALLOWED_SET_VALID_STEPS = new Set<ParticipantContributionStep>([
  ParticipantContributionStep.VERIFYING,
  ParticipantContributionStep.COMPLETED,
]);

/**
 * Participant-like shape required by the transition helpers.
 * Only the fields needed for lifecycle checks are required.
 */
export interface TransitionParticipant {
  status: ParticipantStatus;
  contributionStep: ParticipantContributionStep;
}

/**
 * Determines whether a contribution record can be created for the given
 * participant based on their current status and contribution step.
 *
 * @param participant - The participant whose state is being checked
 * @returns `true` if the participant is in a valid state to create a contribution
 *
 * @example
 * ```ts
 * canCreateContribution({ status: 'CONTRIBUTING', contributionStep: 'UPLOADING' }); // true
 * canCreateContribution({ status: 'WAITING', contributionStep: 'DOWNLOADING' });    // false
 * ```
 */
export function canCreateContribution(participant: TransitionParticipant): boolean {
  return (
    ALLOWED_CREATE_STATUSES.has(participant.status) &&
    ALLOWED_CREATE_STEPS.has(participant.contributionStep)
  );
}

/**
 * Determines whether the `valid` field can be set on a contribution
 * based on the owning participant's current status and contribution step.
 *
 * @param participant - The participant whose state is being checked
 * @returns `true` if the participant is in a valid state to have contribution validity set
 *
 * @example
 * ```ts
 * canSetContributionValidity({ status: 'CONTRIBUTED', contributionStep: 'VERIFYING' });  // true
 * canSetContributionValidity({ status: 'CONTRIBUTING', contributionStep: 'COMPUTING' }); // false
 * ```
 */
export function canSetContributionValidity(participant: TransitionParticipant): boolean {
  return (
    ALLOWED_SET_VALID_STATUSES.has(participant.status) &&
    ALLOWED_SET_VALID_STEPS.has(participant.contributionStep)
  );
}

export const CREATE_TRANSITION_ERROR =
  'Contribution can only be created when participant is CONTRIBUTING in UPLOADING or VERIFYING step';

export const SET_VALID_TRANSITION_ERROR =
  'Contribution validity can only be set when participant is CONTRIBUTED or FINALIZED in VERIFYING or COMPLETED step';
