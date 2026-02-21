import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Contribution } from './contribution.model';
import { ContributionsController } from './contributions.controller';
import { ContributionsService } from './contributions.service';
import { CircuitsModule } from 'src/circuits/circuits.module';
import { ParticipantsModule } from 'src/participants/participants.module';
import { CeremoniesModule } from 'src/ceremonies/ceremonies.module';
import { AuthModule } from 'src/auth/auth.module';
import { IsContributionParticipantOrCoordinatorGuard } from './guards/is-contribution-participant-or-coordinator.guard';
import { IsContributionCoordinatorGuard } from './guards/is-contribution-coordinator.guard';

@Module({
  imports: [
    SequelizeModule.forFeature([Contribution]),
    forwardRef(() => CircuitsModule),
    forwardRef(() => ParticipantsModule),
    CeremoniesModule,
    AuthModule,
  ],
  controllers: [ContributionsController],
  providers: [
    ContributionsService,
    IsContributionParticipantOrCoordinatorGuard,
    IsContributionCoordinatorGuard,
  ],
  exports: [ContributionsService],
})
export class ContributionsModule {}
