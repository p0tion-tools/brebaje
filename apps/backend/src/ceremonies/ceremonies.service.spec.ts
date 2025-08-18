import { ConflictException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { CeremonyState, CeremonyType } from 'src/types/enums';
import { CeremoniesService } from './ceremonies.service';
import { CreateCeremonyDto } from './dto/create-ceremony.dto';
import { UpdateCeremonyDto } from './dto/update-ceremony.dto';

// Mock the Ceremony model to avoid import issues
jest.mock('./ceremony.model', () => {
  return {
    Ceremony: class MockCeremony {},
  };
});

// Import after mocking
import { Ceremony } from './ceremony.model';

describe('CeremoniesService', () => {
  let service: CeremoniesService;
  let mockCeremonyModel: {
    create: jest.Mock;
    findAll: jest.Mock;
    findByPk: jest.Mock;
    findOne: jest.Mock;
  };

  const mockCeremony = {
    id: 1,
    projectId: 1,
    description: 'Test Ceremony',
    type: CeremonyType.PHASE2,
    state: CeremonyState.SCHEDULED,
    start_date: 1672531200,
    end_date: 1675209600,
    penalty: 100,
    authProviders: { github: true, eth: false },
    update: jest.fn(),
    destroy: jest.fn(),
  };

  beforeEach(async () => {
    mockCeremonyModel = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CeremoniesService,
        {
          provide: getModelToken(Ceremony),
          useValue: mockCeremonyModel,
        },
      ],
    }).compile();

    service = module.get<CeremoniesService>(CeremoniesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a ceremony', async () => {
      const createCeremonyDto: CreateCeremonyDto = {
        projectId: 1,
        description: 'New Ceremony',
        type: CeremonyType.PHASE2,
        state: CeremonyState.SCHEDULED,
        start_date: 1672531200,
        end_date: 1675209600,
        penalty: 100,
        authProviders: { github: true, eth: false },
      };

      mockCeremonyModel.create.mockResolvedValueOnce({
        id: 1,
        ...createCeremonyDto,
      });

      const result = await service.create(createCeremonyDto);

      expect(mockCeremonyModel.create).toHaveBeenCalledWith(createCeremonyDto);
      expect(result).toEqual({ id: 1, ...createCeremonyDto });
    });

    it('should throw a ConflictException when a ceremony with the same name already exists', async () => {
      const createCeremonyDto: CreateCeremonyDto = {
        projectId: 1,
        description: 'Existing Ceremony',
        type: CeremonyType.PHASE2,
        state: CeremonyState.SCHEDULED,
        start_date: 1672531200,
        end_date: 1675209600,
        penalty: 100,
        authProviders: { github: true, eth: false },
      };

      const error = new Error('Ceremony already exists');
      error.name = 'SequelizeUniqueConstraintError';
      mockCeremonyModel.create.mockRejectedValueOnce(error);

      await expect(service.create(createCeremonyDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an array of ceremonies', async () => {
      const ceremonies = [mockCeremony];
      mockCeremonyModel.findAll.mockResolvedValueOnce(ceremonies);

      const result = await service.findAll();

      expect(mockCeremonyModel.findAll).toHaveBeenCalled();
      expect(result).toEqual(ceremonies);
    });
  });

  describe('findOne', () => {
    it('should return a single ceremony by id', async () => {
      mockCeremonyModel.findByPk.mockResolvedValueOnce(mockCeremony);

      const result = await service.findOne(1);

      expect(mockCeremonyModel.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCeremony);
    });

    it('should throw NotFoundException when ceremony is not found', async () => {
      mockCeremonyModel.findByPk.mockResolvedValueOnce(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a ceremony', async () => {
      const updateCeremonyDto: UpdateCeremonyDto = {
        description: 'Updated Ceremony',
        state: CeremonyState.OPENED,
      };

      mockCeremonyModel.findByPk.mockResolvedValueOnce(mockCeremony);
      mockCeremony.update.mockResolvedValueOnce({
        ...mockCeremony,
        ...updateCeremonyDto,
      });

      const result = await service.update(1, updateCeremonyDto);

      expect(mockCeremonyModel.findByPk).toHaveBeenCalledWith(1);
      expect(mockCeremony.update).toHaveBeenCalledWith(updateCeremonyDto);
      expect(result).toEqual(mockCeremony);
    });

    it('should throw NotFoundException when updating a non-existent ceremony', async () => {
      const updateCeremonyDto: UpdateCeremonyDto = {
        description: 'Updated Ceremony',
      };

      mockCeremonyModel.findByPk.mockResolvedValueOnce(null);

      await expect(service.update(999, updateCeremonyDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a ceremony', async () => {
      mockCeremonyModel.findByPk.mockResolvedValueOnce(mockCeremony);
      mockCeremony.destroy.mockResolvedValueOnce(undefined);

      const result = await service.remove(1);

      expect(mockCeremonyModel.findByPk).toHaveBeenCalledWith(1);
      expect(mockCeremony.destroy).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Ceremony deleted successfully' });
    });

    it('should throw NotFoundException when removing a non-existent ceremony', async () => {
      mockCeremonyModel.findByPk.mockResolvedValueOnce(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
