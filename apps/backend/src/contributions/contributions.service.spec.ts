import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { CircuitsService } from 'src/circuits/circuits.service';
import { ParticipantsService } from 'src/participants/participants.service';
import { ParticipantStatus, ParticipantContributionStep } from 'src/types/enums';
import { ContributionsService } from './contributions.service';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { UpdateContributionDto } from './dto/update-contribution.dto';
import { CREATE_TRANSITION_ERROR, SET_VALID_TRANSITION_ERROR } from './contribution-transitions';

jest.mock('./contribution.model', () => {
  return {
    Contribution: class MockContribution {},
  };
});

import { Contribution } from './contribution.model';

describe('ContributionsService', () => {
  let service: ContributionsService;
  let mockContributionModel: {
    create: jest.Mock;
    findAll: jest.Mock;
    findByPk: jest.Mock;
    findOne: jest.Mock;
  };
  let mockCircuitsService: Partial<CircuitsService>;
  let mockParticipantsService: Partial<ParticipantsService>;

  const mockCircuit = {
    id: 1,
    ceremonyId: 10,
    name: 'test-circuit',
  };

  const mockParticipant = {
    id: 1,
    userId: 100,
    ceremonyId: 10,
    status: ParticipantStatus.CONTRIBUTING,
    contributionStep: ParticipantContributionStep.UPLOADING,
  };

  const mockContribution = {
    id: 1,
    circuitId: 1,
    participantId: 1,
    valid: true,
    contributionComputationTime: 120,
    update: jest.fn(),
    destroy: jest.fn(),
  };

  beforeEach(async () => {
    mockContributionModel = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      findOne: jest.fn(),
    };

    mockCircuitsService = {
      findOne: jest.fn(),
    };

    mockParticipantsService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContributionsService,
        {
          provide: getModelToken(Contribution),
          useValue: mockContributionModel,
        },
        {
          provide: CircuitsService,
          useValue: mockCircuitsService,
        },
        {
          provide: ParticipantsService,
          useValue: mockParticipantsService,
        },
      ],
    }).compile();

    service = module.get<ContributionsService>(ContributionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateContributionDto = {
      circuitId: 1,
      participantId: 1,
    };

    it('should successfully create a contribution when participant is CONTRIBUTING + UPLOADING', async () => {
      (mockCircuitsService.findOne as jest.Mock).mockResolvedValueOnce(mockCircuit);
      (mockParticipantsService.findOne as jest.Mock).mockResolvedValueOnce(mockParticipant);
      mockContributionModel.findOne.mockResolvedValueOnce(null);
      mockContributionModel.create.mockResolvedValueOnce({
        id: 1,
        ...createDto,
      });

      const result = await service.create(createDto);

      expect(mockCircuitsService.findOne).toHaveBeenCalledWith(1);
      expect(mockParticipantsService.findOne).toHaveBeenCalledWith(1);
      expect(mockContributionModel.create).toHaveBeenCalledWith({
        ...createDto,
      });
      expect(result).toEqual({ id: 1, ...createDto });
    });

    it('should successfully create a contribution when participant is CONTRIBUTING + VERIFYING', async () => {
      (mockCircuitsService.findOne as jest.Mock).mockResolvedValueOnce(mockCircuit);
      (mockParticipantsService.findOne as jest.Mock).mockResolvedValueOnce({
        ...mockParticipant,
        contributionStep: ParticipantContributionStep.VERIFYING,
      });
      mockContributionModel.findOne.mockResolvedValueOnce(null);
      mockContributionModel.create.mockResolvedValueOnce({ id: 1, ...createDto });

      const result = await service.create(createDto);
      expect(result).toEqual({ id: 1, ...createDto });
    });

    it('should throw NotFoundException when circuit does not exist', async () => {
      (mockCircuitsService.findOne as jest.Mock).mockResolvedValueOnce(null);

      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when participant does not exist', async () => {
      (mockCircuitsService.findOne as jest.Mock).mockResolvedValueOnce(mockCircuit);
      (mockParticipantsService.findOne as jest.Mock).mockResolvedValueOnce(null);

      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when participant is not in the circuit ceremony', async () => {
      (mockCircuitsService.findOne as jest.Mock).mockResolvedValueOnce(mockCircuit);
      (mockParticipantsService.findOne as jest.Mock).mockResolvedValueOnce({
        ...mockParticipant,
        ceremonyId: 999,
      });

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException when a valid contribution already exists', async () => {
      (mockCircuitsService.findOne as jest.Mock).mockResolvedValueOnce(mockCircuit);
      (mockParticipantsService.findOne as jest.Mock).mockResolvedValueOnce(mockParticipant);
      mockContributionModel.findOne.mockResolvedValueOnce(mockContribution);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException on SequelizeUniqueConstraintError', async () => {
      (mockCircuitsService.findOne as jest.Mock).mockResolvedValueOnce(mockCircuit);
      (mockParticipantsService.findOne as jest.Mock).mockResolvedValueOnce(mockParticipant);
      mockContributionModel.findOne.mockResolvedValueOnce(null);

      const error = new Error('Unique constraint');
      error.name = 'SequelizeUniqueConstraintError';
      mockContributionModel.create.mockRejectedValueOnce(error);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });

    describe('transition validation', () => {
      const disallowedParticipantStates: [ParticipantStatus, ParticipantContributionStep][] = [
        [ParticipantStatus.CREATED, ParticipantContributionStep.DOWNLOADING],
        [ParticipantStatus.WAITING, ParticipantContributionStep.DOWNLOADING],
        [ParticipantStatus.READY, ParticipantContributionStep.DOWNLOADING],
        [ParticipantStatus.CONTRIBUTED, ParticipantContributionStep.COMPLETED],
        [ParticipantStatus.DONE, ParticipantContributionStep.COMPLETED],
        [ParticipantStatus.TIMEDOUT, ParticipantContributionStep.DOWNLOADING],
        [ParticipantStatus.CONTRIBUTING, ParticipantContributionStep.DOWNLOADING],
        [ParticipantStatus.CONTRIBUTING, ParticipantContributionStep.COMPUTING],
        [ParticipantStatus.CONTRIBUTING, ParticipantContributionStep.COMPLETED],
      ];

      it.each(disallowedParticipantStates)(
        'should throw BadRequestException when participant is %s + %s',
        async (status, contributionStep) => {
          (mockCircuitsService.findOne as jest.Mock).mockResolvedValueOnce(mockCircuit);
          (mockParticipantsService.findOne as jest.Mock).mockResolvedValueOnce({
            ...mockParticipant,
            status,
            contributionStep,
          });

          await expect(service.create(createDto)).rejects.toThrow(
            new BadRequestException(CREATE_TRANSITION_ERROR),
          );
        },
      );
    });
  });

  describe('findAll', () => {
    it('should return all contributions without filters', async () => {
      const contributions = [mockContribution];
      mockContributionModel.findAll.mockResolvedValueOnce(contributions);

      const result = await service.findAll();

      expect(mockContributionModel.findAll).toHaveBeenCalledWith({
        where: {},
        include: expect.any(Array),
      });
      expect(result).toEqual(contributions);
    });

    it('should filter by circuitId', async () => {
      mockContributionModel.findAll.mockResolvedValueOnce([]);

      await service.findAll(1);

      expect(mockContributionModel.findAll).toHaveBeenCalledWith({
        where: { circuitId: 1 },
        include: expect.any(Array),
      });
    });

    it('should filter by participantId', async () => {
      mockContributionModel.findAll.mockResolvedValueOnce([]);

      await service.findAll(undefined, 2);

      expect(mockContributionModel.findAll).toHaveBeenCalledWith({
        where: { participantId: 2 },
        include: expect.any(Array),
      });
    });

    it('should filter by both circuitId and participantId', async () => {
      mockContributionModel.findAll.mockResolvedValueOnce([]);

      await service.findAll(1, 2);

      expect(mockContributionModel.findAll).toHaveBeenCalledWith({
        where: { circuitId: 1, participantId: 2 },
        include: expect.any(Array),
      });
    });
  });

  describe('findOne', () => {
    it('should return a contribution by id', async () => {
      mockContributionModel.findByPk.mockResolvedValueOnce(mockContribution);

      const result = await service.findOne(1);

      expect(mockContributionModel.findByPk).toHaveBeenCalledWith(1, {
        include: expect.any(Array),
      });
      expect(result).toEqual(mockContribution);
    });

    it('should throw NotFoundException when contribution is not found', async () => {
      mockContributionModel.findByPk.mockResolvedValueOnce(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findValidOneByCircuitIdAndParticipantId', () => {
    it('should return a valid contribution', async () => {
      mockContributionModel.findOne.mockResolvedValueOnce(mockContribution);

      const result = await service.findValidOneByCircuitIdAndParticipantId(1, 1);

      expect(mockContributionModel.findOne).toHaveBeenCalledWith({
        where: { circuitId: 1, participantId: 1, valid: true },
      });
      expect(result).toEqual(mockContribution);
    });

    it('should return null when no valid contribution exists', async () => {
      mockContributionModel.findOne.mockResolvedValueOnce(null);

      const result = await service.findValidOneByCircuitIdAndParticipantId(1, 1);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update non-valid fields without transition check', async () => {
      const updateDto: UpdateContributionDto = {
        verifyContributionTime: 60,
      };

      mockContributionModel.findByPk.mockResolvedValueOnce(mockContribution);
      mockContribution.update.mockResolvedValueOnce({
        ...mockContribution,
        ...updateDto,
      });

      const result = await service.update(1, updateDto);

      expect(mockContributionModel.findByPk).toHaveBeenCalledWith(1);
      expect(mockContribution.update).toHaveBeenCalledWith(updateDto);
      expect(mockParticipantsService.findOne).not.toHaveBeenCalled();
      expect(result).toEqual(mockContribution);
    });

    it('should allow setting valid when participant is CONTRIBUTED + VERIFYING', async () => {
      const contributionRecord = {
        ...mockContribution,
        valid: undefined,
      };
      const updateDto: UpdateContributionDto = { valid: true };

      mockContributionModel.findByPk.mockResolvedValueOnce(contributionRecord);
      (mockParticipantsService.findOne as jest.Mock).mockResolvedValueOnce({
        ...mockParticipant,
        status: ParticipantStatus.CONTRIBUTED,
        contributionStep: ParticipantContributionStep.VERIFYING,
      });
      contributionRecord.update = jest.fn().mockResolvedValueOnce({
        ...contributionRecord,
        valid: true,
      });

      const result = await service.update(1, updateDto);
      expect(result).toBeDefined();
      expect(mockParticipantsService.findOne).toHaveBeenCalledWith(1);
    });

    it('should allow setting valid when participant is FINALIZED + COMPLETED', async () => {
      const contributionRecord = {
        ...mockContribution,
        valid: undefined,
      };
      const updateDto: UpdateContributionDto = { valid: false };

      mockContributionModel.findByPk.mockResolvedValueOnce(contributionRecord);
      (mockParticipantsService.findOne as jest.Mock).mockResolvedValueOnce({
        ...mockParticipant,
        status: ParticipantStatus.FINALIZED,
        contributionStep: ParticipantContributionStep.COMPLETED,
      });
      contributionRecord.update = jest.fn().mockResolvedValueOnce({
        ...contributionRecord,
        valid: false,
      });

      const result = await service.update(1, updateDto);
      expect(result).toBeDefined();
    });

    it('should throw BadRequestException when setting valid with invalid participant state', async () => {
      const contributionRecord = {
        ...mockContribution,
        valid: undefined,
        participantId: 1,
      };
      const updateDto: UpdateContributionDto = { valid: true };

      mockContributionModel.findByPk.mockResolvedValueOnce(contributionRecord);
      (mockParticipantsService.findOne as jest.Mock).mockResolvedValueOnce({
        ...mockParticipant,
        status: ParticipantStatus.CONTRIBUTING,
        contributionStep: ParticipantContributionStep.COMPUTING,
      });

      await expect(service.update(1, updateDto)).rejects.toThrow(
        new BadRequestException(SET_VALID_TRANSITION_ERROR),
      );
    });

    it('should throw NotFoundException when updating a non-existent contribution', async () => {
      const updateDto: UpdateContributionDto = { valid: false };
      mockContributionModel.findByPk.mockResolvedValueOnce(null);

      await expect(service.update(999, updateDto)).rejects.toThrow(NotFoundException);
    });

    describe('idempotency', () => {
      it('should allow setting valid=true when contribution already has valid=true (no participant check)', async () => {
        const contributionRecord = {
          ...mockContribution,
          valid: true,
          participantId: 1,
          update: jest.fn().mockResolvedValueOnce({ ...mockContribution, valid: true }),
        };
        const updateDto: UpdateContributionDto = { valid: true };

        mockContributionModel.findByPk.mockResolvedValueOnce(contributionRecord);

        const result = await service.update(1, updateDto);

        expect(mockParticipantsService.findOne).not.toHaveBeenCalled();
        expect(contributionRecord.update).toHaveBeenCalledWith(updateDto);
        expect(result).toBeDefined();
      });

      it('should allow setting valid=false when contribution already has valid=false (no participant check)', async () => {
        const contributionRecord = {
          ...mockContribution,
          valid: false,
          participantId: 1,
          update: jest.fn().mockResolvedValueOnce({ ...mockContribution, valid: false }),
        };
        const updateDto: UpdateContributionDto = { valid: false };

        mockContributionModel.findByPk.mockResolvedValueOnce(contributionRecord);

        const result = await service.update(1, updateDto);

        expect(mockParticipantsService.findOne).not.toHaveBeenCalled();
        expect(contributionRecord.update).toHaveBeenCalledWith(updateDto);
        expect(result).toBeDefined();
      });

      it('should check participant state when changing valid from true to false', async () => {
        const contributionRecord = {
          ...mockContribution,
          valid: true,
          participantId: 1,
          update: jest.fn().mockResolvedValueOnce({ ...mockContribution, valid: false }),
        };
        const updateDto: UpdateContributionDto = { valid: false };

        mockContributionModel.findByPk.mockResolvedValueOnce(contributionRecord);
        (mockParticipantsService.findOne as jest.Mock).mockResolvedValueOnce({
          ...mockParticipant,
          status: ParticipantStatus.CONTRIBUTED,
          contributionStep: ParticipantContributionStep.COMPLETED,
        });

        const result = await service.update(1, updateDto);
        expect(mockParticipantsService.findOne).toHaveBeenCalledWith(1);
        expect(result).toBeDefined();
      });
    });

    describe('transition validation for setting valid', () => {
      const disallowedStates: [ParticipantStatus, ParticipantContributionStep][] = [
        [ParticipantStatus.CONTRIBUTING, ParticipantContributionStep.DOWNLOADING],
        [ParticipantStatus.CONTRIBUTING, ParticipantContributionStep.COMPUTING],
        [ParticipantStatus.CONTRIBUTING, ParticipantContributionStep.UPLOADING],
        [ParticipantStatus.WAITING, ParticipantContributionStep.DOWNLOADING],
        [ParticipantStatus.READY, ParticipantContributionStep.DOWNLOADING],
        [ParticipantStatus.DONE, ParticipantContributionStep.COMPLETED],
        [ParticipantStatus.CONTRIBUTED, ParticipantContributionStep.DOWNLOADING],
        [ParticipantStatus.CONTRIBUTED, ParticipantContributionStep.UPLOADING],
      ];

      it.each(disallowedStates)(
        'should throw BadRequestException when setting valid with participant %s + %s',
        async (status, contributionStep) => {
          const contributionRecord = {
            ...mockContribution,
            valid: undefined,
            participantId: 1,
            update: jest.fn(),
          };

          mockContributionModel.findByPk.mockResolvedValueOnce(contributionRecord);
          (mockParticipantsService.findOne as jest.Mock).mockResolvedValueOnce({
            ...mockParticipant,
            status,
            contributionStep,
          });

          await expect(service.update(1, { valid: true })).rejects.toThrow(BadRequestException);
        },
      );
    });
  });

  describe('remove', () => {
    it('should remove a contribution', async () => {
      mockContributionModel.findByPk.mockResolvedValueOnce(mockContribution);
      mockContribution.destroy.mockResolvedValueOnce(undefined);

      const result = await service.remove(1);

      expect(mockContributionModel.findByPk).toHaveBeenCalledWith(1);
      expect(mockContribution.destroy).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Contribution removed successfully',
      });
    });

    it('should throw NotFoundException when removing a non-existent contribution', async () => {
      mockContributionModel.findByPk.mockResolvedValueOnce(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('handleErrors', () => {
    it('should throw ConflictException for SequelizeUniqueConstraintError', () => {
      const error = new Error('Unique constraint');
      error.name = 'SequelizeUniqueConstraintError';

      expect(() => service.handleErrors(error)).toThrow(ConflictException);
    });

    it('should throw NotFoundException for "Contribution not found" message', () => {
      const error = new Error('Contribution not found');

      expect(() => service.handleErrors(error)).toThrow(NotFoundException);
    });

    it('should throw NotFoundException for "Circuit not found" message', () => {
      const error = new Error('Circuit not found');

      expect(() => service.handleErrors(error)).toThrow(NotFoundException);
    });

    it('should throw NotFoundException for "Participant not found" message', () => {
      const error = new Error('Participant not found');

      expect(() => service.handleErrors(error)).toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException for unknown errors', () => {
      const error = new Error('Unknown error');
      error.name = 'SomeUnknownError';

      expect(() => service.handleErrors(error)).toThrow(InternalServerErrorException);
    });

    it('should rethrow NestJS HTTP exceptions directly', () => {
      const error = new BadRequestException('Bad request');

      expect(() => service.handleErrors(error)).toThrow(BadRequestException);
    });
  });
});
