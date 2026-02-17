import {
  Injectable,
  BadRequestException,
  ConflictException,
  GatewayTimeoutException,
  ServiceUnavailableException,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { Participant } from './participant.model';
import { ParticipantStatus, ParticipantContributionStep, CeremonyState } from 'src/types/enums';
import { InjectModel } from '@nestjs/sequelize';
import { formatZkeyIndex } from '@brebaje/actions';
import { CircuitsService } from 'src/circuits/circuits.service';
import { ContributionsService } from 'src/contributions/contributions.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectModel(Participant)
    private participantModel: typeof Participant,
    @Inject(forwardRef(() => CircuitsService))
    private readonly circuitsService: CircuitsService,
    @Inject(forwardRef(() => ContributionsService))
    private readonly contributionsService: ContributionsService,
  ) {}

  /**
   * Creates a new participant.
   *
   * @param createParticipantDto - The DTO containing participant creation data
   * @param userId - The ID of the authenticated user creating the participant
   * @returns The created participant
   */
  async create(createParticipantDto: CreateParticipantDto, userId: number) {
    try {
      const participant = await this.participantModel.create({
        ...createParticipantDto,
        userId,
        status: ParticipantStatus.CREATED,
        contributionStep: ParticipantContributionStep.DOWNLOADING,
      });

      return participant;
    } catch (error) {
      this.handleErrors(error as Error);
    }
  }

  async findAll() {
    return this.participantModel.findAll();
  }

  async findOne(id: number) {
    return this.participantModel.findByPk(id);
  }

  async findByUserIdAndCeremonyId(userId: number, ceremonyId: number) {
    try {
      const participant = await this.participantModel.findOne({
        where: { userId: userId, ceremonyId: ceremonyId },
      });

      if (!participant) {
        throw new NotFoundException('Participant not found');
      }

      return participant;
    } catch (error) {
      this.handleErrors(error as Error);
    }
  }

  async findTimedOutParticipantsOfOpenCeremonies() {
    try {
      const participants = await this.participantModel.findAll({
        where: {
          status: ParticipantStatus.TIMEDOUT,
        },
        include: [
          {
            association: 'ceremony',
            where: { state: CeremonyState.OPENED },
            required: true,
          },
        ],
      });
      return participants;
    } catch (error) {
      this.handleErrors(error as Error);
    }
  }

  /**
   * Updates a participant by ID.
   *
   * @param id - The participant's unique identifier
   * @param _updateParticipantDto - The DTO containing the updated participant data
   * @returns A message indicating the update action (not yet implemented)
   */
  update(id: number, _updateParticipantDto: UpdateParticipantDto) {
    return `This action updates a #${id} participant`;
  }

  async remove(id: number) {
    try {
      const participant = await this.participantModel.findByPk(id);
      if (!participant) {
        throw new Error('Participant not found');
      }

      await participant.destroy();
      return { message: 'Participant removed successfully' };
    } catch (error) {
      this.handleErrors(error as Error);
    }
  }

  /**
   * Check if the pre-condition for interacting with a multi-part upload for an identified current contributor is valid.
   * The precondition is to be a current contributor (contributing status) in the uploading contribution step.
   *
   * @param userId - The user ID of the participant
   * @param ceremonyId - The ceremony ID
   * @throws BadRequestException if the participant is not in CONTRIBUTING status or not in UPLOADING step.
   */
  async checkPreConditionForCurrentContributorToInteractWithMultiPartUpload(
    userId: number,
    ceremonyId: number,
  ) {
    const participant = await this.findByUserIdAndCeremonyId(userId, ceremonyId);
    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    const { status, contributionStep } = participant;
    if (
      status !== ParticipantStatus.CONTRIBUTING ||
      contributionStep !== ParticipantContributionStep.UPLOADING
    ) {
      throw new BadRequestException(
        'Participant must be in CONTRIBUTING status and UPLOADING step to interact with multi-part upload',
      );
    }
  }

  /**
   * Helper function to check whether a contributor is uploading a file related to its contribution.
   *
   * @param userId - The unique identifier of the contributor
   * @param ceremonyId - The unique identifier of the ceremony
   * @param objectKey - The object key of the file being uploaded
   */
  async checkUploadingFileValidity(userId: number, ceremonyId: number, objectKey: string) {
    const participant = await this.findByUserIdAndCeremonyId(userId, ceremonyId);
    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    // The index of the circuit will be the contribution progress - 1
    const index = participant.contributionProgress;
    if (!index || index === 0) {
      throw new BadRequestException(
        'Participant is not the current contributor and cannot upload files',
      );
    }

    const circuits = await this.circuitsService.findAllByCeremonyId(ceremonyId);
    const circuit = circuits.at(index - 1); // We can safely use index - 1
    if (!circuit) {
      throw new NotFoundException('Circuit not found for the participant');
    }

    const { name, completedContributions, currentContributor } = circuit;

    if (currentContributor !== participant.userId) {
      throw new BadRequestException(
        'Participant is not the current contributor and cannot upload files',
      );
    }

    const contributorZKeyIndex = formatZkeyIndex(completedContributions + 1);
    const zkeyNameContributor = `circuits/${name}/contributions/${name}_${contributorZKeyIndex}.zkey`;
    if (objectKey !== zkeyNameContributor) {
      throw new BadRequestException('Provided object key does not match contributor file name');
    }
  }

  async addParticipantToCircuitsQueues(participant: Participant) {
    const { userId, ceremonyId, contributionProgress } = participant;
    const circuits = await this.circuitsService.findAllByCeremonyId(ceremonyId);

    for (let index = contributionProgress || 0; index < circuits.length; index++) {
      const circuit = circuits[index];
      const { contributors } = circuit;

      const isAlreadyInQueue = contributors?.includes(userId);

      if (isAlreadyInQueue) {
        participant.status = ParticipantStatus.WAITING;
        await participant.save();

        continue;
      }

      const alreadyContributed =
        await this.contributionsService.findValidOneByCircuitIdAndParticipantId(
          circuit.id,
          participant.id,
        );

      if (alreadyContributed) {
        participant.status = ParticipantStatus.CONTRIBUTED;
        await participant.save();

        continue;
      }

      const newContributors = contributors ? [...contributors, userId] : [userId];

      circuit.contributors = newContributors;

      participant.contributionProgress = index;
      participant.status = ParticipantStatus.WAITING;

      await Promise.all([participant.save(), circuit.save()]);
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async monitorTimedOutParticipants() {
    const participants = await this.findTimedOutParticipantsOfOpenCeremonies();

    for (const participant of participants) {
      const { timeout } = participant;

      const lastTimeout = timeout ? timeout[timeout.length - 1] : null;
      const timeoutExpired = lastTimeout && lastTimeout.endDate < Date.now();

      if (timeoutExpired) {
        await this.addParticipantToCircuitsQueues(participant);
      }
    }
  }

  handleErrors(error: Error): never {
    switch (error.name) {
      case 'SequelizeUniqueConstraintError':
        throw new ConflictException('Participant already exists');
      case 'SequelizeValidationError':
        throw new BadRequestException('Invalid participant data');
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
        if (error.message === 'Participant not found') {
          throw new NotFoundException('Participant not found');
        } else if (error.message === 'Insufficient permissions') {
          throw new ForbiddenException("You don't have permission to perform this action");
        }
        throw new InternalServerErrorException(error.message);
      default:
        throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
}
