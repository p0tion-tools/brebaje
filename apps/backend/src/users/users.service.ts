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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.userModel.create({
        displayName: createUserDto.displayName,
        creationTime: createUserDto.creationTime,
        lastSignInTime: Date.now(),
        lastUpdated: Date.now(),
        avatarUrl: createUserDto.avatarUrl,
      });
      return user;
    } catch (error) {
      this.handleErrors(error as Error);
    }
  }

  async findAll() {
    try {
      return await this.userModel.findAll();
    } catch (error) {
      this.handleErrors(error as Error);
    }
  }

  async findById(id: number) {
    try {
      const user = await this.userModel.findByPk(id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      this.handleErrors(error as Error);
    }
  }

  async findByDisplayName(displayName: string) {
    try {
      const user = await this.userModel.findOne({
        where: { displayName },
      });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      this.handleErrors(error as Error);
    }
  }

  async findByGithubId(githubId: number) {
    try {
      const user = await this.userModel.findOne({
        where: { githubId },
      });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      this.handleErrors(error as Error);
    }
  }

  async findByIds(ids: number[]) {
    try {
      const users = await this.userModel.findAll({
        where: { id: ids },
      });
      return users;
    } catch (error) {
      this.handleErrors(error as Error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userModel.findByPk(id);
      if (!user) {
        throw new Error('User not found');
      }
      await user.update(updateUserDto);
      return user;
    } catch (error) {
      this.handleErrors(error as Error);
    }
  }

  async remove(id: number) {
    try {
      const user = await this.userModel.findByPk(id);
      if (!user) {
        throw new Error('User not found');
      }
      await user.destroy();
      return { message: 'User deleted successfully' };
    } catch (error) {
      this.handleErrors(error as Error);
    }
  }

  handleErrors(error: Error): never {
    switch (error.name) {
      case 'SequelizeUniqueConstraintError':
        throw new ConflictException('User already exists');
      case 'SequelizeValidationError':
        throw new BadRequestException('Invalid user data');
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
        if (error.message === 'User not found') {
          throw new NotFoundException('User not found');
        } else if (error.message === 'Insufficient permissions') {
          throw new ForbiddenException("You don't have permission to perform this action");
        }
        throw new InternalServerErrorException(error.message);
      default:
        throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
}
