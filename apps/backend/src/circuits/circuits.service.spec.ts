import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { CircuitsService } from './circuits.service';
import { Circuit } from './circuit.model';
import { VmService } from 'src/vm/vm.service';
import { StorageService } from 'src/storage/storage.service';

describe('CircuitsService', () => {
  let service: CircuitsService;
  let mockCircuitModel: {
    create: jest.Mock;
    findAll: jest.Mock;
    findByPk: jest.Mock;
    findOne: jest.Mock;
  };
  let mockVmService: Partial<VmService>;
  let mockStorageService: Partial<StorageService>;

  beforeEach(async () => {
    mockCircuitModel = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      findOne: jest.fn(),
    };

    mockVmService = {
      vmBootstrapCommands: jest.fn(),
      vmDependenciesAndCacheArtifactsCommand: jest.fn(),
    };

    mockStorageService = {
      getCeremonyBucketName: jest.fn(),
      uploadObject: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CircuitsService,
        {
          provide: getModelToken(Circuit),
          useValue: mockCircuitModel,
        },
        {
          provide: VmService,
          useValue: mockVmService,
        },
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
      ],
    }).compile();

    service = module.get<CircuitsService>(CircuitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
