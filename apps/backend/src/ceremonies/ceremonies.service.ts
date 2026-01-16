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
import { CeremonyState, ParticipantStatus, ParticipantContributionStep } from 'src/types/enums';
import { User } from 'src/users/user.model';
import { ParticipantsService } from 'src/participants/participants.service';

@Injectable()
export class CeremoniesService {
  constructor(
    @InjectModel(Ceremony)
    private readonly ceremonyModel: typeof Ceremony,
    private readonly participantsService: ParticipantsService,
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

  async findOpen() {
    try {
      return await this.ceremonyModel.findAll({ where: { state: CeremonyState.OPENED } });
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

  findCoordinatorOfCeremony(userId: number, ceremonyId: number) {
    return this.ceremonyModel.findOne({ where: { id: ceremonyId, coordinatorId: userId } });
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

  async joinCeremony(ceremonyId: number, user: User) {
    try {
      // 1. Fetch ceremony
      const ceremony = await this.findOne(ceremonyId);

      // 2. Validate ceremony is OPENED
      if (ceremony.state !== CeremonyState.OPENED) {
        throw new BadRequestException('Ceremony is not open for participation');
      }

      // 3. Validate user's provider is allowed
      const authProviders = ceremony.authProviders as string[];
      const userProviderLower = user.provider.toLowerCase();
      if (!authProviders.includes(userProviderLower)) {
        throw new ForbiddenException(
          `Your authentication provider (${user.provider}) is not allowed for this ceremony`,
        );
      }

      // 4. Check if user already joined
      try {
        const existing = await this.participantsService.findByUserIdAndCeremonyId(
          user.id!,
          ceremonyId,
        );
        if (existing) {
          return { message: 'Already joined', participant: existing };
        }
      } catch (error) {
        // Participant not found, continue to create
      }

      // 5. Create participant
      const participant = await this.participantsService.create({
        userId: user.id!,
        ceremonyId: ceremonyId,
        status: ParticipantStatus.READY,
        contributionStep: ParticipantContributionStep.DOWNLOADING,
        contributionProgress: 0,
      });

      return { message: 'Successfully joined ceremony', participant };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      this.handleErrors(error as Error);
    }
  }

  async getCeremonyParticipants(ceremonyId: number) {
    try {
      // Verify ceremony exists
      await this.findOne(ceremonyId);

      // Fetch participants with user details
      const participants = await this.participantsService.findAll();
      const ceremonyParticipants = participants.filter((p) => p.ceremonyId === ceremonyId);

      return ceremonyParticipants;
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
