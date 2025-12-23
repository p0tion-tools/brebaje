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
import { CeremonyState } from 'src/types/enums';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CircuitsService {
  constructor(
    @InjectModel(Circuit)
    private readonly circuitModel: typeof Circuit,
    private readonly vmService: VmService,
    @Inject(forwardRef(() => StorageService))
    private readonly storageService: StorageService,
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

  @Cron(CronExpression.EVERY_10_SECONDS)
  async coordinate() {
    const circuits = await this.findAllFromOpenedCeremonies();

    for (const circuit of circuits) {
      console.log(circuit.ceremony.penalty);
    }
  }
}
