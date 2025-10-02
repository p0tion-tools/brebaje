import { Module } from '@nestjs/common';
import { VmService } from './vm.service';

@Module({
  providers: [VmService],
  exports: [VmService],
})
export class VmModule {}
