import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantsService } from './participants.service';
import { getModelToken } from '@nestjs/sequelize';
import { Participant } from './participant.model';
import { CircuitsService } from 'src/circuits/circuits.service';
import {
  ParticipantStatus,
  ParticipantContributionStep,
  CircuitTimeoutType,
  VerificationMachineType,
} from 'src/types/enums';
import { Circuit } from 'src/circuits/circuit.model';
import { ContributionsService } from 'src/contributions/contributions.service';

describe('ParticipantsService', () => {
  let service: ParticipantsService;
  let mockCircuitsService: Partial<CircuitsService>;
  let mockContributionsService: Partial<ContributionsService>;

  beforeEach(async () => {
    mockCircuitsService = {};
    mockContributionsService = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParticipantsService,
        { provide: getModelToken(Participant), useValue: {} },
        { provide: CircuitsService, useValue: mockCircuitsService },
        { provide: ContributionsService, useValue: mockContributionsService },
      ],
    }).compile();

    service = module.get<ParticipantsService>(ParticipantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addParticipantToCircuitsQueues', () => {
    let mockCircuits: Partial<Circuit>[];
    let mockParticipant: Partial<Participant>;

    beforeEach(() => {
      mockCircuitsService.findAllByCeremonyId = jest.fn();
      mockContributionsService.findValidOneByCircuitIdAndParticipantId = jest
        .fn()
        .mockResolvedValue(null);
    });

    // Helper function to create a mock circuit
    const createMockCircuit = (
      id: number,
      name: string,
      contributors?: number[],
    ): Partial<Circuit> => ({
      ceremonyId: 1,
      id,
      name,
      timeoutMechanismType: CircuitTimeoutType.FIXED,
      sequencePosition: id,
      completedContributions: 0,
      failedContributions: 0,
      verification: { serverOrVm: VerificationMachineType.SERVER },
      artifacts: { r1csStoragePath: '', wasmStoragePath: '' },
      contributors,
      save: jest.fn().mockResolvedValue(undefined),
    });

    // Helper function to create a mock participant
    const createMockParticipant = (
      userId: number,
      ceremonyId: number,
      contributionProgress: number | undefined,
      status: ParticipantStatus = ParticipantStatus.CREATED,
      contributionStep: ParticipantContributionStep = ParticipantContributionStep.DOWNLOADING,
      id?: number,
    ): Partial<Participant> => ({
      id: id || userId, // Default to userId if not specified
      userId,
      ceremonyId,
      contributionProgress,
      status,
      contributionStep,
      save: jest.fn().mockResolvedValue(undefined),
    });

    it('should add a new participant (contributionProgress = 0) to all circuit queues', async () => {
      // Setup: 3 circuits with empty contributors
      mockCircuits = [
        createMockCircuit(1, 'circuit1'),
        createMockCircuit(2, 'circuit2'),
        createMockCircuit(3, 'circuit3'),
      ];

      mockParticipant = createMockParticipant(100, 1, 0);

      (mockCircuitsService.findAllByCeremonyId as jest.Mock).mockResolvedValue(mockCircuits);

      await service.addParticipantToCircuitsQueues(mockParticipant as Participant);

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
      mockCircuits = [createMockCircuit(1, 'circuit1'), createMockCircuit(2, 'circuit2')];

      mockParticipant = createMockParticipant(101, 1, undefined);

      (mockCircuitsService.findAllByCeremonyId as jest.Mock).mockResolvedValue(mockCircuits);

      await service.addParticipantToCircuitsQueues(mockParticipant as Participant);

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
        createMockCircuit(1, 'circuit1', [100, 200]),
        createMockCircuit(2, 'circuit2', [100, 300]),
        createMockCircuit(3, 'circuit3', [200]),
        createMockCircuit(4, 'circuit4'),
      ];

      mockParticipant = createMockParticipant(
        100,
        1,
        2,
        ParticipantStatus.CONTRIBUTING,
        ParticipantContributionStep.COMPUTING,
      );

      (mockCircuitsService.findAllByCeremonyId as jest.Mock).mockResolvedValue(mockCircuits);

      await service.addParticipantToCircuitsQueues(mockParticipant as Participant);

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
      mockCircuits = [createMockCircuit(1, 'circuit1', [])];

      mockParticipant = createMockParticipant(102, 1, 0);

      (mockCircuitsService.findAllByCeremonyId as jest.Mock).mockResolvedValue(mockCircuits);

      await service.addParticipantToCircuitsQueues(mockParticipant as Participant);

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
      mockCircuits = [createMockCircuit(1, 'circuit1', []), createMockCircuit(2, 'circuit2', [])];

      mockParticipant = createMockParticipant(103, 1, 0);

      (mockCircuitsService.findAllByCeremonyId as jest.Mock).mockResolvedValue(mockCircuits);

      await service.addParticipantToCircuitsQueues(mockParticipant as Participant);

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
        createMockCircuit(1, 'circuit1', [200, 300]),
        createMockCircuit(2, 'circuit2', [400]),
      ];

      mockParticipant = createMockParticipant(104, 1, 0);

      (mockCircuitsService.findAllByCeremonyId as jest.Mock).mockResolvedValue(mockCircuits);

      await service.addParticipantToCircuitsQueues(mockParticipant as Participant);

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
        createMockCircuit(1, 'circuit1', [105, 200]),
        createMockCircuit(2, 'circuit2', [300]),
        createMockCircuit(3, 'circuit3', [105, 400]),
      ];

      mockParticipant = createMockParticipant(105, 1, 0);

      (mockCircuitsService.findAllByCeremonyId as jest.Mock).mockResolvedValue(mockCircuits);

      await service.addParticipantToCircuitsQueues(mockParticipant as Participant);

      // Verify circuit 1 and 3 were not modified (already has participant)
      expect(mockCircuits[0].contributors).toEqual([105, 200]);
      expect(mockCircuits[2].contributors).toEqual([105, 400]);

      // Verify participant was added only to circuit 2
      expect(mockCircuits[1].contributors).toEqual([300, 105]);

      // Verify save was only called on circuit 2 and participant once
      expect(mockCircuits[0].save).not.toHaveBeenCalled();
      expect(mockCircuits[1].save).toHaveBeenCalled();
      expect(mockCircuits[2].save).not.toHaveBeenCalled();
      expect(mockParticipant.save).toHaveBeenCalledTimes(3);
    });

    it('should handle mixed scenario: participant resuming with some circuits already containing them', async () => {
      // Setup: Participant at contributionProgress 1, already in some queues
      mockCircuits = [
        createMockCircuit(1, 'circuit1', [106, 200]),
        createMockCircuit(2, 'circuit2', [106, 300]),
        createMockCircuit(3, 'circuit3', [400]),
        createMockCircuit(4, 'circuit4', [106, 500]),
      ];

      mockParticipant = createMockParticipant(
        106,
        1,
        1,
        ParticipantStatus.CONTRIBUTING,
        ParticipantContributionStep.COMPUTING,
      );

      (mockCircuitsService.findAllByCeremonyId as jest.Mock).mockResolvedValue(mockCircuits);

      await service.addParticipantToCircuitsQueues(mockParticipant as Participant);

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

      // Verify save was called only on participant (for circuit 2 only)
      expect(mockParticipant.save).toHaveBeenCalledTimes(3);
    });

    it('should handle large number of circuits (N circuits scenario)', async () => {
      // Setup: 10 circuits
      const numCircuits = 10;
      const EXISTING_PARTICIPANT_ID = 200;
      mockCircuits = Array.from({ length: numCircuits }, (_, i) =>
        createMockCircuit(i + 1, `circuit${i + 1}`, i % 2 === 0 ? [] : [EXISTING_PARTICIPANT_ID]),
      );

      mockParticipant = createMockParticipant(107, 1, 0);

      (mockCircuitsService.findAllByCeremonyId as jest.Mock).mockResolvedValue(mockCircuits);

      await service.addParticipantToCircuitsQueues(mockParticipant as Participant);

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
        createMockCircuit(1, 'circuit1'),
        createMockCircuit(2, 'circuit2'),
        createMockCircuit(3, 'circuit3'),
      ];

      const progressUpdates: number[] = [];

      mockParticipant = createMockParticipant(108, 1, 0);
      mockParticipant.save = jest.fn().mockImplementation(() => {
        progressUpdates.push((mockParticipant as Participant).contributionProgress!);
        return Promise.resolve(undefined);
      });

      (mockCircuitsService.findAllByCeremonyId as jest.Mock).mockResolvedValue(mockCircuits);

      await service.addParticipantToCircuitsQueues(mockParticipant as Participant);

      // Verify contributionProgress was updated sequentially
      const expectedProgressUpdates = Array.from({ length: mockCircuits.length }, (_, i) => i);
      expect(progressUpdates).toEqual(expectedProgressUpdates);

      // Verify final contributionProgress
      expect(mockParticipant.contributionProgress).toBe(mockCircuits.length - 1);
    });

    it('should handle scenario where participant starts with non-zero contributionProgress and all remaining circuits already have them', async () => {
      // Setup: Participant at progress 2, already in all remaining circuits
      mockCircuits = [
        createMockCircuit(1, 'circuit1', [109]),
        createMockCircuit(2, 'circuit2', [109]),
        createMockCircuit(3, 'circuit3', [109, 200]),
        createMockCircuit(4, 'circuit4', [109]),
      ];

      mockParticipant = createMockParticipant(
        109,
        1,
        2,
        ParticipantStatus.CONTRIBUTING,
        ParticipantContributionStep.COMPUTING,
      );

      (mockCircuitsService.findAllByCeremonyId as jest.Mock).mockResolvedValue(mockCircuits);

      await service.addParticipantToCircuitsQueues(mockParticipant as Participant);

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
      expect(mockParticipant.save).toHaveBeenCalledTimes(2);

      // contributionProgress should remain at 2 (no updates)
      expect(mockParticipant.contributionProgress).toBe(2);
    });

    it('should skip circuits where participant has already contributed', async () => {
      // Setup: 3 circuits, participant has already contributed to circuit 2
      mockCircuits = [
        createMockCircuit(1, 'circuit1'),
        createMockCircuit(2, 'circuit2'),
        createMockCircuit(3, 'circuit3'),
      ];

      mockParticipant = createMockParticipant(110, 1, 0);

      (mockCircuitsService.findAllByCeremonyId as jest.Mock).mockResolvedValue(mockCircuits);

      // Mock that participant has already contributed to circuit 2 (index 1)
      (mockContributionsService.findValidOneByCircuitIdAndParticipantId as jest.Mock)
        .mockResolvedValueOnce(null) // Circuit 1 - no contribution
        .mockResolvedValueOnce({ id: 1, circuitId: 2, participantId: 110 }) // Circuit 2 - has contribution
        .mockResolvedValueOnce(null); // Circuit 3 - no contribution

      await service.addParticipantToCircuitsQueues(mockParticipant as Participant);

      // Verify participant was added to circuits 1 and 3, but not 2
      expect(mockCircuits[0].contributors).toEqual([110]);
      expect(mockCircuits[1].contributors).toBeUndefined(); // Not modified
      expect(mockCircuits[2].contributors).toEqual([110]);

      // Verify save was called only on circuits 1 and 3
      expect(mockCircuits[0].save).toHaveBeenCalled();
      expect(mockCircuits[1].save).not.toHaveBeenCalled();
      expect(mockCircuits[2].save).toHaveBeenCalled();

      // Verify participant save was called for circuits 1 and 3. On circuit 2 state was updated to CONTRIBUTED
      expect(mockParticipant.save).toHaveBeenCalledTimes(3);

      // Verify contributionProgress updated to last circuit index
      expect(mockParticipant.contributionProgress).toBe(2);
    });

    it('should skip all circuits where participant has already contributed', async () => {
      // Setup: Participant has contributed to all circuits
      mockCircuits = [
        createMockCircuit(1, 'circuit1'),
        createMockCircuit(2, 'circuit2'),
        createMockCircuit(3, 'circuit3'),
      ];

      mockParticipant = createMockParticipant(111, 1, 0);

      (mockCircuitsService.findAllByCeremonyId as jest.Mock).mockResolvedValue(mockCircuits);

      // Mock that participant has already contributed to all circuits
      (mockContributionsService.findValidOneByCircuitIdAndParticipantId as jest.Mock)
        .mockResolvedValueOnce({ id: 1, circuitId: 1, participantId: 111 })
        .mockResolvedValueOnce({ id: 2, circuitId: 2, participantId: 111 })
        .mockResolvedValueOnce({ id: 3, circuitId: 3, participantId: 111 });

      await service.addParticipantToCircuitsQueues(mockParticipant as Participant);

      // Verify no circuits were modified
      expect(mockCircuits[0].contributors).toBeUndefined();
      expect(mockCircuits[1].contributors).toBeUndefined();
      expect(mockCircuits[2].contributors).toBeUndefined();

      // Verify no saves were called
      expect(mockCircuits[0].save).not.toHaveBeenCalled();
      expect(mockCircuits[1].save).not.toHaveBeenCalled();
      expect(mockCircuits[2].save).not.toHaveBeenCalled();

      // Verify participant save was called for each circuit to update status to CONTRIBUTED
      expect(mockParticipant.save).toHaveBeenCalledTimes(3);

      // contributionProgress should remain at 0 (no updates)
      expect(mockParticipant.contributionProgress).toBe(0);
    });

    it('should handle mixed scenario: participant in queue, already contributed, and new circuits', async () => {
      // Setup: Complex scenario with multiple conditions
      mockCircuits = [
        createMockCircuit(1, 'circuit1', [112]), // Already in queue
        createMockCircuit(2, 'circuit2'), // Already contributed
        createMockCircuit(3, 'circuit3'), // New circuit to add
        createMockCircuit(4, 'circuit4', [200]), // Already contributed
        createMockCircuit(5, 'circuit5'), // New circuit to add
      ];

      mockParticipant = createMockParticipant(112, 1, 0);

      (mockCircuitsService.findAllByCeremonyId as jest.Mock).mockResolvedValue(mockCircuits);

      // Mock contributions
      (mockContributionsService.findValidOneByCircuitIdAndParticipantId as jest.Mock)
        // Circuit 1 - no contribution (but already in queue so we do not need mock value)
        .mockResolvedValueOnce({ id: 1, circuitId: 2, participantId: 112 }) // Circuit 2 - has contribution
        .mockResolvedValueOnce(null) // Circuit 3 - no contribution
        .mockResolvedValueOnce({ id: 2, circuitId: 4, participantId: 112 }) // Circuit 4 - has contribution
        .mockResolvedValueOnce(null); // Circuit 5 - no contribution

      await service.addParticipantToCircuitsQueues(mockParticipant as Participant);

      // Verify circuit 1 was not modified (already in queue)
      expect(mockCircuits[0].contributors).toEqual([112]);
      expect(mockCircuits[0].save).not.toHaveBeenCalled();

      // Verify circuit 2 was not modified (already contributed)
      expect(mockCircuits[1].contributors).toBeUndefined();
      expect(mockCircuits[1].save).not.toHaveBeenCalled();

      // Verify participant was added to circuit 3
      expect(mockCircuits[2].contributors).toEqual([112]);
      expect(mockCircuits[2].save).toHaveBeenCalled();

      // Verify circuit 4 was not modified (already contributed)
      expect(mockCircuits[3].contributors).toEqual([200]);
      expect(mockCircuits[3].save).not.toHaveBeenCalled();

      // Verify participant was added to circuit 5
      expect(mockCircuits[4].contributors).toEqual([112]);
      expect(mockCircuits[4].save).toHaveBeenCalled();

      // Verify contributionProgress updated to last circuit index
      expect(mockParticipant.contributionProgress).toBe(4);
    });

    it('should handle participant resuming from middle with some circuits already contributed', async () => {
      // Setup: Participant resuming from circuit 2, has contributed to circuit 3
      mockCircuits = [
        createMockCircuit(1, 'circuit1', [113]),
        createMockCircuit(2, 'circuit2', [113]),
        createMockCircuit(3, 'circuit3'), // Already contributed
        createMockCircuit(4, 'circuit4'), // New circuit to add
        createMockCircuit(5, 'circuit5'), // New circuit to add
      ];

      mockParticipant = createMockParticipant(
        113,
        1,
        2,
        ParticipantStatus.CONTRIBUTING,
        ParticipantContributionStep.COMPUTING,
      );

      (mockCircuitsService.findAllByCeremonyId as jest.Mock).mockResolvedValue(mockCircuits);

      // Mock contributions (only called for circuits starting from index 2 - circuit #3)
      (mockContributionsService.findValidOneByCircuitIdAndParticipantId as jest.Mock)
        .mockResolvedValueOnce({ id: 1, circuitId: 3, participantId: 113 }) // Circuit 3 - has contribution
        .mockResolvedValueOnce(null) // Circuit 4 - no contribution
        .mockResolvedValueOnce(null); // Circuit 5 - no contribution

      await service.addParticipantToCircuitsQueues(mockParticipant as Participant);

      // Verify circuits 0 and 1 were not processed (before contributionProgress)
      expect(mockCircuits[0].contributors).toEqual([113]);
      expect(mockCircuits[0].save).not.toHaveBeenCalled();
      expect(mockCircuits[1].contributors).toEqual([113]);
      expect(mockCircuits[1].save).not.toHaveBeenCalled();

      // Verify circuit 2 was not modified (already contributed)
      expect(mockCircuits[2].contributors).toBeUndefined();
      expect(mockCircuits[2].save).not.toHaveBeenCalled();

      // Verify participant was added to circuits 3 and 4
      expect(mockCircuits[3].contributors).toEqual([113]);
      expect(mockCircuits[3].save).toHaveBeenCalled();
      expect(mockCircuits[4].contributors).toEqual([113]);
      expect(mockCircuits[4].save).toHaveBeenCalled();

      // Verify contributionProgress updated to last circuit index
      expect(mockParticipant.contributionProgress).toBe(4);
    });

    it('should prioritize already in queue check over already contributed check', async () => {
      // Setup: Participant is in queue but has also contributed (edge case)
      mockCircuits = [
        createMockCircuit(1, 'circuit1', [114]), // In queue AND contributed
        createMockCircuit(2, 'circuit2'), // New circuit
      ];

      mockParticipant = createMockParticipant(114, 1, 0);

      (mockCircuitsService.findAllByCeremonyId as jest.Mock).mockResolvedValue(mockCircuits);

      // Mock contributions - should NOT be called for circuit 1 because it's already in queue
      (
        mockContributionsService.findValidOneByCircuitIdAndParticipantId as jest.Mock
      ).mockResolvedValueOnce(null); // Only called for circuit 2

      await service.addParticipantToCircuitsQueues(mockParticipant as Participant);

      // Verify circuit 1 was not modified (already in queue, contribution check skipped)
      expect(mockCircuits[0].contributors).toEqual([114]);
      expect(mockCircuits[0].save).not.toHaveBeenCalled();

      // Verify participant was added to circuit 2
      expect(mockCircuits[1].contributors).toEqual([114]);
      expect(mockCircuits[1].save).toHaveBeenCalled();

      // Verify findValidOneByCircuitIdAndParticipantId was called only once (for circuit 2)
      expect(
        mockContributionsService.findValidOneByCircuitIdAndParticipantId,
      ).toHaveBeenCalledTimes(1);

      // Verify participant save was called twice
      expect(mockParticipant.save).toHaveBeenCalledTimes(2);

      // Verify contributionProgress updated
      expect(mockParticipant.contributionProgress).toBe(1);
    });
  });
});
