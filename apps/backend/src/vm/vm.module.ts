import { Module } from '@nestjs/common';
import { VmService } from './vm.service';

@Module({
  providers: [VmService],
})
export class VmModule {}
