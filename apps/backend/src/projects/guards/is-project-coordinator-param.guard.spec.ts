import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException, BadRequestException } from '@nestjs/common';
import { IsProjectCoordinatorParamGuard } from './is-project-coordinator-param.guard';
import { ProjectsService } from '../projects.service';
import { AuthenticatedRequest } from 'src/auth/guards/jwt-auth.guard';

describe('IsProjectCoordinatorParamGuard', () => {
  let guard: IsProjectCoordinatorParamGuard;
  let projectsService: ProjectsService;

  const mockProjectsService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IsProjectCoordinatorParamGuard,
        {
          provide: ProjectsService,
          useValue: mockProjectsService,
        },
      ],
    }).compile();

    guard = module.get<IsProjectCoordinatorParamGuard>(IsProjectCoordinatorParamGuard);
    projectsService = module.get<ProjectsService>(ProjectsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createMockExecutionContext = (userId?: number, projectId?: string): ExecutionContext => {
    const mockRequest: Partial<AuthenticatedRequest> = {
      user: userId ? ({ id: userId, displayName: 'Test User' } as any) : undefined,
      params: projectId ? { id: projectId } : {},
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
    const projectId = '10';
    const mockProject = { id: 10, coordinatorId: userId };

    mockProjectsService.findOne.mockResolvedValue(mockProject);

    const context = createMockExecutionContext(userId, projectId);
    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(projectsService.findOne).toHaveBeenCalledWith(10);
  });

  it('should throw ForbiddenException when user is not authenticated', async () => {
    const context = createMockExecutionContext(undefined, '10');

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
    await expect(guard.canActivate(context)).rejects.toThrow('User not authenticated');
  });

  it('should throw BadRequestException when projectId is not provided', async () => {
    const context = createMockExecutionContext(1);

    await expect(guard.canActivate(context)).rejects.toThrow(BadRequestException);
    await expect(guard.canActivate(context)).rejects.toThrow('projectId is required');
  });

  it('should throw ForbiddenException when user is not the coordinator', async () => {
    const userId = 1;
    const projectId = '10';
    const mockProject = { id: 10, coordinatorId: 2 }; // Different coordinator

    mockProjectsService.findOne.mockResolvedValue(mockProject);

    const context = createMockExecutionContext(userId, projectId);

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
    await expect(guard.canActivate(context)).rejects.toThrow(
      'Only the project coordinator can perform this action',
    );
  });
});
