import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CircuitsService } from '../circuits.service';
import { CeremoniesService } from 'src/ceremonies/ceremonies.service';
import { AuthenticatedRequest } from 'src/auth/guards/jwt-auth.guard';
import { CeremonyState } from 'src/types/enums';

/**
 * Guard to verify that the authenticated user is the coordinator of the project
 * that owns the circuit's ceremony, and that the ceremony is in SCHEDULED state.
 *
 * This guard should be used after JwtAuthGuard to ensure the user is authenticated.
 * It checks if:
 * 1. The user's ID matches the coordinatorId of the project that owns the ceremony
 * 2. The ceremony is in SCHEDULED state (circuits can only be modified when ceremony is scheduled)
 */
@Injectable()
export class IsCircuitCoordinatorGuard implements CanActivate {
  constructor(
    private readonly circuitsService: CircuitsService,
    private readonly ceremoniesService: CeremoniesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const userId = request.user?.id;

    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    // Get circuitId from request parameters
    const params = request.params as { id?: string };
    const circuitId = params.id ? +params.id : undefined;

    if (!circuitId) {
      throw new BadRequestException('circuitId is required');
    }

    // Get the circuit and its ceremony
    const circuit = await this.circuitsService.findOne(circuitId);

    if (!circuit) {
      throw new NotFoundException('Circuit not found');
    }

    const ceremonyId = circuit.ceremonyId;

    // Check if the user is the coordinator of the ceremony's project
    const ceremony = await this.ceremoniesService.findCoordinatorOfCeremony(userId, ceremonyId);

    if (!ceremony) {
      throw new ForbiddenException('Only the project coordinator can perform this action');
    }

    // Check if the ceremony is in SCHEDULED state
    if (ceremony.state !== CeremonyState.SCHEDULED) {
      throw new ForbiddenException('Circuits can only be modified when the ceremony is SCHEDULED');
    }

    return true;
  }
}
