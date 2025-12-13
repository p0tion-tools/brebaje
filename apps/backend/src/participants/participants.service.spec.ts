import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantsService } from './participants.service';
import { getModelToken } from '@nestjs/sequelize';
import { Participant } from './participant.model';
import { CircuitsService } from 'src/circuits/circuits.service';
import { ParticipantStatus, ParticipantContributionStep } from 'src/types/enums';

describe('ParticipantsService', () => {
  let service: ParticipantsService;
  let mockCircuitsService: Partial<CircuitsService>;

  beforeEach(async () => {
    mockCircuitsService = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParticipantsService,
        { provide: getModelToken(Participant), useValue: {} },
        { provide: CircuitsService, useValue: mockCircuitsService },
      ],
    }).compile();

    service = module.get<ParticipantsService>(ParticipantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addParticipantToCircuitsQueues', () => {
    let mockCircuits;
    let mockParticipant;

    beforeEach(() => {
      mockCircuitsService.findAllByCeremonyId = jest.fn();
    });

    it('should add a new participant (contributionProgress = 0) to all circuit queues', async () => {
      // Setup: 3 circuits with empty contributors
      mockCircuits = [
        {
          id: 1,
          name: 'circuit1',
          contributors: null,
          save: jest.fn().mockResolvedValue(undefined),
        },
        {
          id: 2,
          name: 'circuit2',
          contributors: null,
          save: jest.fn().mockResolvedValue(undefined),
        },
        {
          id: 3,
          name: 'circuit3',
          contributors: null,
          save: jest.fn().mockResolvedValue(undefined),
        },
      ];

      mockParticipant = {
        userId: 100,
        ceremonyId: 1,
        contributionProgress: 0,
        status: ParticipantStatus.CREATED,
        contributionStep: ParticipantContributionStep.DOWNLOADING,
        save: jest.fn().mockResolvedValue(undefined),
      };

      (mockCircuitsService.findAllByCeremonyId as jest.Mock).mockResolvedValue(mockCircuits);

      await service.addParticipantToCircuitsQueues(mockParticipant);

      // Verify participant was added to all circuits
      expect(mockCircuits[0].contributors).toEqual([100]);
      expect(mockCircuits[1].contributors).toEqual([100]);
      expect(mockCircuits[2].contributors).toEqual([100]);

      // Verify contributionProgress was updated for each circuit
      expect(mockParticipant.contributionProgress).toBe(2); // Last index processed

      // Verify save was called on all circuits and participant
      expect(mockCircuits[0].save).toHaveBeenCalled();
      expect(mockCircuits[1].save).toHaveBeenCalled();
      expect(mockCircuits[2].save).toHaveBeenCalled();
      expect(mockParticipant.save).toHaveBeenCalledTimes(3);
    });

    it('should add a new participant with undefined contributionProgress to all circuit queues', async () => {
      // Setup: 2 circuits
      mockCircuits = [
        {
          id: 1,
          name: 'circuit1',
          contributors: null,
          save: jest.fn().mockResolvedValue(undefined),
        },
        {
          id: 2,
          name: 'circuit2',
          contributors: null,
          save: jest.fn().mockResolvedValue(undefined),
        },
      ];

      mockParticipant = {
        userId: 101,
        ceremonyId: 1,
        contributionProgress: undefined, // explicitly undefined
        status: ParticipantStatus.CREATED,
        contributionStep: ParticipantContributionStep.DOWNLOADING,
        save: jest.fn().mockResolvedValue(undefined),
      };

      (mockCircuitsService.findAllByCeremonyId as jest.Mock).mockResolvedValue(mockCircuits);

      await service.addParticipantToCircuitsQueues(mockParticipant);

      // Verify participant was added to all circuits
      expect(mockCircuits[0].contributors).toEqual([101]);
      expect(mockCircuits[1].contributors).toEqual([101]);

      // Verify contributionProgress was updated
      expect(mockParticipant.contributionProgress).toBe(1);

      // Verify save was called
      expect(mockCircuits[0].save).toHaveBeenCalled();
      expect(mockCircuits[1].save).toHaveBeenCalled();
      expect(mockParticipant.save).toHaveBeenCalledTimes(2);
    });

    it('should resume adding an old participant (contributionProgress > 0) to remaining circuits', async () => {
      // Setup: 4 circuits, participant already contributed to first 2
      mockCircuits = [
        {
          id: 1,
          name: 'circuit1',
          contributors: [100, 200],
          save: jest.fn().mockResolvedValue(undefined),
        },
        {
          id: 2,
          name: 'circuit2',
          contributors: [100, 300],
          save: jest.fn().mockResolvedValue(undefined),
        },
        {
          id: 3,
          name: 'circuit3',
          contributors: [200],
          save: jest.fn().mockResolvedValue(undefined),
        },
        {
          id: 4,
          name: 'circuit4',
          contributors: null,
          save: jest.fn().mockResolvedValue(undefined),
        },
      ];

      mockParticipant = {
        userId: 100,
        ceremonyId: 1,
        contributionProgress: 2, // Starting from circuit index 2
        status: ParticipantStatus.CONTRIBUTING,
        contributionStep: ParticipantContributionStep.COMPUTING,
        save: jest.fn().mockResolvedValue(undefined),
      };

      (mockCircuitsService.findAllByCeremonyId as jest.Mock).mockResolvedValue(mockCircuits);

      await service.addParticipantToCircuitsQueues(mockParticipant);

      // Verify first two circuits were not modified
      expect(mockCircuits[0].contributors).toEqual([100, 200]);
      expect(mockCircuits[1].contributors).toEqual([100, 300]);

      // Verify participant was added to remaining circuits
      expect(mockCircuits[2].contributors).toEqual([200, 100]);
      expect(mockCircuits[3].contributors).toEqual([100]);

      // Verify contributionProgress was updated to last index
      expect(mockParticipant.contributionProgress).toBe(3);

      // Verify save was called only on circuits 3 and 4
      expect(mockCircuits[0].save).not.toHaveBeenCalled();
      expect(mockCircuits[1].save).not.toHaveBeenCalled();
      expect(mockCircuits[2].save).toHaveBeenCalled();
      expect(mockCircuits[3].save).toHaveBeenCalled();
      expect(mockParticipant.save).toHaveBeenCalledTimes(2);
    });

    it('should handle participant with a single circuit', async () => {
      // Setup: Only 1 circuit
      mockCircuits = [
        {
          id: 1,
          name: 'circuit1',
          contributors: [],
          save: jest.fn().mockResolvedValue(undefined),
        },
      ];

      mockParticipant = {
        userId: 102,
        ceremonyId: 1,
        contributionProgress: 0,
        status: ParticipantStatus.CREATED,
        contributionStep: ParticipantContributionStep.DOWNLOADING,
        save: jest.fn().mockResolvedValue(undefined),
      };

      (mockCircuitsService.findAllByCeremonyId as jest.Mock).mockResolvedValue(mockCircuits);

      await service.addParticipantToCircuitsQueues(mockParticipant);

      // Verify participant was added to the single circuit
      expect(mockCircuits[0].contributors).toEqual([102]);

      // Verify contributionProgress was updated
      expect(mockParticipant.contributionProgress).toBe(0);

      // Verify save was called
      expect(mockCircuits[0].save).toHaveBeenCalled();
      expect(mockParticipant.save).toHaveBeenCalledTimes(1);
    });

    it('should add participant to circuits with empty contributors array', async () => {
      // Setup: Circuits with empty arrays
      mockCircuits = [
        {
          id: 1,
          name: 'circuit1',
          contributors: [],
          save: jest.fn().mockResolvedValue(undefined),
        },
        {
          id: 2,
          name: 'circuit2',
          contributors: [],
          save: jest.fn().mockResolvedValue(undefined),
        },
      ];

      mockParticipant = {
        userId: 103,
        ceremonyId: 1,
        contributionProgress: 0,
        status: ParticipantStatus.CREATED,
        contributionStep: ParticipantContributionStep.DOWNLOADING,
        save: jest.fn().mockResolvedValue(undefined),
      };

      (mockCircuitsService.findAllByCeremonyId as jest.Mock).mockResolvedValue(mockCircuits);

      await service.addParticipantToCircuitsQueues(mockParticipant);

      // Verify participant was added to both circuits
      expect(mockCircuits[0].contributors).toEqual([103]);
      expect(mockCircuits[1].contributors).toEqual([103]);

      // Verify saves
      expect(mockCircuits[0].save).toHaveBeenCalled();
      expect(mockCircuits[1].save).toHaveBeenCalled();
      expect(mockParticipant.save).toHaveBeenCalledTimes(2);
    });

    it('should add participant to circuits with existing contributors', async () => {
      // Setup: Circuits already have contributors
      mockCircuits = [
        {
          id: 1,
          name: 'circuit1',
          contributors: [200, 300],
          save: jest.fn().mockResolvedValue(undefined),
        },
        {
          id: 2,
          name: 'circuit2',
          contributors: [400],
          save: jest.fn().mockResolvedValue(undefined),
        },
      ];

      mockParticipant = {
        userId: 104,
        ceremonyId: 1,
        contributionProgress: 0,
        status: ParticipantStatus.CREATED,
        contributionStep: ParticipantContributionStep.DOWNLOADING,
        save: jest.fn().mockResolvedValue(undefined),
      };

      (mockCircuitsService.findAllByCeremonyId as jest.Mock).mockResolvedValue(mockCircuits);

      await service.addParticipantToCircuitsQueues(mockParticipant);

      // Verify participant was appended to existing contributors
      expect(mockCircuits[0].contributors).toEqual([200, 300, 104]);
      expect(mockCircuits[1].contributors).toEqual([400, 104]);

      // Verify saves
      expect(mockCircuits[0].save).toHaveBeenCalled();
      expect(mockCircuits[1].save).toHaveBeenCalled();
      expect(mockParticipant.save).toHaveBeenCalledTimes(2);
    });

    it('should skip circuits where participant is already in queue', async () => {
      // Setup: Participant already in some circuit queues
      mockCircuits = [
        {
          id: 1,
          name: 'circuit1',
          contributors: [105, 200],
          save: jest.fn().mockResolvedValue(undefined),
        },
        {
          id: 2,
          name: 'circuit2',
          contributors: [300],
          save: jest.fn().mockResolvedValue(undefined),
        },
        {
          id: 3,
          name: 'circuit3',
          contributors: [105, 400],
          save: jest.fn().mockResolvedValue(undefined),
        },
      ];

      mockParticipant = {
        userId: 105,
        ceremonyId: 1,
        contributionProgress: 0,
        status: ParticipantStatus.CREATED,
        contributionStep: ParticipantContributionStep.DOWNLOADING,
        save: jest.fn().mockResolvedValue(undefined),
      };

      (mockCircuitsService.findAllByCeremonyId as jest.Mock).mockResolvedValue(mockCircuits);

      await service.addParticipantToCircuitsQueues(mockParticipant);

      // Verify circuit 1 and 3 were not modified (already has participant)
      expect(mockCircuits[0].contributors).toEqual([105, 200]);
      expect(mockCircuits[2].contributors).toEqual([105, 400]);

      // Verify participant was added only to circuit 2
      expect(mockCircuits[1].contributors).toEqual([300, 105]);

      // Verify save was only called on circuit 2 and participant once
      expect(mockCircuits[0].save).not.toHaveBeenCalled();
      expect(mockCircuits[1].save).toHaveBeenCalled();
      expect(mockCircuits[2].save).not.toHaveBeenCalled();
      expect(mockParticipant.save).toHaveBeenCalledTimes(1);
    });

    it('should handle mixed scenario: participant resuming with some circuits already containing them', async () => {
      // Setup: Participant at contributionProgress 1, already in some queues
      mockCircuits = [
        {
          id: 1,
          name: 'circuit1',
          contributors: [106, 200],
          save: jest.fn().mockResolvedValue(undefined),
        },
        {
          id: 2,
          name: 'circuit2',
          contributors: [106, 300],
          save: jest.fn().mockResolvedValue(undefined),
        },
        {
          id: 3,
          name: 'circuit3',
          contributors: [400],
          save: jest.fn().mockResolvedValue(undefined),
        },
        {
          id: 4,
          name: 'circuit4',
          contributors: [106, 500],
          save: jest.fn().mockResolvedValue(undefined),
        },
      ];

      mockParticipant = {
        userId: 106,
        ceremonyId: 1,
        contributionProgress: 1, // Start from circuit index 1
        status: ParticipantStatus.CONTRIBUTING,
        contributionStep: ParticipantContributionStep.COMPUTING,
        save: jest.fn().mockResolvedValue(undefined),
      };

      (mockCircuitsService.findAllByCeremonyId as jest.Mock).mockResolvedValue(mockCircuits);

      await service.addParticipantToCircuitsQueues(mockParticipant);

      // Verify circuit 0 was not processed (start from index 1)
      expect(mockCircuits[0].contributors).toEqual([106, 200]);
      expect(mockCircuits[0].save).not.toHaveBeenCalled();

      // Verify circuit 1 was not modified (already has participant)
      expect(mockCircuits[1].contributors).toEqual([106, 300]);
      expect(mockCircuits[1].save).not.toHaveBeenCalled();

      // Verify participant was added to circuit 2
      expect(mockCircuits[2].contributors).toEqual([400, 106]);
      expect(mockCircuits[2].save).toHaveBeenCalled();

      // Verify circuit 3 was not modified (already has participant)
      expect(mockCircuits[3].contributors).toEqual([106, 500]);
      expect(mockCircuits[3].save).not.toHaveBeenCalled();

      // Verify contributionProgress updated to circuit 2 index (last circuit where participant was added)
      // Note: contributionProgress represents the index of the last circuit to which the participant was successfully added (i.e., it is updated only when the participant is added, not when skipped)
      expect(mockParticipant.contributionProgress).toBe(2);

      // Verify save was called only once on participant (for circuit 2 only)
      expect(mockParticipant.save).toHaveBeenCalledTimes(1);
    });

    it('should handle large number of circuits (N circuits scenario)', async () => {
      // Setup: 10 circuits
      const numCircuits = 10;
      const EXISTING_PARTICIPANT_ID = 200;
      mockCircuits = Array.from({ length: numCircuits }, (_, i) => ({
        id: i + 1,
        name: `circuit${i + 1}`,
        contributors: i % 2 === 0 ? [] : [EXISTING_PARTICIPANT_ID], // Alternate between empty and having contributor
        save: jest.fn().mockResolvedValue(undefined),
      }));

      mockParticipant = {
        userId: 107,
        ceremonyId: 1,
        contributionProgress: 0,
        status: ParticipantStatus.CREATED,
        contributionStep: ParticipantContributionStep.DOWNLOADING,
        save: jest.fn().mockResolvedValue(undefined),
      };

      (mockCircuitsService.findAllByCeremonyId as jest.Mock).mockResolvedValue(mockCircuits);

      await service.addParticipantToCircuitsQueues(mockParticipant);

      // Verify participant was added to all circuits
      mockCircuits.forEach((circuit, index) => {
        const expectedContributors = index % 2 === 0 ? [107] : [EXISTING_PARTICIPANT_ID, 107];
        expect(circuit.contributors).toEqual(expectedContributors);
        expect(circuit.save).toHaveBeenCalled();
      });

      // Verify contributionProgress updated to last index
      expect(mockParticipant.contributionProgress).toBe(numCircuits - 1);

      // Verify save was called on participant for each circuit
      expect(mockParticipant.save).toHaveBeenCalledTimes(numCircuits);
    });

    it('should correctly update contributionProgress from 0 through each circuit', async () => {
      // Setup: 3 circuits to track progress updates
      mockCircuits = [
        {
          id: 1,
          name: 'circuit1',
          contributors: null,
          save: jest.fn().mockResolvedValue(undefined),
        },
        {
          id: 2,
          name: 'circuit2',
          contributors: null,
          save: jest.fn().mockResolvedValue(undefined),
        },
        {
          id: 3,
          name: 'circuit3',
          contributors: null,
          save: jest.fn().mockResolvedValue(undefined),
        },
      ];

      const progressUpdates: number[] = [];

      mockParticipant = {
        userId: 108,
        ceremonyId: 1,
        contributionProgress: 0,
        status: ParticipantStatus.CREATED,
        contributionStep: ParticipantContributionStep.DOWNLOADING,
        save: jest.fn().mockImplementation(() => {
          progressUpdates.push(mockParticipant.contributionProgress);
          return Promise.resolve(undefined);
        }),
      };

      (mockCircuitsService.findAllByCeremonyId as jest.Mock).mockResolvedValue(mockCircuits);

      await service.addParticipantToCircuitsQueues(mockParticipant);

      // Verify contributionProgress was updated sequentially
      const expectedProgressUpdates = Array.from({ length: mockCircuits.length }, (_, i) => i);
      expect(progressUpdates).toEqual(expectedProgressUpdates);

      // Verify final contributionProgress
      expect(mockParticipant.contributionProgress).toBe(mockCircuits.length - 1);
    });

    it('should handle scenario where participant starts with non-zero contributionProgress and all remaining circuits already have them', async () => {
      // Setup: Participant at progress 2, already in all remaining circuits
      mockCircuits = [
        {
          id: 1,
          name: 'circuit1',
          contributors: [109],
          save: jest.fn().mockResolvedValue(undefined),
        },
        {
          id: 2,
          name: 'circuit2',
          contributors: [109],
          save: jest.fn().mockResolvedValue(undefined),
        },
        {
          id: 3,
          name: 'circuit3',
          contributors: [109, 200],
          save: jest.fn().mockResolvedValue(undefined),
        },
        {
          id: 4,
          name: 'circuit4',
          contributors: [109],
          save: jest.fn().mockResolvedValue(undefined),
        },
      ];

      mockParticipant = {
        userId: 109,
        ceremonyId: 1,
        contributionProgress: 2, // Start from circuit index 2
        status: ParticipantStatus.CONTRIBUTING,
        contributionStep: ParticipantContributionStep.COMPUTING,
        save: jest.fn().mockResolvedValue(undefined),
      };

      (mockCircuitsService.findAllByCeremonyId as jest.Mock).mockResolvedValue(mockCircuits);

      await service.addParticipantToCircuitsQueues(mockParticipant);

      // Verify no circuits were modified
      expect(mockCircuits[0].contributors).toEqual([109]);
      expect(mockCircuits[1].contributors).toEqual([109]);
      expect(mockCircuits[2].contributors).toEqual([109, 200]);
      expect(mockCircuits[3].contributors).toEqual([109]);

      // Verify no saves were called
      expect(mockCircuits[0].save).not.toHaveBeenCalled();
      expect(mockCircuits[1].save).not.toHaveBeenCalled();
      expect(mockCircuits[2].save).not.toHaveBeenCalled();
      expect(mockCircuits[3].save).not.toHaveBeenCalled();
      expect(mockParticipant.save).not.toHaveBeenCalled();

      // contributionProgress should remain at 2 (no updates)
      expect(mockParticipant.contributionProgress).toBe(2);
    });
  });
});
