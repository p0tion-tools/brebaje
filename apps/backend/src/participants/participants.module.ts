import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Participant } from './participant.model';
import { ParticipantsController } from './participants.controller';
import { ParticipantsService } from './participants.service';
import { IsParticipantOwnerOrCoordinatorGuard } from './guards/is-participant-owner-or-coordinator.guard';
import { CircuitsModule } from 'src/circuits/circuits.module';
import { ContributionsModule } from 'src/contributions/contributions.module';
import { AuthModule } from 'src/auth/auth.module';
import { CeremoniesModule } from 'src/ceremonies/ceremonies.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Participant]),
    forwardRef(() => CircuitsModule),
    forwardRef(() => ContributionsModule),
    forwardRef(() => CeremoniesModule),
    AuthModule,
  ],
  controllers: [ParticipantsController],
  providers: [ParticipantsService, IsParticipantOwnerOrCoordinatorGuard],
  exports: [ParticipantsService],
})
export class ParticipantsModule {}
