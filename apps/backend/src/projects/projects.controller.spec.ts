/* eslint-disable @typescript-eslint/no-explicit-any */

import { Test, TestingModule } from '@nestjs/testing';

// Mock the dependencies
jest.mock('./projects.service', () => {
  return {
    ProjectsService: jest.fn(),
  };
});

// Import after mocking
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

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

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: mockProjectsService,
        },
      ],
    }).compile();

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
        coordinatorId: 1,
      };
      const mockResult = { id: 1, name: 'New Project' };

      jest.spyOn(service, 'create').mockImplementation(() => Promise.resolve(mockResult as any));

      expect(await controller.create(createProjectDto)).toBe(mockResult);
      expect(service.create).toHaveBeenCalledWith(createProjectDto);
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
