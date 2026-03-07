import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException, BadRequestException } from '@nestjs/common';
import { IsCircuitCreateCoordinatorGuard } from './is-circuit-create-coordinator.guard';
import { CeremoniesService } from 'src/ceremonies/ceremonies.service';
import { AuthenticatedRequest } from 'src/auth/guards/jwt-auth.guard';
import { CeremonyState } from 'src/types/enums';

describe('IsCircuitCreateCoordinatorGuard', () => {
  let guard: IsCircuitCreateCoordinatorGuard;
  let ceremoniesService: CeremoniesService;

  const mockCeremoniesService = {
    findCoordinatorOfCeremony: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IsCircuitCreateCoordinatorGuard,
        {
          provide: CeremoniesService,
          useValue: mockCeremoniesService,
        },
      ],
    }).compile();

    guard = module.get<IsCircuitCreateCoordinatorGuard>(IsCircuitCreateCoordinatorGuard);
    ceremoniesService = module.get<CeremoniesService>(CeremoniesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createMockExecutionContext = (userId?: number, ceremonyId?: number): ExecutionContext => {
    const mockRequest: Partial<AuthenticatedRequest> = {
      user: userId ? ({ id: userId, displayName: 'Test User' } as any) : undefined,
      params: {},
      body: ceremonyId !== undefined ? { ceremonyId } : {},
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
    const ceremonyId = 5;
    const mockCeremony = {
      id: ceremonyId,
      projectId: 1,
      state: CeremonyState.SCHEDULED,
    };

    mockCeremoniesService.findCoordinatorOfCeremony.mockResolvedValue(mockCeremony);

    const context = createMockExecutionContext(userId, ceremonyId);
    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(ceremoniesService.findCoordinatorOfCeremony).toHaveBeenCalledWith(userId, ceremonyId);
  });

  it('should throw ForbiddenException when user is not authenticated', async () => {
    const context = createMockExecutionContext(undefined, 5);

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
    await expect(guard.canActivate(context)).rejects.toThrow('User not authenticated');
  });

  it('should throw BadRequestException when ceremonyId is not in body', async () => {
    const context = createMockExecutionContext(1);

    await expect(guard.canActivate(context)).rejects.toThrow(BadRequestException);
    await expect(guard.canActivate(context)).rejects.toThrow(
      'ceremonyId is required in the request body',
    );
  });

  it('should throw ForbiddenException when user is not the coordinator', async () => {
    const userId = 1;
    const ceremonyId = 5;

    mockCeremoniesService.findCoordinatorOfCeremony.mockResolvedValue(null);

    const context = createMockExecutionContext(userId, ceremonyId);

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
    await expect(guard.canActivate(context)).rejects.toThrow(
      'Only the project coordinator can create circuits for this ceremony',
    );
  });

  it('should throw ForbiddenException when ceremony is not SCHEDULED', async () => {
    const userId = 1;
    const ceremonyId = 5;
    const mockCeremony = {
      id: ceremonyId,
      projectId: 1,
      state: CeremonyState.OPENED,
    };

    mockCeremoniesService.findCoordinatorOfCeremony.mockResolvedValue(mockCeremony);

    const context = createMockExecutionContext(userId, ceremonyId);

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
    await expect(guard.canActivate(context)).rejects.toThrow(
      'Circuits can only be created when the ceremony is SCHEDULED',
    );
  });

  it('should throw ForbiddenException when ceremony is CLOSED', async () => {
    const userId = 1;
    const ceremonyId = 5;
    const mockCeremony = {
      id: ceremonyId,
      projectId: 1,
      state: CeremonyState.CLOSED,
    };

    mockCeremoniesService.findCoordinatorOfCeremony.mockResolvedValue(mockCeremony);

    const context = createMockExecutionContext(userId, ceremonyId);

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
    await expect(guard.canActivate(context)).rejects.toThrow(
      'Circuits can only be created when the ceremony is SCHEDULED',
    );
  });
});
