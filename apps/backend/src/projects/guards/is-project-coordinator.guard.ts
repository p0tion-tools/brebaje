import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ProjectsService } from 'src/projects/projects.service';
import { AuthenticatedRequest } from 'src/auth/guards/jwt-auth.guard';

/**
 * Guard to verify that the authenticated user is the coordinator of the project
 * specified in the request body.
 *
 * This guard should be used after JwtAuthGuard to ensure the user is authenticated.
 * It checks if the user's ID matches the coordinatorId of the project.
 */
@Injectable()
export class IsProjectCoordinatorGuard implements CanActivate {
  constructor(private readonly projectsService: ProjectsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const userId = request.user?.id;

    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    // Get projectId from request body
    const body = request.body as { projectId?: number };
    const projectId = body?.projectId;

    if (!projectId) {
      throw new BadRequestException('projectId is required');
    }

    // Fetch the project and verify coordinator
    const project = await this.projectsService.findOne(projectId);

    if (project.coordinatorId !== userId) {
      throw new ForbiddenException('Only the project coordinator can perform this action');
    }

    return true;
  }
}
