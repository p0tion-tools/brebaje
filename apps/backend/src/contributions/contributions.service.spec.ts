import { Test, TestingModule } from '@nestjs/testing';
import { ContributionsService } from './contributions.service';
import { getModelToken } from '@nestjs/sequelize';
import { Contribution } from './contribution.model';

describe('ContributionsService', () => {
  let service: ContributionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContributionsService,
        {
          provide: getModelToken(Contribution),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ContributionsService>(ContributionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
