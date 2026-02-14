import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Participant } from './participant.model';
import { ParticipantsController } from './participants.controller';
import { ParticipantsService } from './participants.service';
import { CircuitsModule } from 'src/circuits/circuits.module';
import { ContributionsModule } from 'src/contributions/contributions.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Participant]),
    forwardRef(() => CircuitsModule),
    forwardRef(() => ContributionsModule),
    AuthModule,
  ],
  controllers: [ParticipantsController],
  providers: [ParticipantsService],
  exports: [ParticipantsService],
})
export class ParticipantsModule {}
