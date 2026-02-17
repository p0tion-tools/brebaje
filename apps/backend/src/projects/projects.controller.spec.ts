/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { User } from 'src/users/user.model';

// Mock the dependencies
jest.mock('./projects.service', () => {
  return {
    ProjectsService: jest.fn(),
  };
});

jest.mock('./guards/is-project-coordinator-param.guard', () => {
  return {
    IsProjectCoordinatorParamGuard: jest.fn(),
  };
});

// Import after mocking
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { AuthenticatedRequest, JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IsProjectCoordinatorParamGuard } from './guards/is-project-coordinator-param.guard';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let service: ProjectsService;

  beforeEach(async () => {
    const mockProjectsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const mockJwtAuthGuard = {
      canActivate: jest.fn(() => true),
    };

    const mockIsProjectCoordinatorParamGuard = {
      canActivate: jest.fn(() => true),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: mockProjectsService,
        },
        {
          provide: JwtAuthGuard,
          useValue: mockJwtAuthGuard,
        },
        {
          provide: IsProjectCoordinatorParamGuard,
          useValue: mockIsProjectCoordinatorParamGuard,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideGuard(IsProjectCoordinatorParamGuard)
      .useValue(mockIsProjectCoordinatorParamGuard)
      .compile();

    controller = module.get<ProjectsController>(ProjectsController);
    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call the service to create a project', async () => {
      const createProjectDto = {
        name: 'New Project',
        contact: 'contact@example.com',
      };
      const mockUser = { id: 1, displayName: 'Test User' } as User;
      const mockReq = { user: mockUser } as Request & { user: User };
      const mockResult = { id: 1, name: 'New Project' };

      jest.spyOn(service, 'create').mockImplementation(() => Promise.resolve(mockResult as any));

      expect(await controller.create(createProjectDto, mockReq)).toBe(mockResult);
      expect(service.create).toHaveBeenCalledWith(createProjectDto, mockUser);
    });
  });

  describe('findAll', () => {
    it('should call the service to get all projects', async () => {
      const mockResult = [{ id: 1, name: 'Test Project' }];

      jest.spyOn(service, 'findAll').mockImplementation(() => Promise.resolve(mockResult as any));

      expect(await controller.findAll()).toBe(mockResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call the service to get one project', async () => {
      const mockResult = { id: 1, name: 'Test Project' };

      jest.spyOn(service, 'findOne').mockImplementation(() => Promise.resolve(mockResult as any));

      expect(await controller.findOne('1')).toBe(mockResult);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should call the service to update a project', async () => {
      const updateProjectDto = { name: 'Updated Project' };
      const mockResult = { id: 1, name: 'Updated Project' };

      jest.spyOn(service, 'update').mockImplementation(() => Promise.resolve(mockResult as any));

      expect(await controller.update('1', updateProjectDto)).toBe(mockResult);
      expect(service.update).toHaveBeenCalledWith(1, updateProjectDto);
    });
  });

  describe('remove', () => {
    it('should call the service to remove a project', async () => {
      const mockResult = { message: 'Project deleted successfully' };

      jest.spyOn(service, 'remove').mockImplementation(() => Promise.resolve(mockResult as any));

      expect(await controller.remove('1')).toBe(mockResult);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
