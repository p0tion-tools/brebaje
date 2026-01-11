import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CeremoniesService } from '../ceremonies.service';
import { AuthenticatedRequest } from 'src/auth/guards/jwt-auth.guard';

/**
 * Guard to verify that the authenticated user is the coordinator of the project
 * that owns the ceremony specified in the request parameters.
 *
 * This guard should be used after JwtAuthGuard to ensure the user is authenticated.
 * It checks if the user's ID matches the coordinatorId of the project that owns the ceremony.
 */
@Injectable()
export class IsCeremonyCoordinatorGuard implements CanActivate {
  constructor(private readonly ceremoniesService: CeremoniesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const userId = request.user?.id;

    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    // Get ceremonyId from request parameters or body
    const params = request.params as { id?: string };
    const body = request.body as { ceremonyId?: number };
    const ceremonyId = params.id ? +params.id : body?.ceremonyId;

    if (!ceremonyId) {
      throw new BadRequestException('ceremonyId is required');
    }

    // Check if the user is the coordinator of the ceremony's project
    const ceremony = await this.ceremoniesService.findCoordinatorOfCeremony(userId, ceremonyId);

    if (!ceremony) {
      throw new ForbiddenException('Only the project coordinator can perform this action');
    }

    return true;
  }
}
