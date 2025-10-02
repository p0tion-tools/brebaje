import { Test, TestingModule } from '@nestjs/testing';
import { CircuitsController } from './circuits.controller';
import { CircuitsService } from './circuits.service';

describe('CircuitsController', () => {
  let controller: CircuitsController;

  beforeEach(async () => {
    const mockCircuitsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CircuitsController],
      providers: [
        {
          provide: CircuitsService,
          useValue: mockCircuitsService,
        },
      ],
    }).compile();

    controller = module.get<CircuitsController>(CircuitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
