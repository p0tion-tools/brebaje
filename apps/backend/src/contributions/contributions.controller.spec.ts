import { Test, TestingModule } from '@nestjs/testing';
import { ContributionsController } from './contributions.controller';
import { ContributionsService } from './contributions.service';

describe('ContributionsController', () => {
  let controller: ContributionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContributionsController],
      providers: [ContributionsService],
    }).compile();

    controller = module.get<ContributionsController>(ContributionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
