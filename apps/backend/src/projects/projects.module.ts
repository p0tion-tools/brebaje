import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { Project } from './project.model';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { AuthModule } from '../auth/auth.module';
import { IsProjectCoordinatorParamGuard } from './guards/is-project-coordinator-param.guard';
import { IsProjectCoordinatorGuard } from './guards/is-project-coordinator.guard';

@Module({
  imports: [
    SequelizeModule.forFeature([Project]),
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, IsProjectCoordinatorGuard, IsProjectCoordinatorParamGuard],
  exports: [ProjectsService],
})
export class ProjectsModule {}
