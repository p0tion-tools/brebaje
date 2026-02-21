/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { UpdateContributionDto } from './dto/update-contribution.dto';

jest.mock('./contributions.service', () => {
  return {
    ContributionsService: jest.fn(),
  };
});

jest.mock('./guards/is-contribution-participant-or-coordinator.guard', () => {
  return {
    IsContributionParticipantOrCoordinatorGuard: jest.fn(),
  };
});

jest.mock('./guards/is-contribution-coordinator.guard', () => {
  return {
    IsContributionCoordinatorGuard: jest.fn(),
  };
});

import { ContributionsController } from './contributions.controller';
import { ContributionsService } from './contributions.service';
import { IsContributionParticipantOrCoordinatorGuard } from './guards/is-contribution-participant-or-coordinator.guard';
import { IsContributionCoordinatorGuard } from './guards/is-contribution-coordinator.guard';

describe('ContributionsController', () => {
  let controller: ContributionsController;
  let service: ContributionsService;

  beforeEach(async () => {
    const mockContributionsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      findValidOneByCircuitIdAndParticipantId: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContributionsController],
      providers: [
        {
          provide: ContributionsService,
          useValue: mockContributionsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(IsContributionParticipantOrCoordinatorGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(IsContributionCoordinatorGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ContributionsController>(ContributionsController);
    service = module.get<ContributionsService>(ContributionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new contribution', async () => {
      const createDto: CreateContributionDto = {
        circuitId: 1,
        participantId: 1,
      };
      const expectedResult = { id: 1, ...createDto };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult as any);

      expect(await controller.create(createDto)).toBe(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return all contributions without filters', async () => {
      const expectedResult = [{ id: 1, circuitId: 1, participantId: 1 }];

      jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult as any);

      expect(await controller.findAll()).toBe(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith(undefined, undefined);
    });

    it('should pass circuitId filter to service', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([] as any);

      await controller.findAll('1', undefined);

      expect(service.findAll).toHaveBeenCalledWith(1, undefined);
    });

    it('should pass participantId filter to service', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([] as any);

      await controller.findAll(undefined, '2');

      expect(service.findAll).toHaveBeenCalledWith(undefined, 2);
    });

    it('should pass both filters to service', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([] as any);

      await controller.findAll('1', '2');

      expect(service.findAll).toHaveBeenCalledWith(1, 2);
    });
  });

  describe('findValid', () => {
    it('should return a valid contribution', async () => {
      const expectedResult = {
        id: 1,
        circuitId: 1,
        participantId: 1,
        valid: true,
      };

      jest
        .spyOn(service, 'findValidOneByCircuitIdAndParticipantId')
        .mockResolvedValue(expectedResult as any);

      expect(await controller.findValid('1', '1')).toBe(expectedResult);
      expect(service.findValidOneByCircuitIdAndParticipantId).toHaveBeenCalledWith(1, 1);
    });

    it('should throw NotFoundException when no valid contribution exists', async () => {
      jest.spyOn(service, 'findValidOneByCircuitIdAndParticipantId').mockResolvedValue(null);

      await expect(controller.findValid('1', '1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a contribution by id', async () => {
      const expectedResult = {
        id: 1,
        circuitId: 1,
        participantId: 1,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(expectedResult as any);

      expect(await controller.findOne('1')).toBe(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a contribution', async () => {
      const updateDto: UpdateContributionDto = {
        valid: true,
        verifyContributionTime: 60,
      };
      const expectedResult = {
        id: 1,
        circuitId: 1,
        participantId: 1,
        ...updateDto,
      };

      jest.spyOn(service, 'update').mockResolvedValue(expectedResult as any);

      expect(await controller.update('1', updateDto)).toBe(expectedResult);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a contribution', async () => {
      const expectedResult = {
        message: 'Contribution removed successfully',
      };

      jest.spyOn(service, 'remove').mockResolvedValue(expectedResult);

      expect(await controller.remove('1')).toBe(expectedResult);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
