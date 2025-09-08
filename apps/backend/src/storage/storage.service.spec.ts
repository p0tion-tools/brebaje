import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from './storage.service';
import { CeremoniesService } from '../ceremonies/ceremonies.service';

describe('StorageService', () => {
  let service: StorageService;

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Test to ensure s3 functionality are written in the e2e tests
});
