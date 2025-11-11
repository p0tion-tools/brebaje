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
  Logger,
} from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { Participant } from './participant.model';
import { ParticipantStatus, ParticipantContributionStep, CeremonyState } from 'src/types/enums';
import { InjectModel } from '@nestjs/sequelize';
import { formatZkeyIndex } from '@brebaje/actions';
import { CircuitsService } from 'src/circuits/circuits.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ParticipantsService {
  private readonly logger = new Logger(ParticipantsService.name);

  constructor(
    private sequelize: Sequelize,
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

  /**
   * Find all participants from open ceremonies.
   * @returns Promise<Participant[]> - Array of participants from ceremonies with OPENED state
   */
  async findAllFromOpenCeremonies() {
    try {
      const participants = await this.participantModel.findAll({
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
   * @param contributorId <string> - the unique identifier of the contributor.
   * @param ceremonyId <string> - the unique identifier of the ceremony.
   * @param objectKey <string> - the object key of the file being uploaded.
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

  async coordinate(participant: Participant, isSingleParticipantCoordination: boolean) {
    const { ceremonyId, contributionProgress, status, contributionStep, userId } = participant;

    const circuit = await this.circuitsService.findOneByCeremonyIdAndProgress(
      ceremonyId,
      contributionProgress ?? 0,
    );
    const { contributors, currentContributor } = circuit;

    // Prepare state updates for waiting queue.
    const newContributors = contributors;
    let newCurrentContributorId: number | undefined;

    // Prepare state updates for participant.
    let newParticipantStatus: ParticipantStatus;
    let newContributionStep: ParticipantContributionStep;

    // Prepare pre-conditions.
    const noCurrentContributor = !currentContributor;
    const noContributorsInWaitingQueue = !contributors.length;
    const emptyWaitingQueue = noCurrentContributor && noContributorsInWaitingQueue;

    const participantIsNotCurrentContributor = currentContributor !== userId;
    const participantIsCurrentContributor = currentContributor === userId;
    const participantIsReady = status === ParticipantStatus.READY;
    const participantResumingAfterTimeoutExpiration =
      participantIsCurrentContributor && participantIsReady;

    const participantCompletedOneOrAllContributions =
      (status === ParticipantStatus.CONTRIBUTED || status === ParticipantStatus.DONE) &&
      contributionStep === ParticipantContributionStep.COMPLETED;

    try {
      await this.sequelize.transaction(async (t) => {
        const transactionHost = { transaction: t };

        // check for scenarios
        if (isSingleParticipantCoordination) {
          // Scenario (A).
          if (emptyWaitingQueue) {
            this.logger.debug(`Scenario A - emptyWaitingQueue`);

            // Update.
            newCurrentContributorId = userId;
            newParticipantStatus = ParticipantStatus.CONTRIBUTING;
            newContributionStep = ParticipantContributionStep.DOWNLOADING;
            newContributors.push(newCurrentContributorId);
          }
          // Scenario (A).
          else if (participantResumingAfterTimeoutExpiration) {
            this.logger.debug(`Scenario A - single - participantResumingAfterTimeoutExpiration`);

            newParticipantStatus = ParticipantStatus.CONTRIBUTING;
            newContributionStep = ParticipantContributionStep.DOWNLOADING;
            newCurrentContributorId = userId;
          }
          // Scenario (B).
          else if (participantIsNotCurrentContributor) {
            this.logger.debug(`Scenario B - single - participantIsNotCurrentContributor`);

            newCurrentContributorId = currentContributor;
            newParticipantStatus = ParticipantStatus.WAITING;
            newContributors.push(userId);
          }

          // Prepare tx - Scenario (A) only.
          if (newContributionStep) {
            await participant.update(
              {
                contributionStep: newContributionStep,
              },
              transactionHost,
            );
          }
          const contributionStartedAt =
            newParticipantStatus === ParticipantStatus.CONTRIBUTING ? Date.now() : 0;

          // Prepare tx - Scenario (A) or (B).
          await participant.update(
            {
              status: newParticipantStatus,
              contributionStartedAt,
            },
            transactionHost,
          );
        } else if (
          participantIsCurrentContributor &&
          participantCompletedOneOrAllContributions &&
          !!ceremonyId
        ) {
          this.logger.debug(
            `Scenario C - multi - participantIsCurrentContributor && participantCompletedOneOrAllContributions`,
          );

          newParticipantStatus = ParticipantStatus.CONTRIBUTING;
          newContributionStep = ParticipantContributionStep.DOWNLOADING;

          // Remove from waiting queue of circuit X.
          newContributors.shift();

          // Step (C.1).
          if (newContributors.length > 0) {
            // Get new contributor for circuit X.
            newCurrentContributorId = newContributors.at(0)!;

            const newCurrentParticipant = await this.findByUserIdAndCeremonyId(
              newCurrentContributorId,
              ceremonyId,
            );
            await newCurrentParticipant.update(
              {
                status: newParticipantStatus,
                contributionStep: newContributionStep,
                contributionStartedAt: Date.now(),
              },
              transactionHost,
            );

            this.logger.debug(
              `Participant ${newCurrentContributorId} is the new current contributor for circuit ${circuit.id}`,
            );
          }
        }

        await circuit.update(
          {
            contributors: newContributors,
            currentContributor: newCurrentContributorId,
          },
          transactionHost,
        );
      });
    } catch (error) {
      this.logger.error(
        `There was an error running the coordination with participant ${userId} in ceremony ${ceremonyId}: ${error}`,
      );
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async coordinateCeremonyParticipants() {
    // Implementation for coordinating ceremony participants
    const participants = await this.findAllFromOpenCeremonies();
    for (const participant of participants) {
      const { userId, contributionProgress, status, contributionStep } = participant;

      this.logger.debug(`Coordinate participant ${userId} for ceremony ${participant.ceremonyId}`);
      this.logger.debug(
        `Status: ${status}, Contribution Progress: ${contributionProgress}, Contribution Step: ${contributionStep}`,
      );

      // Step 1
      // Define pre-conditions
      const readyToContribute = status === ParticipantStatus.READY;
      const readyForFirstContribution = readyToContribute && contributionProgress === 0;
      const resumingContributionAfterTimeout = readyToContribute; // && prevContributionProgress === changedContributionProgress
      const readyForNextContribution = readyToContribute && contributionProgress !== 0; // && prevContributionProgress === changedContributionProgress - 1
      const completedEveryCircuitContribution = status === ParticipantStatus.DONE;
      const completedContribution =
        (status === ParticipantStatus.CONTRIBUTED &&
          contributionStep === ParticipantContributionStep.COMPLETED) ||
        (status === ParticipantStatus.CONTRIBUTING &&
          contributionStep === ParticipantContributionStep.VERIFYING);
      // prevContributionProgress === changedContributionProgress &&
      // prevStatus === ParticipantStatus.CONTRIBUTING &&
      // prevContributionStep === ParticipantContributionStep.VERIFYING &&

      // Step (2)
      if (
        readyForFirstContribution ||
        resumingContributionAfterTimeout ||
        readyForNextContribution
      ) {
        this.logger.debug(
          `Participant is ready for first contribution (${readyForFirstContribution}) or for the next contribution (${readyForNextContribution}) or is resuming after a timeout expiration (${resumingContributionAfterTimeout})`,
        );

        await this.coordinate(participant, true);
      } else if (completedContribution || completedEveryCircuitContribution) {
        this.logger.debug(
          `Participant completed a contribution (${completedContribution}) or every contribution for each circuit (${completedEveryCircuitContribution})`,
        );

        await this.coordinate(participant, false);
      }

      this.logger.debug(`Coordination completed`);
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
