import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/users/user.model';
import { ProjectsService } from '../projects.service';

@Injectable()
export class ProjectOwnershipGuard implements CanActivate {
  constructor(private projectsService: ProjectsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user: User }>();
    const user = request.user;
    const projectId = parseInt(request.params.id, 10);

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!projectId) {
      throw new ForbiddenException('Project ID not provided');
    }

    try {
      const project = await this.projectsService.findOne(projectId);

      if (project.coordinatorId !== user.id) {
        throw new ForbiddenException(
          'You do not have permission to perform this action on this project',
        );
      }

      return true;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Project not found');
      }
      if (error instanceof Error && error.message === 'Project not found') {
        throw new NotFoundException('Project not found');
      }
      throw error;
    }
  }
}
