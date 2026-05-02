import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantsController } from './participants.controller';
import { ParticipantsService } from './participants.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IsParticipantOwnerOrCoordinatorGuard } from './guards/is-participant-owner-or-coordinator.guard';

describe('ParticipantsController', () => {
  let controller: ParticipantsController;
  let participantService: jest.Mocked<ParticipantsService>;

  beforeEach(async () => {
    const mockParticipantService = {
      create: jest.fn().mockResolvedValue({}),
      findAll: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue({}),
      startContribution: jest.fn().mockResolvedValue({}),
      downloadingToComputing: jest.fn().mockResolvedValue({}),
      computingToUploading: jest.fn().mockResolvedValue({}),
      remove: jest.fn().mockResolvedValue({}),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParticipantsController],
      providers: [
        {
          provide: ParticipantsService,
          useValue: mockParticipantService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(IsParticipantOwnerOrCoordinatorGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ParticipantsController>(ParticipantsController);
    participantService = module.get<ParticipantsService>(
      ParticipantsService,
    ) as jest.Mocked<ParticipantsService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('startContribution', () => {
    it('should call participantsService.startContribution with the participant id', async () => {
      await controller.startContribution(1);
      expect(participantService.startContribution).toHaveBeenCalledWith(1);
    });
  });

  describe('downloadingToComputing', () => {
    it('should call participantsService.downloadingToComputing with the participant id', async () => {
      await controller.downloadingToComputing(1);
      expect(participantService.downloadingToComputing).toHaveBeenCalledWith(1);
    });
  });

  describe('computingToUploading', () => {
    it('should call participantsService.computingToUploading with the participant id', async () => {
      await controller.computingToUploading(1);
      expect(participantService.computingToUploading).toHaveBeenCalledWith(1);
    });
  });
});
