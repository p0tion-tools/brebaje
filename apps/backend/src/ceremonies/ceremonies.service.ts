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
import { CreateCeremonyDto } from './dto/create-ceremony.dto';
import { UpdateCeremonyDto } from './dto/update-ceremony.dto';
import { Ceremony } from './ceremony.model';
import { Project } from 'src/projects/project.model';

@Injectable()
export class CeremoniesService {
  constructor(
    @InjectModel(Ceremony)
    private readonly ceremonyModel: typeof Ceremony,
  ) {}

  async create(createCeremonyDto: CreateCeremonyDto) {
    try {
      const ceremony = await this.ceremonyModel.create({
        projectId: createCeremonyDto.projectId,
        description: createCeremonyDto.description,
        type: createCeremonyDto.type,
        state: createCeremonyDto.state,
        start_date: createCeremonyDto.start_date,
        end_date: createCeremonyDto.end_date,
        penalty: createCeremonyDto.penalty,
        authProviders: createCeremonyDto.authProviders,
      });
      return ceremony;
    } catch (error) {
      this.handleErrors(error as Error);
    }
  }

  async findAll() {
    try {
      return await this.ceremonyModel.findAll();
    } catch (error) {
      this.handleErrors(error as Error);
    }
  }

  async findOne(id: number) {
    try {
      const ceremony = await this.ceremonyModel.findByPk(id, { include: [{ model: Project }] });
      if (!ceremony) {
        throw new Error('Ceremony not found');
      }
      return ceremony;
    } catch (error) {
      this.handleErrors(error as Error);
    }
  }

  async findCoordinatorOfCeremony(userId: number, ceremonyId: number) {
    return this.ceremonyModel.findOne({
      where: { id: ceremonyId },
      include: [
        {
          model: Project,
          where: { coordinatorId: userId },
          required: true,
        },
      ],
    });
  }

  async isCoordinator(userId: number, ceremonyId: number) {
    const isCoordinator = await this.findCoordinatorOfCeremony(userId, ceremonyId);
    return { isCoordinator: !!isCoordinator };
  }

  async update(id: number, updateCeremonyDto: UpdateCeremonyDto) {
    try {
      const ceremony = await this.ceremonyModel.findByPk(id);
      if (!ceremony) {
        throw new Error('Ceremony not found');
      }
      await ceremony.update(updateCeremonyDto);
      return ceremony;
    } catch (error) {
      this.handleErrors(error as Error);
    }
  }

  async remove(id: number) {
    try {
      const ceremony = await this.ceremonyModel.findByPk(id);
      if (!ceremony) {
        throw new Error('Ceremony not found');
      }
      await ceremony.destroy();
      return { message: 'Ceremony deleted successfully' };
    } catch (error) {
      this.handleErrors(error as Error);
    }
  }

  handleErrors(error: Error): never {
    switch (error.name) {
      case 'SequelizeUniqueConstraintError':
        throw new ConflictException('Ceremony already exists');
      case 'SequelizeValidationError':
        throw new BadRequestException('Invalid ceremony data');
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
        if (error.message === 'Ceremony not found') {
          throw new NotFoundException('Ceremony not found');
        } else if (error.message === 'Insufficient permissions') {
          throw new ForbiddenException("You don't have permission to perform this action");
        }
        throw new InternalServerErrorException(error.message);
      default:
        throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
}
