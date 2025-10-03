import { Module } from '@nestjs/common';
import { VmService } from './vm.service';
import { VmController } from './vm.controller';

@Module({
  controllers: [VmController],
  providers: [VmService],
  exports: [VmService],
})
export class VmModule {}
