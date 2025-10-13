import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Participant } from './participant.model';
import { ParticipantsController } from './participants.controller';
import { ParticipantsService } from './participants.service';
import { CircuitsModule } from 'src/circuits/circuits.module';

@Module({
  imports: [SequelizeModule.forFeature([Participant]), forwardRef(() => CircuitsModule)],
  controllers: [ParticipantsController],
  providers: [ParticipantsService],
  exports: [ParticipantsService],
})
export class ParticipantsModule {}
