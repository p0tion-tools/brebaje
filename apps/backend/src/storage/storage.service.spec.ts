import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from './storage.service';
import { CeremoniesService } from '../ceremonies/ceremonies.service';
import { ParticipantsService } from '../participants/participants.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(async () => {
    const mockCeremoniesService = {
      findOne: jest.fn(),
    };

    const mockParticipantsService = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        {
          provide: CeremoniesService,
          useValue: mockCeremoniesService,
        },
        {
          provide: ParticipantsService,
          useValue: mockParticipantsService,
        },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create S3 client', () => {
    const s3Client = service.getS3Client();
    expect(s3Client).toBeDefined();
  });
});
