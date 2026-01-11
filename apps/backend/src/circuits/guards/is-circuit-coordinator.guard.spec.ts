import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException, BadRequestException } from '@nestjs/common';
import { IsCircuitCoordinatorGuard } from './is-circuit-coordinator.guard';
import { CircuitsService } from '../circuits.service';
import { CeremoniesService } from 'src/ceremonies/ceremonies.service';
import { AuthenticatedRequest } from 'src/auth/guards/jwt-auth.guard';
import { CeremonyState } from 'src/types/enums';

describe('IsCircuitCoordinatorGuard', () => {
  let guard: IsCircuitCoordinatorGuard;
  let circuitsService: CircuitsService;
  let ceremoniesService: CeremoniesService;

  const mockCircuitsService = {
    findOne: jest.fn(),
  };

  const mockCeremoniesService = {
    findCoordinatorOfCeremony: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IsCircuitCoordinatorGuard,
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

    guard = module.get<IsCircuitCoordinatorGuard>(IsCircuitCoordinatorGuard);
    circuitsService = module.get<CircuitsService>(CircuitsService);
    ceremoniesService = module.get<CeremoniesService>(CeremoniesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createMockExecutionContext = (userId?: number, circuitId?: string): ExecutionContext => {
    const mockRequest: Partial<AuthenticatedRequest> = {
      user: userId ? { id: userId, displayName: 'Test User' } : undefined,
      params: circuitId ? { id: circuitId } : {},
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

  it('should allow access when user is coordinator and ceremony is SCHEDULED', async () => {
    const userId = 1;
    const circuitId = '10';
    const ceremonyId = 5;
    const mockCircuit = { id: 10, ceremonyId };
    const mockCeremony = { id: ceremonyId, projectId: 1, state: CeremonyState.SCHEDULED };

    mockCircuitsService.findOne.mockResolvedValue(mockCircuit);
    mockCeremoniesService.findCoordinatorOfCeremony.mockResolvedValue(mockCeremony);

    const context = createMockExecutionContext(userId, circuitId);
    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(circuitsService.findOne).toHaveBeenCalledWith(10);
    expect(ceremoniesService.findCoordinatorOfCeremony).toHaveBeenCalledWith(userId, ceremonyId);
  });

  it('should throw ForbiddenException when user is not authenticated', async () => {
    const context = createMockExecutionContext(undefined, '10');

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
    await expect(guard.canActivate(context)).rejects.toThrow('User not authenticated');
  });

  it('should throw BadRequestException when circuitId is not provided', async () => {
    const context = createMockExecutionContext(1);

    await expect(guard.canActivate(context)).rejects.toThrow(BadRequestException);
    await expect(guard.canActivate(context)).rejects.toThrow('circuitId is required');
  });

  it('should throw BadRequestException when circuit is not found', async () => {
    const userId = 1;
    const circuitId = '10';

    mockCircuitsService.findOne.mockResolvedValue(null);

    const context = createMockExecutionContext(userId, circuitId);

    await expect(guard.canActivate(context)).rejects.toThrow(BadRequestException);
    await expect(guard.canActivate(context)).rejects.toThrow('Circuit not found');
  });

  it('should throw ForbiddenException when user is not the coordinator', async () => {
    const userId = 1;
    const circuitId = '10';
    const ceremonyId = 5;
    const mockCircuit = { id: 10, ceremonyId };

    mockCircuitsService.findOne.mockResolvedValue(mockCircuit);
    mockCeremoniesService.findCoordinatorOfCeremony.mockResolvedValue(null);

    const context = createMockExecutionContext(userId, circuitId);

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
    await expect(guard.canActivate(context)).rejects.toThrow(
      'Only the project coordinator can perform this action',
    );
  });

  it('should throw ForbiddenException when ceremony is not SCHEDULED', async () => {
    const userId = 1;
    const circuitId = '10';
    const ceremonyId = 5;
    const mockCircuit = { id: 10, ceremonyId };
    const mockCeremony = { id: ceremonyId, projectId: 1, state: CeremonyState.OPENED };

    mockCircuitsService.findOne.mockResolvedValue(mockCircuit);
    mockCeremoniesService.findCoordinatorOfCeremony.mockResolvedValue(mockCeremony);

    const context = createMockExecutionContext(userId, circuitId);

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
    await expect(guard.canActivate(context)).rejects.toThrow(
      'Circuits can only be modified when the ceremony is SCHEDULED',
    );
  });
});
