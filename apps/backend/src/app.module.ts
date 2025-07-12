import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ParticipantsModule } from './participants/participants.module';
import { CeremoniesModule } from './ceremonies/ceremonies.module';
import { CircuitsModule } from './circuits/circuits.module';
import { ProjectsModule } from './projects/projects.module';
import { ContributionsModule } from './contributions/contributions.module';

@Module({
  imports: [
    UsersModule,
    ParticipantsModule,
    CeremoniesModule,
    CircuitsModule,
    ProjectsModule,
    ContributionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
