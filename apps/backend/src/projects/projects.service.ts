import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GatewayTimeoutException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './project.model';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
  ) {}

  async create(createProjectDto: CreateProjectDto, user: any) {
    try {
      const project = await this.projectModel.create({
        name: createProjectDto.name,
        contact: createProjectDto.contact,
        coordinatorId: user.id,
        createdDate: Date.now(),
      });
      return project;
    } catch (error) {
      this.handleErrors(error as Error);
    }
  }

  async findAll() {
    try {
      return await this.projectModel.findAll();
    } catch (error) {
      this.handleErrors(error as Error);
    }
  }

  async findOne(id: number) {
    try {
      const project = await this.projectModel.findByPk(id);
      if (!project) {
        throw new Error('Project not found');
      }
      return project;
    } catch (error) {
      this.handleErrors(error as Error);
    }
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    try {
      const project = await this.projectModel.findByPk(id);
      if (!project) {
        throw new Error('Project not found');
      }
      await project.update(updateProjectDto);
      return project;
    } catch (error) {
      this.handleErrors(error as Error);
    }
  }

  async remove(id: number) {
    try {
      const project = await this.projectModel.findByPk(id);
      if (!project) {
        throw new Error('Project not found');
      }
      await project.destroy();
      return { message: 'Project deleted successfully' };
    } catch (error) {
      this.handleErrors(error as Error);
    }
  }

  handleErrors(error: Error): never {
    switch (error.name) {
      case 'SequelizeUniqueConstraintError':
        throw new ConflictException('Project already exists');
      case 'SequelizeValidationError':
        throw new BadRequestException('Invalid project data');
      case 'SequelizeForeignKeyConstraintError':
        throw new BadRequestException('Invalid reference to a related entity');
      case 'SequelizeTimeoutError':
        throw new GatewayTimeoutException('Database operation timed out');
      case 'SequelizeConnectionError':
        throw new ServiceUnavailableException('Failed to connect to the database');
      case 'SequelizeDatabaseError':
        throw new InternalServerErrorException('Database error occurred');
      case 'JsonWebTokenError':
        throw new UnauthorizedException('Invalid token');
      case 'TokenExpiredError':
        throw new UnauthorizedException('Token has expired');
      case 'Error':
        if (error.message === 'Project not found') {
          throw new NotFoundException('Project not found');
        } else if (error.message === 'Insufficient permissions') {
          throw new ForbiddenException("You don't have permission to perform this action");
        }
        throw new InternalServerErrorException(error.message);
      default:
        throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
}
