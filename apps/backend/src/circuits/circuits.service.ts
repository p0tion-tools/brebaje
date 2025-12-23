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

  @Cron(CronExpression.EVERY_10_SECONDS)
  async coordinate() {
    const circuits = await this.findAllFromOpenedCeremonies();

    for (const circuit of circuits) {
      const { contributors, currentContributor } = circuit;

      const pendingContributors = contributors && contributors.length > 0;

      if (currentContributor === undefined) {
        if (pendingContributors) {
          circuit.currentContributor = contributors.shift();
          circuit.contributors = contributors;
          await circuit.save();
        }
        return;
      }

      const currentParticipant = await this.participantsService.findOne(currentContributor);
      // participant document could be inexistent if it was manually removed
      if (!currentParticipant) {
        if (pendingContributors) {
          circuit.currentContributor = contributors.shift();
          circuit.contributors = contributors;
        } else {
          circuit.currentContributor = undefined;
        }

        await circuit.save();
        return;
      }

      const { status: currentParticipantStatus } = currentParticipant;

      // CREATED to WAITING happens when participant is added to the circuit

      // WAITING to READY if it is participant's turn
      // TODO: implement LOBBY mechanism here
      if (currentParticipantStatus === ParticipantStatus.WAITING) {
        currentParticipant.status = ParticipantStatus.READY;
        await currentParticipant.save();
        return;
      }

      // TODO: implement READY to TIMEDOUT happens when participant doesn't start contribution in time

      // READY to CONTRIBUTING happens when participant downloads the contribution files

      // CONTRIBUTING to TIMEDOUT
      if (currentParticipantStatus === ParticipantStatus.CONTRIBUTING) {
        const isTimedOut = this.isParticipantTimedOutOnCircuit(currentParticipant, circuit);

        // if timed out -> mark as TIMEDOUT and move to next contributor in the circuit object
        if (isTimedOut) {
          const { penalty } = circuit.ceremony;

          const newTimeout: ParticipantTimeout = {
            startDate: Date.now(),
            endDate: Date.now() + penalty,
            type: ParticipantTimeoutType.BLOCKING_CONTRIBUTION,
          };

          const { timeout } = currentParticipant;

          if (timeout) {
            timeout.push(newTimeout);
            currentParticipant.timeout = timeout;
          } else {
            currentParticipant.timeout = [newTimeout];
          }

          currentParticipant.status = ParticipantStatus.TIMEDOUT;

          await currentParticipant.save();

          circuit.currentContributor = contributors ? contributors.shift() : undefined;
          circuit.contributors = contributors;
          await circuit.save();
        }
        return;
      }

      // CONTRIBUTING to CONTRIBUTED happens when participant uploads the contribution files
      // TODO: CONTRIBUTED to DONE happens when verification finishes for ALL circuits

      // TODO: CONTRIBUTING to TIMEDOUT happens when participant has not moved from ContributionStep in time

      // READY to FINALIZING happens when participant starts finalization step
      // TODO: FINALIZING to FINALIZED happens when verification finishes for ALL circuits

      // TIMEDOUT to WAITING
      if (currentParticipantStatus === ParticipantStatus.TIMEDOUT) {
        const { timeout } = currentParticipant;
        if (!timeout || timeout.length === 0) {
          currentParticipant.status = ParticipantStatus.WAITING;
          // TODO: rejoin participant to circuit contributors list
          await currentParticipant.save();
          return;
        }

        // TODO: check if timeout is over
        // TODO: mark as WAITING
        // TODO: rejoin participant to circuit contributors list
      }
    }
  }
}
