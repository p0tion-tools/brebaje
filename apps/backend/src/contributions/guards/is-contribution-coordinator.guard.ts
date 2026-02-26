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
import { CeremoniesService } from 'src/ceremonies/ceremonies.service';
import { ContributionsService } from '../contributions.service';

/**
 * Guard to verify that the authenticated user is the coordinator of the ceremony
 * that owns the contribution's circuit.
 *
 * Only coordinators can delete contributions, matching the p0tion authorization model.
 *
 * This guard should be used after JwtAuthGuard to ensure the user is authenticated.
 */
@Injectable()
export class IsContributionCoordinatorGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => ContributionsService))
    private readonly contributionsService: ContributionsService,
    @Inject(forwardRef(() => CircuitsService))
    private readonly circuitsService: CircuitsService,
    private readonly ceremoniesService: CeremoniesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const userId = request.user?.id;

    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    const params = request.params as { id?: string };
    const contributionId = params.id ? +params.id : undefined;

    if (!contributionId) {
      throw new BadRequestException('Contribution id is required');
    }

    const contribution = await this.contributionsService.findOne(contributionId);
    if (!contribution) {
      throw new NotFoundException('Contribution not found');
    }

    const circuit = await this.circuitsService.findOne(contribution.circuitId);
    if (!circuit) {
      throw new NotFoundException('Circuit not found');
    }

    const ceremony = await this.ceremoniesService.findCoordinatorOfCeremony(
      userId,
      circuit.ceremonyId,
    );
    if (!ceremony) {
      throw new ForbiddenException('Only the ceremony coordinator can perform this action');
    }

    return true;
  }
}
