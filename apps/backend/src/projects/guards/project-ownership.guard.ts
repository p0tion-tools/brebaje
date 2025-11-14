import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ProjectsService } from '../projects.service';

@Injectable()
export class ProjectOwnershipGuard implements CanActivate {
  constructor(private projectsService: ProjectsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
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
    } catch (error) {
      if (error instanceof NotFoundException || error.message === 'Project not found') {
        throw new NotFoundException('Project not found');
      }
      throw error;
    }
  }
}
