import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CeremoniesService } from 'src/ceremonies/ceremonies.service';
import { AuthenticatedRequest } from 'src/auth/guards/jwt-auth.guard';
import { CeremonyState } from 'src/types/enums';

/**
 * Guard to verify that the authenticated user is the coordinator of the project
 * that owns the ceremony specified in the request body's ceremonyId,
 * and that the ceremony is in SCHEDULED state.
 *
 * This guard is used for circuit creation (POST), where the circuit does not
 * yet exist and the ceremonyId comes from the request body rather than from
 * a route parameter.
 *
 * This guard should be used after JwtAuthGuard to ensure the user is authenticated.
 */
@Injectable()
export class IsCircuitCreateCoordinatorGuard implements CanActivate {
  constructor(private readonly ceremoniesService: CeremoniesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const userId = request.user?.id;

    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    const body = request.body as { ceremonyId?: number };
    const ceremonyId = body?.ceremonyId;

    if (!ceremonyId) {
      throw new BadRequestException('ceremonyId is required in the request body');
    }

    const ceremony = await this.ceremoniesService.findCoordinatorOfCeremony(userId, ceremonyId);

    if (!ceremony) {
      throw new ForbiddenException(
        'Only the project coordinator can create circuits for this ceremony',
      );
    }

    if (ceremony.state !== CeremonyState.SCHEDULED) {
      throw new ForbiddenException('Circuits can only be created when the ceremony is SCHEDULED');
    }

    return true;
  }
}
