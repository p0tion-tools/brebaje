import {
  Injectable,
  Inject,
  forwardRef,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCircuitDto } from './dto/create-circuit.dto';
import { UpdateCircuitDto } from './dto/update-circuit.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Circuit } from './circuit.model';
import { vmBootstrapScriptFilename } from '@brebaje/actions';
import { VmService } from 'src/vm/vm.service';
import { StorageService } from 'src/storage/storage.service';
import {
  CeremonyState,
  CircuitTimeoutType,
  ParticipantContributionStep,
  ParticipantStatus,
  ParticipantTimeoutType,
} from 'src/types/enums';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ParticipantsService } from 'src/participants/participants.service';
import { Participant } from 'src/participants/participant.model';
import { ParticipantTimeout } from 'src/types/declarations';

@Injectable()
export class CircuitsService {
  constructor(
    @InjectModel(Circuit)
    private readonly circuitModel: typeof Circuit,
    private readonly vmService: VmService,
    @Inject(forwardRef(() => StorageService))
    private readonly storageService: StorageService,
    @Inject(forwardRef(() => ParticipantsService))
    private readonly participantsService: ParticipantsService,
  ) {}

  async create(createCircuitDto: CreateCircuitDto) {
    if (createCircuitDto.verification.serverOrVm === 'vm') {
      // Fetch the ceremony bucket name.
      const bucketName = await this.storageService.getCeremonyBucketName(
        createCircuitDto.ceremonyId,
      );

      // VM command to be run at the startup.
      const startupCommands = this.vmService.vmBootstrapCommands(
        `${bucketName}/circuits/${createCircuitDto.name}`,
      );

      // Prepare dependencies and cache artifacts command.
      // TODO: find a way to guarantee the file attribute after computing in local (not server)
      const vmCommands = this.vmService.vmDependenciesAndCacheArtifactsCommand(
        `${bucketName}/${'createCircuitDto.files?.initialZkeyStoragePath'}`,
        `${bucketName}/${'createCircuitDto.files?.potStoragePath'}`,
      );

      await this.storageService.uploadObject(
        bucketName,
        `circuits/${createCircuitDto.name}/${vmBootstrapScriptFilename}`,
        vmCommands.join('\n'),
      );

      // Compute the VM disk space requirement (in GB).
      // TODO: find a way to guarantee the zKeySizeInBytes and metadata attributes after computing in local (not server)
      const vmDiskSize = this.vmService.computeDiskSizeForVM(
        createCircuitDto.zKeySizeInBytes!,
        4, // createCircuitDto.metadata?.pot,
      );

      // Configure and instantiate a new VM based on the coordinator input.
      const instance = await this.vmService.createEC2Instance(
        startupCommands,
        createCircuitDto.verification.vm.vmConfigurationType,
        vmDiskSize,
        createCircuitDto.verification.vm.vmDiskType,
      );

      createCircuitDto.verification.vm.vmInstanceId = instance.instanceId;
    }

    try {
      const circuit = await this.circuitModel.create({
        ...createCircuitDto,
      });
      return circuit;
    } catch (error) {
      switch ((error as Error).name) {
        case 'SequelizeForeignKeyConstraintError':
          throw new BadRequestException('Invalid ceremonyId provided');

        default:
          throw new InternalServerErrorException((error as Error).message);
      }
    }
  }

  findAll() {
    return this.circuitModel.findAll();
  }

  findAllFromOpenedCeremonies() {
    return this.circuitModel.findAll({
      include: [
        {
          association: 'ceremony',
          where: { state: CeremonyState.OPENED },
          required: true,
        },
      ],
    });
  }

  findAllByCeremonyId(ceremonyId: number) {
    return this.circuitModel.findAll({ where: { ceremonyId } });
  }

  findOne(id: number) {
    return this.circuitModel.findOne({ where: { id } });
  }

  update(id: number, _updateCircuitDto: UpdateCircuitDto) {
    return `This action updates a #${id} circuit`;
  }

  async remove(id: number) {
    await this.circuitModel.destroy({ where: { id } });
    // TODO: delete EC2 vm if exists
    return { message: `Circuit deleted successfully` };
  }

  async shiftToNextContributor(circuit: Circuit) {
    const { contributors } = circuit;
    const pendingContributors = contributors && contributors.length > 0;

    if (pendingContributors) {
      circuit.currentContributor = contributors.shift();
      circuit.contributors = contributors;
    } else {
      circuit.currentContributor = undefined;
    }

    await circuit.save();
  }

  isParticipantTimedOutOnCircuit(participant: Participant, circuit: Circuit): boolean {
    const { updatedAt } = participant;
    const { timeoutMechanismType } = circuit;

    switch (timeoutMechanismType) {
      case CircuitTimeoutType.LOBBY:
      case CircuitTimeoutType.FIXED: {
        const { fixedTimeWindow } = circuit;
        if (!fixedTimeWindow) {
          throw new Error('Fixed time window is not defined for FIXED timeout mechanism');
        }

        const elapsedTime = Date.now() - updatedAt.getTime();
        return elapsedTime > fixedTimeWindow;
      }

      case CircuitTimeoutType.DYNAMIC: {
        const { dynamicThreshold } = circuit;
        if (!dynamicThreshold) {
          throw new Error('Dynamic threshold is not defined for DYNAMIC timeout mechanism');
        }

        const elapsedTime = Date.now() - updatedAt.getTime();
        return elapsedTime > dynamicThreshold;
      }
    }
  }

  async addTimeOut(participant: Participant, circuit: Circuit, type: ParticipantTimeoutType) {
    const { penalty } = circuit.ceremony;

    const newTimeout: ParticipantTimeout = {
      startDate: Date.now(),
      endDate: Date.now() + penalty,
      type: type,
    };

    const { timeout } = participant;

    if (timeout) {
      timeout.push(newTimeout);
      participant.timeout = timeout;
    } else {
      participant.timeout = [newTimeout];
    }

    participant.status = ParticipantStatus.TIMEDOUT;
    await participant.save();
  }

  async checkAndAddTimeout(
    participant: Participant,
    circuit: Circuit,
    type: ParticipantTimeoutType,
  ) {
    const isTimedOut = this.isParticipantTimedOutOnCircuit(participant, circuit);

    if (isTimedOut) {
      await this.addTimeOut(participant, circuit, type);
    }

    await this.shiftToNextContributor(circuit);
  }

  /**
   * Coordinates the ceremony contribution process by managing participant status transitions
   * and circuit queue progression for all circuits in opened ceremonies.
   *
   * @remarks
   * **Participant Status Flow:**
   *
   * 1. **WAITING → READY**
   *    - Occurs when current contributor is set to READY
   *    - Indicates the participant is now eligible to start contributing (user should download previous participant's contribution)
   *
   * 2. **READY or CONTRIBUTING → TIMEDOUT**
   *    - Triggered when participant exceeds the allowed time window for contribution
   *
   * 3. **CONTRIBUTED or FINALIZED → DONE or WAITING**
   *    - **If in VERIFYING step:**
   *      - Check for verification timeout (server or vm should move participant from verifying to completed if successful verification)
   *
   *    - **If in COMPLETED step:**
   *      - **All circuits completed:** Status changes to `DONE`
   *      - **More circuits pending:** Status changes to `WAITING` (participant waits for next circuit)
   *
   * 4. **TIMEDOUT**
   *    - Participant was manually timedout so kick him out of current contributor
   *    - Queue shifts to next contributor
   *
   * **Queue Management:**
   *
   * - If `currentContributor` is `undefined`, the function attempts to shift to the next contributor
   * - If the current participant document doesn't exist, shifts to next contributor
   * - Each status check may trigger `shiftToNextContributor()` to advance the queue
   *
   * @see {@link ParticipantStatus} for all possible participant statuses
   * @see {@link ParticipantTimeoutType} for timeout types
   * @see {@link shiftToNextContributor} for queue advancement logic
   * @see {@link checkAndAddTimeout} for timeout checking and application
   *
   */
  @Cron(CronExpression.EVERY_10_SECONDS)
  async coordinate() {
    const circuits = await this.findAllFromOpenedCeremonies();

    for (const circuit of circuits) {
      const { currentContributor } = circuit;

      if (currentContributor === undefined) {
        await this.shiftToNextContributor(circuit);
        return;
      }

      const currentParticipant = await this.participantsService.findOne(currentContributor);
      // participant document could be inexistent if it was manually removed
      if (!currentParticipant) {
        await this.shiftToNextContributor(circuit);
        return;
      }

      const { status: currentParticipantStatus } = currentParticipant;

      switch (currentParticipantStatus) {
        case ParticipantStatus.WAITING: {
          currentParticipant.status = ParticipantStatus.READY;
          await currentParticipant.save();
          break;
        }

        case ParticipantStatus.READY:
        case ParticipantStatus.CONTRIBUTING: {
          await this.checkAndAddTimeout(
            currentParticipant,
            circuit,
            ParticipantTimeoutType.BLOCKING_CONTRIBUTION,
          );
          break;
        }

        case ParticipantStatus.CONTRIBUTED:
        case ParticipantStatus.FINALIZED: {
          const { contributionStep, contributionProgress } = currentParticipant;

          if (contributionStep === ParticipantContributionStep.VERIFYING) {
            await this.checkAndAddTimeout(
              currentParticipant,
              circuit,
              ParticipantTimeoutType.BLOCKING_VERIFICATION,
            );
          }

          if (contributionStep === ParticipantContributionStep.COMPLETED) {
            const allCircuitsCompleted =
              contributionProgress && circuits.length < contributionProgress;

            if (allCircuitsCompleted) {
              currentParticipant.status = ParticipantStatus.DONE;
              await currentParticipant.save();
            } else {
              // Participant has more circuits to contribute to
              currentParticipant.status = ParticipantStatus.WAITING;
              await currentParticipant.save();
            }

            await this.shiftToNextContributor(circuit);
            return;
          }

          break;
        }

        case ParticipantStatus.TIMEDOUT: {
          await this.shiftToNextContributor(circuit);
          break;
        }

        default:
          break;
      }
    }
  }
}
