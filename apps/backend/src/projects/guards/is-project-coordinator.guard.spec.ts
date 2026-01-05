import { ExecutionContext, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IsProjectCoordinatorGuard } from './is-project-coordinator.guard';
import { ProjectsService } from 'src/projects/projects.service';

describe('IsProjectCoordinatorGuard', () => {
  let guard: IsProjectCoordinatorGuard;
  let projectsService: ProjectsService;

  const mockProjectsService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IsProjectCoordinatorGuard,
        {
          provide: ProjectsService,
          useValue: mockProjectsService,
        },
      ],
    }).compile();

    guard = module.get<IsProjectCoordinatorGuard>(IsProjectCoordinatorGuard);
    projectsService = module.get<ProjectsService>(ProjectsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createMockExecutionContext = (userId: number, projectId?: number): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: userId },
          body: { projectId },
        }),
      }),
    } as ExecutionContext;
  };

  describe('canActivate', () => {
    it('should return true when user is the project coordinator', async () => {
      const userId = 1;
      const projectId = 1;
      const mockProject = { id: projectId, coordinatorId: userId };

      mockProjectsService.findOne.mockResolvedValue(mockProject);

      const context = createMockExecutionContext(userId, projectId);
      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(projectsService.findOne).toHaveBeenCalledWith(projectId);
    });

    it('should throw ForbiddenException when user is not the project coordinator', async () => {
      const userId = 1;
      const coordinatorId = 2;
      const projectId = 1;
      const mockProject = { id: projectId, coordinatorId };

      mockProjectsService.findOne.mockResolvedValue(mockProject);

      const context = createMockExecutionContext(userId, projectId);

      await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
      await expect(guard.canActivate(context)).rejects.toThrow(
        'Only the project coordinator can perform this action',
      );
    });

    it('should throw BadRequestException when projectId is not provided', async () => {
      const userId = 1;
      const context = createMockExecutionContext(userId);

      await expect(guard.canActivate(context)).rejects.toThrow(BadRequestException);
      await expect(guard.canActivate(context)).rejects.toThrow('projectId is required');
    });

    it('should propagate errors from ProjectsService', async () => {
      const userId = 1;
      const projectId = 999;
      const error = new Error('Project not found');

      mockProjectsService.findOne.mockRejectedValue(error);

      const context = createMockExecutionContext(userId, projectId);

      await expect(guard.canActivate(context)).rejects.toThrow(error);
    });
  });
});
