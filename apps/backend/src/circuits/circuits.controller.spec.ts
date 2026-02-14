import { Test, TestingModule } from '@nestjs/testing';
import { CircuitsController } from './circuits.controller';
import { CircuitsService } from './circuits.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IsCircuitCoordinatorGuard } from './guards/is-circuit-coordinator.guard';

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
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(IsCircuitCoordinatorGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<CircuitsController>(CircuitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
