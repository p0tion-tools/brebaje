import { Injectable, Inject, forwardRef, BadRequestException } from '@nestjs/common';
import { CreateCircuitDto } from './dto/create-circuit.dto';
import { UpdateCircuitDto } from './dto/update-circuit.dto';
import { UploadCircuitDto } from './upload-circuit.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Circuit } from './circuit.model';
import { vmBootstrapScriptFilename } from '@brebaje/actions';
import { VmService } from 'src/vm/vm.service';
import { StorageService } from 'src/storage/storage.service';
import { Express } from 'express';
import { promises as fs } from 'fs';

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

    const circuit = await this.circuitModel.create({
      ...createCircuitDto,
    });

    return circuit;
  }

  findAll() {
    return this.circuitModel.findAll();
  }

  findAllByCeremonyId(ceremonyId: number) {
    return this.circuitModel.findAll({ where: { ceremonyId } });
  }

  findOne(id: number) {
    return this.circuitModel.findOne({ where: { id } });
  }

  async findOneByCeremonyIdAndProgress(ceremonyId: number, progress: number) {
    const circuits = await this.circuitModel.findAll({ where: { ceremonyId } });

    if (progress < 0) {
      throw new Error(`Progress cannot be negative, received: ${progress}`);
    }

    if (progress > circuits.length) {
      throw new Error(
        `Progress (${progress}) exceeds number of circuits (${circuits.length}) for the given ceremony`,
      );
    }

    const circuit = circuits[progress];
    if (!circuit) {
      throw new Error(`Circuit not found for ceremony ${ceremonyId} at progress index ${progress}`);
    }

    return circuit;
  }

  update(id: number, updateCircuitDto: UpdateCircuitDto) {
    return `This action updates a #${id} circuit`;
  }

  async remove(id: number) {
    await this.circuitModel.destroy({ where: { id } });
    // TODO: delete EC2 vm if exists
    return { message: `Circuit deleted successfully` };
  }

  async uploadCircuit(file: Express.Multer.File, uploadCircuitDto: UploadCircuitDto) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      // Ensure upload directory exists
      const uploadDir = './uploads/circuits';
      await fs.mkdir(uploadDir, { recursive: true });

      // Create circuit record with file information
      const circuit = await this.circuitModel.create({
        ceremonyId: uploadCircuitDto.ceremonyId,
        name: uploadCircuitDto.name,
        sequencePosition: uploadCircuitDto.sequencePosition || 1,
        timeoutMechanismType: 'FIXED', // Default value
        fixedTimeWindow: 3600, // Default 1 hour
        completedContributions: 0,
        failedContributions: 0,
        verification: {}, // Default empty verification
        artifacts: {}, // Default empty artifacts
        files: {
          originalName: file.originalname,
          filename: file.filename,
          path: file.path,
          size: file.size,
          mimetype: file.mimetype,
        },
        metadata: {
          uploadedAt: new Date().toISOString(),
          ...uploadCircuitDto.metadata,
        },
      });

      return circuit;
    } catch (error) {
      // Clean up uploaded file on error
      if (file.path) {
        await fs.unlink(file.path).catch(console.error);
      }
      throw error;
    }
  }
}
