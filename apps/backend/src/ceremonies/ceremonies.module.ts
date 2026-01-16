import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CeremoniesController } from './ceremonies.controller';
import { CeremoniesService } from './ceremonies.service';
import { Ceremony } from './ceremony.model';
import { ParticipantsModule } from '../participants/participants.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([Ceremony]), ParticipantsModule, AuthModule],
  controllers: [CeremoniesController],
  providers: [CeremoniesService],
  exports: [CeremoniesService],
})
export class CeremoniesModule {}
