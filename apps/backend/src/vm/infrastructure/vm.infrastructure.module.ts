import { Module } from '@nestjs/common';
import { VMManagerService } from '../domain/ports/vm-manager.service';
import { AWSEC2VMManagerService } from './vm-manager/aws-ec2/aws-ec2-vm-manager.service';

@Module({
  providers: [
    {
      provide: VMManagerService,
      useClass: AWSEC2VMManagerService,
    },
  ],
  exports: [VMManagerService],
})
export class VMInfrastructureModule {}
