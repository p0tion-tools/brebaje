import { ConflictException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';
import { User } from 'src/users/user.model';

// Mock the Project model to avoid import issues
jest.mock('./project.model', () => {
  return {
    Project: class MockProject {},
  };
});

// Import after mocking
import { Project } from './project.model';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let mockProjectModel: {
    create: jest.Mock;
    findAll: jest.Mock;
    findByPk: jest.Mock;
    findOne: jest.Mock;
  };

  const mockProject = {
    id: 1,
    name: 'Test Project',
    contact: 'test@example.com',
    coordinatorId: 1,
    update: jest.fn(),
    destroy: jest.fn(),
  };

  const mockUser = {
    id: 1,
    displayName: 'Test User',
    // Add other User properties if needed by tests
  } as User;

  beforeEach(async () => {
    mockProjectModel = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getModelToken(Project),
          useValue: mockProjectModel,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a project', async () => {
      const createProjectDto: CreateProjectDto = {
        name: 'New Project',
        contact: 'contact@example.com',
      };

      const expectedProject = {
        name: createProjectDto.name,
        contact: createProjectDto.contact,
        coordinatorId: mockUser.id,
      };

      mockProjectModel.create.mockResolvedValue({
        id: 1,
        ...expectedProject,
      });

      const result = await service.create(createProjectDto, mockUser);

      expect(mockProjectModel.create).toHaveBeenCalledWith(expectedProject);
      expect(result).toEqual({ id: 1, ...expectedProject });
    });

    it('should throw a ConflictException when a project with the same name already exists', async () => {
      const createProjectDto: CreateProjectDto = {
        name: 'Existing Project',
        contact: 'contact@example.com',
      };

      const error = new Error('Project already exists');
      error.name = 'SequelizeUniqueConstraintError';
      mockProjectModel.create.mockRejectedValue(error);

      await expect(service.create(createProjectDto, mockUser)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an array of projects', async () => {
      const projects = [mockProject];
      mockProjectModel.findAll.mockResolvedValue(projects);

      const result = await service.findAll();

      expect(mockProjectModel.findAll).toHaveBeenCalled();
      expect(result).toEqual(projects);
    });
  });

  describe('findOne', () => {
    it('should return a single project by id', async () => {
      mockProjectModel.findByPk.mockResolvedValue(mockProject);

      const result = await service.findOne(1);

      expect(mockProjectModel.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProject);
    });

    it('should throw NotFoundException when project is not found', async () => {
      mockProjectModel.findByPk.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      const updateProjectDto: UpdateProjectDto = {
        name: 'Updated Project',
        contact: 'updated@example.com',
      };

      mockProjectModel.findByPk.mockResolvedValue(mockProject);
      mockProject.update.mockResolvedValue({
        ...mockProject,
        ...updateProjectDto,
      });

      const result = await service.update(1, updateProjectDto);

      expect(mockProjectModel.findByPk).toHaveBeenCalledWith(1);
      expect(mockProject.update).toHaveBeenCalledWith(updateProjectDto);
      expect(result).toEqual(mockProject);
    });

    it('should throw NotFoundException when updating a non-existent project', async () => {
      const updateProjectDto: UpdateProjectDto = {
        name: 'Updated Project',
      };

      mockProjectModel.findByPk.mockResolvedValue(null);

      await expect(service.update(999, updateProjectDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a project', async () => {
      mockProjectModel.findByPk.mockResolvedValue(mockProject);
      mockProject.destroy.mockResolvedValue(undefined);

      const result = await service.remove(1);

      expect(mockProjectModel.findByPk).toHaveBeenCalledWith(1);
      expect(mockProject.destroy).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Project deleted successfully' });
    });

    it('should throw NotFoundException when removing a non-existent project', async () => {
      mockProjectModel.findByPk.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
