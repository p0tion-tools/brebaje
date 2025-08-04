import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Participant } from './participant.model';
import { ParticipantsController } from './participants.controller';
import { ParticipantsService } from './participants.service';

@Module({
  imports: [SequelizeModule.forFeature([Participant])],
  controllers: [ParticipantsController],
  providers: [ParticipantsService],
  exports: [ParticipantsModule],
})
export class ParticipantsModule {}
