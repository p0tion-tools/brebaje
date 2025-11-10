import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantsService } from './participants.service';
import { getModelToken } from '@nestjs/sequelize';
import { Participant } from './participant.model';
import { CircuitsService } from 'src/circuits/circuits.service';
import { Sequelize } from 'sequelize-typescript';

describe('ParticipantsService', () => {
  let service: ParticipantsService;
  let mockCircuitsService: Partial<CircuitsService>;

  beforeEach(async () => {
    mockCircuitsService = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParticipantsService,
        {
          provide: Sequelize,
          useValue: {
            // Mock the necessary Sequelize methods and properties
            transaction: jest.fn(),
          },
        },
        { provide: getModelToken(Participant), useValue: {} },
        { provide: CircuitsService, useValue: mockCircuitsService },
      ],
    }).compile();

    service = module.get<ParticipantsService>(ParticipantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
