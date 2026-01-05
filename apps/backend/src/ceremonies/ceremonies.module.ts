import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CeremoniesController } from './ceremonies.controller';
import { CeremoniesService } from './ceremonies.service';
import { Ceremony } from './ceremony.model';
import { AuthModule } from 'src/auth/auth.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { IsProjectCoordinatorGuard } from '../projects/guards/is-project-coordinator.guard';

@Module({
  imports: [SequelizeModule.forFeature([Ceremony]), AuthModule, ProjectsModule],
  controllers: [CeremoniesController],
  providers: [CeremoniesService, IsProjectCoordinatorGuard],
  exports: [CeremoniesService],
})
export class CeremoniesModule {}
