import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantsController } from './participants.controller';
import { ParticipantsService } from './participants.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

describe('ParticipantsController', () => {
  let controller: ParticipantsController;
  let participantService: jest.Mocked<ParticipantsService>;

  beforeEach(async () => {
    const mockParticipantService = {};

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
      .compile();

    controller = module.get<ParticipantsController>(ParticipantsController);
    participantService = module.get<ParticipantsService>(
      ParticipantsService,
    ) as jest.Mocked<ParticipantsService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined', () => {
    expect(participantService).toBeDefined();
  });
});
