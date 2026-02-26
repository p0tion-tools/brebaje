import {
  Injectable,
  Inject,
  forwardRef,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GatewayTimeoutException,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { UpdateContributionDto } from './dto/update-contribution.dto';
import { Contribution } from './contribution.model';
import { Circuit } from 'src/circuits/circuit.model';
import { Participant } from 'src/participants/participant.model';
import { CircuitsService } from 'src/circuits/circuits.service';
import { ParticipantsService } from 'src/participants/participants.service';
import {
  canCreateContribution,
  canSetContributionValidity,
  CREATE_TRANSITION_ERROR,
  SET_VALID_TRANSITION_ERROR,
} from './contribution-transitions';

@Injectable()
export class ContributionsService {
  constructor(
    @InjectModel(Contribution)
    private contributionModel: typeof Contribution,
    @Inject(forwardRef(() => CircuitsService))
    private readonly circuitsService: CircuitsService,
    @Inject(forwardRef(() => ParticipantsService))
    private readonly participantsService: ParticipantsService,
  ) {}

  /**
   * Creates a new contribution after validating the referenced circuit, participant,
   * lifecycle state, and duplicate-contribution constraints.
   *
   * The participant must be in `CONTRIBUTING` status with contribution step
   * `UPLOADING` or `VERIFYING` — matching p0tion's flow where the contribution
   * record is created during the upload/verification phase.
   *
   * @param createContributionDto - The DTO containing contribution creation data
   * @returns The created contribution record
   * @throws {NotFoundException} If the circuit or participant does not exist
   * @throws {BadRequestException} If the participant does not belong to the circuit's ceremony
   *   or is not in a valid lifecycle state to contribute
   * @throws {ConflictException} If a valid contribution already exists for this circuit and participant
   */
  async create(createContributionDto: CreateContributionDto) {
    try {
      const circuit = await this.circuitsService.findOne(createContributionDto.circuitId);
      if (!circuit) {
        throw new Error('Circuit not found');
      }

      const participant = await this.participantsService.findOne(
        createContributionDto.participantId,
      );
      if (!participant) {
        throw new Error('Participant not found');
      }

      if (participant.ceremonyId !== circuit.ceremonyId) {
        throw new BadRequestException(
          'Participant does not belong to the ceremony of this circuit',
        );
      }

      if (!canCreateContribution(participant)) {
        throw new BadRequestException(CREATE_TRANSITION_ERROR);
      }

      const existingValid = await this.findValidOneByCircuitIdAndParticipantId(
        createContributionDto.circuitId,
        createContributionDto.participantId,
      );
      if (existingValid) {
        throw new ConflictException(
          'A valid contribution already exists for this circuit and participant',
        );
      }

      return await this.contributionModel.create({
        ...createContributionDto,
      });
    } catch (error) {
      this.handleErrors(error as Error);
    }
  }

  /**
   * Retrieves all contributions, with optional filtering.
   *
   * @param circuitId - Optional circuit ID to filter by
   * @param participantId - Optional participant ID to filter by
   * @returns Array of contribution records
   */
  async findAll(circuitId?: number, participantId?: number) {
    try {
      const where: Record<string, number> = {};
      if (circuitId !== undefined) {
        where.circuitId = circuitId;
      }
      if (participantId !== undefined) {
        where.participantId = participantId;
      }

      return await this.contributionModel.findAll({
        where,
        include: [Circuit, Participant],
      });
    } catch (error) {
      this.handleErrors(error as Error);
    }
  }

  /**
   * Finds a single contribution by its primary key.
   *
   * @param id - The contribution's unique identifier
   * @returns The contribution record with related circuit and participant
   * @throws {NotFoundException} If the contribution does not exist
   */
  async findOne(id: number) {
    try {
      const contribution = await this.contributionModel.findByPk(id, {
        include: [Circuit, Participant],
      });
      if (!contribution) {
        throw new Error('Contribution not found');
      }
      return contribution;
    } catch (error) {
      this.handleErrors(error as Error);
    }
  }

  /**
   * Finds a valid contribution for a specific circuit and participant.
   *
   * @param circuitId - The circuit's unique identifier
   * @param participantId - The participant's unique identifier
   * @returns The valid contribution or null if none exists
   */
  async findValidOneByCircuitIdAndParticipantId(circuitId: number, participantId: number) {
    return this.contributionModel.findOne({
      where: {
        circuitId,
        participantId,
        valid: true,
      },
    });
  }

  /**
   * Updates a contribution by ID with partial data.
   *
   * When the payload includes `valid`, the owning participant's lifecycle state
   * is checked: the participant must be `CONTRIBUTED` or `FINALIZED` with step
   * `VERIFYING` or `COMPLETED`. If the contribution already has the same `valid`
   * value, the update proceeds idempotently (no state corruption on retries).
   *
   * Fields other than `valid` (timing, files, etc.) can be updated without
   * lifecycle checks.
   *
   * @param id - The contribution's unique identifier
   * @param updateContributionDto - The DTO containing the fields to update
   * @returns The updated contribution record
   * @throws {NotFoundException} If the contribution does not exist
   * @throws {BadRequestException} If setting `valid` while participant is not in a valid lifecycle state
   */
  async update(id: number, updateContributionDto: UpdateContributionDto) {
    try {
      const contribution = await this.contributionModel.findByPk(id);
      if (!contribution) {
        throw new Error('Contribution not found');
      }

      if (updateContributionDto.valid !== undefined) {
        const isIdempotent = contribution.valid === updateContributionDto.valid;
        if (!isIdempotent) {
          const participant = await this.participantsService.findOne(contribution.participantId);
          if (!participant) {
            throw new Error('Participant not found');
          }
          if (!canSetContributionValidity(participant)) {
            throw new BadRequestException(SET_VALID_TRANSITION_ERROR);
          }
        }
      }

      await contribution.update(updateContributionDto);
      return contribution;
    } catch (error) {
      this.handleErrors(error as Error);
    }
  }

  /**
   * Removes a contribution by ID.
   *
   * @param id - The contribution's unique identifier
   * @returns A success message
   * @throws {NotFoundException} If the contribution does not exist
   */
  async remove(id: number) {
    try {
      const contribution = await this.contributionModel.findByPk(id);
      if (!contribution) {
        throw new Error('Contribution not found');
      }
      await contribution.destroy();
      return { message: 'Contribution removed successfully' };
    } catch (error) {
      this.handleErrors(error as Error);
    }
  }

  /**
   * Maps known error types to appropriate NestJS HTTP exceptions.
   *
   * @param error - The error to handle
   * @throws Always throws an appropriate HTTP exception
   */
  handleErrors(error: Error): never {
    if (
      error instanceof BadRequestException ||
      error instanceof ConflictException ||
      error instanceof NotFoundException ||
      error instanceof ForbiddenException ||
      error instanceof UnauthorizedException
    ) {
      throw error;
    }

    switch (error.name) {
      case 'SequelizeUniqueConstraintError':
        throw new ConflictException('Contribution already exists');
      case 'SequelizeValidationError':
        throw new BadRequestException('Invalid contribution data');
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
        if (
          error.message === 'Contribution not found' ||
          error.message === 'Circuit not found' ||
          error.message === 'Participant not found'
        ) {
          throw new NotFoundException(error.message);
        }
        throw new InternalServerErrorException(error.message);
      default:
        throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
}
