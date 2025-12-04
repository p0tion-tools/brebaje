import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { Project } from './project.model';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectOwnershipGuard } from './guards/project-ownership.guard';

@Module({
  imports: [
    SequelizeModule.forFeature([Project]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, JwtAuthGuard, ProjectOwnershipGuard],
  exports: [ProjectsService],
})
export class ProjectsModule {}
