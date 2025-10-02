import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { StorageService } from './storage.service';
import { CeremoniesService } from '../ceremonies/ceremonies.service';

describe('StorageService', () => {
  let service: StorageService;
  let loggerSpy: jest.SpyInstance;

  beforeEach(async () => {
    const ceremoniesServiceMock = {
      findOne: jest.fn().mockResolvedValue({
        id: 1,
        description: 'Test Ceremony',
        project: {
          name: 'Test Project',
        },
      }),
    } as Partial<CeremoniesService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [StorageService, { provide: CeremoniesService, useValue: ceremoniesServiceMock }],
    }).compile();

    service = module.get<StorageService>(StorageService);

    // Mock the logger
    loggerSpy = jest.spyOn(service['logger'], 'log').mockImplementation();
  });

  afterEach(() => {
    loggerSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have logger instance', () => {
    expect(service['logger']).toBeInstanceOf(Logger);
  });

  it('should log messages when logger methods are called', () => {
    const testMessage = 'Test log message';
    service['logger'].log(testMessage);

    expect(loggerSpy).toHaveBeenCalledWith(testMessage);
  });

  // Test to ensure s3 functionality are written in the e2e tests
});
