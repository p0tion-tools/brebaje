import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserErrorResponse } from 'src/types/declarations';
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
    return this.userModel
      .create({
        displayName: createUserDto.displayName,
        creationTime: Date.now(),
        lastSignInTime: Date.now(),
        lastUpdated: Date.now(),
        avatarUrl: createUserDto.avatarUrl,
      })
      .then((user) => {
        return user;
      })
      .catch((error: Error) => {
        console.log('NICO ERROR', error);
        this.handleErrors(error);
      });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    console.log('Update User DTO:', updateUserDto);
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  handleErrors(error: Error): UserErrorResponse {
    let message = error.message;
    let statusCode = 500;

    switch (error.name) {
      case 'SequelizeUniqueConstraintError':
        message = 'User already exists';
        statusCode = 409; // Conflict
        break;
      case 'SequelizeValidationError':
        message = 'Invalid user data';
        statusCode = 400; // Bad Request
        break;
      case 'SequelizeForeignKeyConstraintError':
        message = 'Invalid reference to a related entity';
        statusCode = 400; // Bad Request
        break;
      case 'SequelizeTimeoutError':
        message = 'Database operation timed out';
        statusCode = 504; // Gateway Timeout
        break;
      case 'SequelizeConnectionError':
        message = 'Failed to connect to the database';
        statusCode = 503; // Service Unavailable
        break;
      case 'SequelizeDatabaseError':
        message = 'Database error occurred';
        statusCode = 500; // Internal Server Error
        break;
      case 'JsonWebTokenError':
        message = 'Invalid token';
        statusCode = 401; // Unauthorized
        break;
      case 'TokenExpiredError':
        message = 'Token has expired';
        statusCode = 401; // Unauthorized
        break;
      case 'Error':
        if (error.message === 'User not found') {
          statusCode = 404; // Not Found
        } else if (error.message === 'Insufficient permissions') {
          message = "You don't have permission to perform this action";
          statusCode = 403; // Forbidden
        }
        break;
      default:
        message = 'An unexpected error occurred';
        statusCode = 500; // Internal Server Error
    }

    return {
      message,
      name: error.name,
      statusCode,
      user: null,
    };
  }
}
