import { ParticipantStatus, ParticipantContributionStep } from 'src/types/enums';
import {
  canCreateContribution,
  canSetContributionValidity,
  TransitionParticipant,
  CREATE_TRANSITION_ERROR,
  SET_VALID_TRANSITION_ERROR,
} from './contribution-transitions';

describe('Contribution transition helpers', () => {
  describe('canCreateContribution', () => {
    const allowedCombinations: [ParticipantStatus, ParticipantContributionStep][] = [
      [ParticipantStatus.CONTRIBUTING, ParticipantContributionStep.UPLOADING],
      [ParticipantStatus.CONTRIBUTING, ParticipantContributionStep.VERIFYING],
    ];

    it.each(allowedCombinations)(
      'should return true for status=%s step=%s',
      (status, contributionStep) => {
        const participant: TransitionParticipant = { status, contributionStep };
        expect(canCreateContribution(participant)).toBe(true);
      },
    );

    const disallowedStatuses = [
      ParticipantStatus.CREATED,
      ParticipantStatus.WAITING,
      ParticipantStatus.READY,
      ParticipantStatus.CONTRIBUTED,
      ParticipantStatus.DONE,
      ParticipantStatus.FINALIZING,
      ParticipantStatus.FINALIZED,
      ParticipantStatus.TIMEDOUT,
      ParticipantStatus.EXHUMED,
    ];

    it.each(disallowedStatuses)(
      'should return false for status=%s regardless of step',
      (status) => {
        for (const step of Object.values(ParticipantContributionStep)) {
          const participant: TransitionParticipant = {
            status,
            contributionStep: step,
          };
          expect(canCreateContribution(participant)).toBe(false);
        }
      },
    );

    const disallowedStepsForContributing = [
      ParticipantContributionStep.DOWNLOADING,
      ParticipantContributionStep.COMPUTING,
      ParticipantContributionStep.COMPLETED,
    ];

    it.each(disallowedStepsForContributing)(
      'should return false for CONTRIBUTING + step=%s',
      (step) => {
        const participant: TransitionParticipant = {
          status: ParticipantStatus.CONTRIBUTING,
          contributionStep: step,
        };
        expect(canCreateContribution(participant)).toBe(false);
      },
    );
  });

  describe('canSetContributionValidity', () => {
    const allowedCombinations: [ParticipantStatus, ParticipantContributionStep][] = [
      [ParticipantStatus.CONTRIBUTED, ParticipantContributionStep.VERIFYING],
      [ParticipantStatus.CONTRIBUTED, ParticipantContributionStep.COMPLETED],
      [ParticipantStatus.FINALIZED, ParticipantContributionStep.VERIFYING],
      [ParticipantStatus.FINALIZED, ParticipantContributionStep.COMPLETED],
    ];

    it.each(allowedCombinations)(
      'should return true for status=%s step=%s',
      (status, contributionStep) => {
        const participant: TransitionParticipant = { status, contributionStep };
        expect(canSetContributionValidity(participant)).toBe(true);
      },
    );

    const disallowedStatuses = [
      ParticipantStatus.CREATED,
      ParticipantStatus.WAITING,
      ParticipantStatus.READY,
      ParticipantStatus.CONTRIBUTING,
      ParticipantStatus.DONE,
      ParticipantStatus.FINALIZING,
      ParticipantStatus.TIMEDOUT,
      ParticipantStatus.EXHUMED,
    ];

    it.each(disallowedStatuses)(
      'should return false for status=%s regardless of step',
      (status) => {
        for (const step of Object.values(ParticipantContributionStep)) {
          const participant: TransitionParticipant = {
            status,
            contributionStep: step,
          };
          expect(canSetContributionValidity(participant)).toBe(false);
        }
      },
    );

    const disallowedStepsForContributed = [
      ParticipantContributionStep.DOWNLOADING,
      ParticipantContributionStep.COMPUTING,
      ParticipantContributionStep.UPLOADING,
    ];

    it.each(disallowedStepsForContributed)(
      'should return false for CONTRIBUTED + step=%s',
      (step) => {
        const participant: TransitionParticipant = {
          status: ParticipantStatus.CONTRIBUTED,
          contributionStep: step,
        };
        expect(canSetContributionValidity(participant)).toBe(false);
      },
    );
  });

  describe('error message constants', () => {
    it('should export CREATE_TRANSITION_ERROR', () => {
      expect(CREATE_TRANSITION_ERROR).toContain('CONTRIBUTING');
      expect(CREATE_TRANSITION_ERROR).toContain('UPLOADING');
      expect(CREATE_TRANSITION_ERROR).toContain('VERIFYING');
    });

    it('should export SET_VALID_TRANSITION_ERROR', () => {
      expect(SET_VALID_TRANSITION_ERROR).toContain('CONTRIBUTED');
      expect(SET_VALID_TRANSITION_ERROR).toContain('FINALIZED');
      expect(SET_VALID_TRANSITION_ERROR).toContain('VERIFYING');
      expect(SET_VALID_TRANSITION_ERROR).toContain('COMPLETED');
    });
  });
});
