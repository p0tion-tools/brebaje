import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { AuthenticatedRequest } from 'src/auth/guards/jwt-auth.guard';
import { CircuitsService } from 'src/circuits/circuits.service';
import { ParticipantsService } from 'src/participants/participants.service';
import { CeremoniesService } from 'src/ceremonies/ceremonies.service';
import { ContributionsService } from '../contributions.service';

/**
 * Guard to verify that the authenticated user is either:
 * - The participant who owns the contribution (participant.userId === req.user.id)
 * - The coordinator of the ceremony that owns the circuit
 *
 * For POST requests: reads circuitId and participantId from the request body.
 * For PATCH requests: reads contribution id from route params and resolves ownership.
 *
 * This guard should be used after JwtAuthGuard to ensure the user is authenticated.
 */
@Injectable()
export class IsContributionParticipantOrCoordinatorGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => ContributionsService))
    private readonly contributionsService: ContributionsService,
    @Inject(forwardRef(() => CircuitsService))
    private readonly circuitsService: CircuitsService,
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
    const body = request.body as {
      circuitId?: number;
      participantId?: number;
    };

    if (params.id) {
      return this.validateByContributionId(+params.id, userId);
    }

    if (body.circuitId !== undefined && body.participantId !== undefined) {
      return this.validateByBodyIds(body.circuitId, body.participantId, userId);
    }

    throw new BadRequestException(
      'Either contribution id (param) or circuitId and participantId (body) are required',
    );
  }

  /**
   * Validates access for PATCH by loading the contribution and checking ownership.
   *
   * @param contributionId - The contribution id from route params
   * @param userId - The authenticated user's id
   * @returns True if access is allowed
   */
  private async validateByContributionId(contributionId: number, userId: number): Promise<boolean> {
    const contribution = await this.contributionsService.findOne(contributionId);
    if (!contribution) {
      throw new NotFoundException('Contribution not found');
    }

    const participant = await this.participantsService.findOne(contribution.participantId);
    if (participant && participant.userId === userId) {
      return true;
    }

    const circuit = await this.circuitsService.findOne(contribution.circuitId);
    if (!circuit) {
      throw new NotFoundException('Circuit not found');
    }

    const ceremony = await this.ceremoniesService.findCoordinatorOfCeremony(
      userId,
      circuit.ceremonyId,
    );
    if (ceremony) {
      return true;
    }

    throw new ForbiddenException(
      'Only the contributing participant or the ceremony coordinator can perform this action',
    );
  }

  /**
   * Validates access for POST by checking body circuitId and participantId.
   *
   * @param circuitId - The circuit id from request body
   * @param participantId - The participant id from request body
   * @param userId - The authenticated user's id
   * @returns True if access is allowed
   */
  private async validateByBodyIds(
    circuitId: number,
    participantId: number,
    userId: number,
  ): Promise<boolean> {
    const circuit = await this.circuitsService.findOne(circuitId);
    if (!circuit) {
      throw new NotFoundException('Circuit not found');
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
      circuit.ceremonyId,
    );
    if (ceremony) {
      return true;
    }

    throw new ForbiddenException(
      'Only the contributing participant or the ceremony coordinator can perform this action',
    );
  }
}
