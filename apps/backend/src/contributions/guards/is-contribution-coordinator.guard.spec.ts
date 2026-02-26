import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { IsContributionCoordinatorGuard } from './is-contribution-coordinator.guard';
import { ContributionsService } from '../contributions.service';
import { CircuitsService } from 'src/circuits/circuits.service';
import { CeremoniesService } from 'src/ceremonies/ceremonies.service';
import { AuthenticatedRequest } from 'src/auth/guards/jwt-auth.guard';

describe('IsContributionCoordinatorGuard', () => {
  let guard: IsContributionCoordinatorGuard;

  const mockContributionsService = {
    findOne: jest.fn(),
  };

  const mockCircuitsService = {
    findOne: jest.fn(),
  };

  const mockCeremoniesService = {
    findCoordinatorOfCeremony: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IsContributionCoordinatorGuard,
        {
          provide: ContributionsService,
          useValue: mockContributionsService,
        },
        {
          provide: CircuitsService,
          useValue: mockCircuitsService,
        },
        {
          provide: CeremoniesService,
          useValue: mockCeremoniesService,
        },
      ],
    }).compile();

    guard = module.get<IsContributionCoordinatorGuard>(IsContributionCoordinatorGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createContext = (userId?: number, params?: Record<string, string>): ExecutionContext => {
    const mockRequest: Partial<AuthenticatedRequest> = {
      user: userId ? ({ id: userId, displayName: 'Test User' } as any) : undefined,
      params: params || {},
    };
    return {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;
  };

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access when user is the coordinator', async () => {
    const userId = 1;
    const contribution = { id: 1, circuitId: 1, participantId: 1 };
    const circuit = { id: 1, ceremonyId: 10 };
    const ceremony = { id: 10, projectId: 1 };

    mockContributionsService.findOne.mockResolvedValue(contribution);
    mockCircuitsService.findOne.mockResolvedValue(circuit);
    mockCeremoniesService.findCoordinatorOfCeremony.mockResolvedValue(ceremony);

    const context = createContext(userId, { id: '1' });

    expect(await guard.canActivate(context)).toBe(true);
    expect(mockCeremoniesService.findCoordinatorOfCeremony).toHaveBeenCalledWith(userId, 10);
  });

  it('should throw ForbiddenException when user is not authenticated', async () => {
    const context = createContext(undefined, { id: '1' });

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  it('should throw BadRequestException when contribution id is missing', async () => {
    const context = createContext(1, {});

    await expect(guard.canActivate(context)).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException when contribution does not exist', async () => {
    mockContributionsService.findOne.mockRejectedValue(
      new NotFoundException('Contribution not found'),
    );

    const context = createContext(1, { id: '999' });

    await expect(guard.canActivate(context)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException when circuit does not exist', async () => {
    const contribution = { id: 1, circuitId: 999, participantId: 1 };
    mockContributionsService.findOne.mockResolvedValue(contribution);
    mockCircuitsService.findOne.mockResolvedValue(null);

    const context = createContext(1, { id: '1' });

    await expect(guard.canActivate(context)).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException when user is not the coordinator', async () => {
    const contribution = { id: 1, circuitId: 1, participantId: 1 };
    const circuit = { id: 1, ceremonyId: 10 };

    mockContributionsService.findOne.mockResolvedValue(contribution);
    mockCircuitsService.findOne.mockResolvedValue(circuit);
    mockCeremoniesService.findCoordinatorOfCeremony.mockResolvedValue(null);

    const context = createContext(999, { id: '1' });

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });
});
