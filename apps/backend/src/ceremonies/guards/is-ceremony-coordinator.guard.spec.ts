import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException, BadRequestException } from '@nestjs/common';
import { IsCeremonyCoordinatorGuard } from './is-ceremony-coordinator.guard';
import { CeremoniesService } from '../ceremonies.service';
import { AuthenticatedRequest } from 'src/auth/guards/jwt-auth.guard';

describe('IsCeremonyCoordinatorGuard', () => {
  let guard: IsCeremonyCoordinatorGuard;
  let ceremoniesService: CeremoniesService;

  const mockCeremoniesService = {
    findCoordinatorOfCeremony: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IsCeremonyCoordinatorGuard,
        {
          provide: CeremoniesService,
          useValue: mockCeremoniesService,
        },
      ],
    }).compile();

    guard = module.get<IsCeremonyCoordinatorGuard>(IsCeremonyCoordinatorGuard);
    ceremoniesService = module.get<CeremoniesService>(CeremoniesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createMockExecutionContext = (
    userId?: number,
    ceremonyId?: number,
    paramId?: string,
  ): ExecutionContext => {
    const mockRequest: Partial<AuthenticatedRequest> = {
      user: userId ? { id: userId, displayName: 'Test User' } : undefined,
      body: ceremonyId ? { ceremonyId } : {},
      params: paramId ? { id: paramId } : {},
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

  it('should allow access when user is the coordinator (ceremonyId from params)', async () => {
    const userId = 1;
    const ceremonyId = 10;
    const mockCeremony = { id: ceremonyId, projectId: 1 };

    mockCeremoniesService.findCoordinatorOfCeremony.mockResolvedValue(mockCeremony);

    const context = createMockExecutionContext(userId, undefined, ceremonyId.toString());
    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(ceremoniesService.findCoordinatorOfCeremony).toHaveBeenCalledWith(userId, ceremonyId);
  });

  it('should allow access when user is the coordinator (ceremonyId from body)', async () => {
    const userId = 1;
    const ceremonyId = 10;
    const mockCeremony = { id: ceremonyId, projectId: 1 };

    mockCeremoniesService.findCoordinatorOfCeremony.mockResolvedValue(mockCeremony);

    const context = createMockExecutionContext(userId, ceremonyId);
    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(ceremoniesService.findCoordinatorOfCeremony).toHaveBeenCalledWith(userId, ceremonyId);
  });

  it('should throw ForbiddenException when user is not authenticated', async () => {
    const context = createMockExecutionContext(undefined, 10);

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
    await expect(guard.canActivate(context)).rejects.toThrow('User not authenticated');
  });

  it('should throw BadRequestException when ceremonyId is not provided', async () => {
    const context = createMockExecutionContext(1);

    await expect(guard.canActivate(context)).rejects.toThrow(BadRequestException);
    await expect(guard.canActivate(context)).rejects.toThrow('ceremonyId is required');
  });

  it('should throw ForbiddenException when user is not the coordinator', async () => {
    const userId = 1;
    const ceremonyId = 10;

    mockCeremoniesService.findCoordinatorOfCeremony.mockResolvedValue(null);

    const context = createMockExecutionContext(userId, ceremonyId);

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
    await expect(guard.canActivate(context)).rejects.toThrow(
      'Only the project coordinator can perform this action',
    );
  });
});
