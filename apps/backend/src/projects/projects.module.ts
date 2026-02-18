import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from './project.model';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { AuthModule } from '../auth/auth.module';
import { ProjectOwnershipGuard } from './guards/project-ownership.guard';
import { IsProjectCoordinatorGuard } from './guards/is-project-coordinator.guard';

@Module({
  imports: [SequelizeModule.forFeature([Project]), AuthModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, IsProjectCoordinatorGuard, ProjectOwnershipGuard],
  exports: [ProjectsService],
})
export class ProjectsModule {}
