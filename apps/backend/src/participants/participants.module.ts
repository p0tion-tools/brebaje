import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Participant } from './participant.model';
import { ParticipantsController } from './participants.controller';
import { ParticipantsService } from './participants.service';
import { CircuitsModule } from 'src/circuits/circuits.module';
import { Ceremony } from 'src/ceremonies/ceremony.model';
import { User } from 'src/users/user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Participant, Ceremony, User]),
    forwardRef(() => CircuitsModule),
  ],
  controllers: [ParticipantsController],
  providers: [ParticipantsService],
  exports: [ParticipantsService],
})
export class ParticipantsModule {}
