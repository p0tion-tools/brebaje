import { Test, TestingModule } from '@nestjs/testing';
import { VmService } from './vm.service';

describe('VmService', () => {
  let service: VmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VmService],
    }).compile();

    service = module.get<VmService>(VmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
