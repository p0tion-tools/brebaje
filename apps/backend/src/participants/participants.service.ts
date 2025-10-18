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
import { ParticipantStatus, ParticipantContributionStep } from 'src/types/enums';
import { InjectModel } from '@nestjs/sequelize';
import { formatZkeyIndex } from '@brebaje/actions';
import { CircuitsService } from 'src/circuits/circuits.service';

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectModel(Participant)
    private participantModel: typeof Participant,
    @Inject(forwardRef(() => CircuitsService))
    private readonly circuitsService: CircuitsService,
  ) {}

  async create(createParticipantDto: CreateParticipantDto) {
    const participant = await this.participantModel.create({
      ...createParticipantDto,
      status: createParticipantDto.status || ParticipantStatus.CREATED,
      contributionStep:
        createParticipantDto.contributionStep || ParticipantContributionStep.DOWNLOADING,
    });
    return participant;
  }

  async findAll() {
    return this.participantModel.findAll();
  }

  async findOne(id: number) {
    return this.participantModel.findByPk(id);
  }

  async findByUserIdAndCeremonyId(userId: string, ceremonyId: number) {
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

  update(id: number, updateParticipantDto: UpdateParticipantDto) {
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
   * @notice the precondition is to be a current contributor (contributing status) in the uploading contribution step.
   * @param participant - the participant entity to check.
   * @throws BadRequestException if the participant is not in CONTRIBUTING status or not in UPLOADING step.
   */
  async checkPreConditionForCurrentContributorToInteractWithMultiPartUpload(
    userId: string,
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
   * @param contributorId <string> - the unique identifier of the contributor.
   * @param ceremonyId <string> - the unique identifier of the ceremony.
   * @param objectKey <string> - the object key of the file being uploaded.
   */
  async checkUploadingFileValidity(userId: string, ceremonyId: number, objectKey: string) {
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
