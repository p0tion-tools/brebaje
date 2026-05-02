import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { AuthenticatedRequest } from 'src/auth/guards/jwt-auth.guard';
import { ParticipantsService } from '../participants.service';
import { CeremoniesService } from 'src/ceremonies/ceremonies.service';

/**
 * Guard to verify that the authenticated user is either:
 * - The participant themselves (participant.userId === req.user.id)
 * - The coordinator of the ceremony the participant belongs to
 *
 * Reads the participant id from the route params.
 * This guard should be used after JwtAuthGuard to ensure the user is authenticated.
 */
@Injectable()
export class IsParticipantOwnerOrCoordinatorGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => ParticipantsService))
    private readonly participantsService: ParticipantsService,
    private readonly ceremoniesService: CeremoniesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const userId = request.user?.id;

    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    const params = request.params as { id?: string };
    const participantId = params.id ? +params.id : undefined;

    if (!participantId) {
      throw new ForbiddenException('Participant id is required');
    }

    const participant = await this.participantsService.findOne(participantId);
    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    if (participant.userId === userId) {
      return true;
    }

    const ceremony = await this.ceremoniesService.findCoordinatorOfCeremony(
      userId,
      participant.ceremonyId,
    );

    if (ceremony) {
      return true;
    }

    throw new ForbiddenException(
      'Only the participant or the ceremony coordinator can perform this action',
    );
  }
}
