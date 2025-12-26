/* eslint-disable @typescript-eslint/no-explicit-any */

import { Test, TestingModule } from '@nestjs/testing';
import { CeremonyState, CeremonyType } from 'src/types/enums';
import { CreateCeremonyDto } from './dto/create-ceremony.dto';
import { UpdateCeremonyDto } from './dto/update-ceremony.dto';

jest.mock('./ceremonies.service', () => {
  return {
    CeremoniesService: jest.fn(),
  };
});

import { CeremoniesController } from './ceremonies.controller';
import { CeremoniesService } from './ceremonies.service';

describe('CeremoniesController', () => {
  let controller: CeremoniesController;
  let service: CeremoniesService;

  beforeEach(async () => {
    const mockCeremoniesService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CeremoniesController],
      providers: [
        {
          provide: CeremoniesService,
          useValue: mockCeremoniesService,
        },
      ],
    }).compile();

    controller = module.get<CeremoniesController>(CeremoniesController);
    service = module.get<CeremoniesService>(CeremoniesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new ceremony', async () => {
      const createCeremonyDto: CreateCeremonyDto = {
        projectId: 1,
        description: 'Test Ceremony',
        type: CeremonyType.PHASE2,
        state: CeremonyState.SCHEDULED,
        start_date: 1672531200,
        end_date: 1675209600,
        penalty: 100,
        authProviders: { github: true, eth: false },
      };

      const expectedResult = {
        id: 1,
        ...createCeremonyDto,
      };

      // jest.spyOn(service, 'create').mockResolvedValue(expectedResult as any);
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve(expectedResult as any));

      expect(await controller.create(createCeremonyDto)).toBe(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createCeremonyDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of ceremonies', async () => {
      const expectedResult = [
        {
          id: 1,
          projectId: 1,
          description: 'Test Ceremony',
          type: CeremonyType.PHASE2,
          state: CeremonyState.SCHEDULED,
          start_date: 1672531200,
          end_date: 1675209600,
          penalty: 100,
          authProviders: { github: true, eth: false },
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult as any);

      expect(await controller.findAll()).toBe(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a ceremony by id', async () => {
      const expectedResult = {
        id: 1,
        projectId: 1,
        description: 'Test Ceremony',
        type: CeremonyType.PHASE2,
        state: CeremonyState.SCHEDULED,
        start_date: 1672531200,
        end_date: 1675209600,
        penalty: 100,
        authProviders: { github: true, eth: false },
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(expectedResult as any);

      expect(await controller.findOne('1')).toBe(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a ceremony', async () => {
      const updateCeremonyDto: UpdateCeremonyDto = {
        description: 'Updated Ceremony',
        state: CeremonyState.OPENED,
      };

      const expectedResult = {
        id: 1,
        projectId: 1,
        description: 'Updated Ceremony',
        type: CeremonyType.PHASE2,
        state: CeremonyState.OPENED,
        start_date: 1672531200,
        end_date: 1675209600,
        penalty: 100,
        authProviders: { github: true, eth: false },
      };

      jest.spyOn(service, 'update').mockResolvedValue(expectedResult as any);

      expect(await controller.update('1', updateCeremonyDto)).toBe(expectedResult);
      expect(service.update).toHaveBeenCalledWith(1, updateCeremonyDto);
    });
  });

  describe('remove', () => {
    it('should remove a ceremony', async () => {
      const expectedResult = { message: 'Ceremony deleted successfully' };

      jest.spyOn(service, 'remove').mockResolvedValue(expectedResult);

      expect(await controller.remove('1')).toBe(expectedResult);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
