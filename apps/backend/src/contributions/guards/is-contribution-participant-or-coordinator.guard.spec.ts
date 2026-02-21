import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { IsContributionParticipantOrCoordinatorGuard } from './is-contribution-participant-or-coordinator.guard';
import { ContributionsService } from '../contributions.service';
import { CircuitsService } from 'src/circuits/circuits.service';
import { ParticipantsService } from 'src/participants/participants.service';
import { CeremoniesService } from 'src/ceremonies/ceremonies.service';
import { AuthenticatedRequest } from 'src/auth/guards/jwt-auth.guard';

describe('IsContributionParticipantOrCoordinatorGuard', () => {
  let guard: IsContributionParticipantOrCoordinatorGuard;

  const mockContributionsService = {
    findOne: jest.fn(),
  };

  const mockCircuitsService = {
    findOne: jest.fn(),
  };

  const mockParticipantsService = {
    findOne: jest.fn(),
  };

  const mockCeremoniesService = {
    findCoordinatorOfCeremony: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IsContributionParticipantOrCoordinatorGuard,
        {
          provide: ContributionsService,
          useValue: mockContributionsService,
        },
        {
          provide: CircuitsService,
          useValue: mockCircuitsService,
        },
        {
          provide: ParticipantsService,
          useValue: mockParticipantsService,
        },
        {
          provide: CeremoniesService,
          useValue: mockCeremoniesService,
        },
      ],
    }).compile();

    guard = module.get<IsContributionParticipantOrCoordinatorGuard>(
      IsContributionParticipantOrCoordinatorGuard,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createContext = (
    userId?: number,
    params?: Record<string, string>,
    body?: Record<string, unknown>,
  ): ExecutionContext => {
    const mockRequest: Partial<AuthenticatedRequest> = {
      user: userId ? ({ id: userId, displayName: 'Test User' } as any) : undefined,
      params: params || {},
      body: body || {},
    };
    return {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;
  };

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('POST (body-based validation)', () => {
    it('should allow when caller is the participant', async () => {
      const userId = 100;
      const circuit = { id: 1, ceremonyId: 10 };
      const participant = { id: 1, userId: 100, ceremonyId: 10 };

      mockCircuitsService.findOne.mockResolvedValue(circuit);
      mockParticipantsService.findOne.mockResolvedValue(participant);

      const context = createContext(
        userId,
        {},
        {
          circuitId: 1,
          participantId: 1,
        },
      );

      expect(await guard.canActivate(context)).toBe(true);
    });

    it('should allow when caller is the coordinator', async () => {
      const userId = 200;
      const circuit = { id: 1, ceremonyId: 10 };
      const participant = { id: 1, userId: 100, ceremonyId: 10 };
      const ceremony = { id: 10, projectId: 1 };

      mockCircuitsService.findOne.mockResolvedValue(circuit);
      mockParticipantsService.findOne.mockResolvedValue(participant);
      mockCeremoniesService.findCoordinatorOfCeremony.mockResolvedValue(ceremony);

      const context = createContext(
        userId,
        {},
        {
          circuitId: 1,
          participantId: 1,
        },
      );

      expect(await guard.canActivate(context)).toBe(true);
      expect(mockCeremoniesService.findCoordinatorOfCeremony).toHaveBeenCalledWith(userId, 10);
    });

    it('should throw ForbiddenException when caller is neither participant nor coordinator', async () => {
      const userId = 999;
      const circuit = { id: 1, ceremonyId: 10 };
      const participant = { id: 1, userId: 100, ceremonyId: 10 };

      mockCircuitsService.findOne.mockResolvedValue(circuit);
      mockParticipantsService.findOne.mockResolvedValue(participant);
      mockCeremoniesService.findCoordinatorOfCeremony.mockResolvedValue(null);

      const context = createContext(
        userId,
        {},
        {
          circuitId: 1,
          participantId: 1,
        },
      );

      await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException when circuit does not exist', async () => {
      mockCircuitsService.findOne.mockResolvedValue(null);

      const context = createContext(
        100,
        {},
        {
          circuitId: 999,
          participantId: 1,
        },
      );

      await expect(guard.canActivate(context)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when participant does not exist', async () => {
      mockCircuitsService.findOne.mockResolvedValue({
        id: 1,
        ceremonyId: 10,
      });
      mockParticipantsService.findOne.mockResolvedValue(null);

      const context = createContext(
        100,
        {},
        {
          circuitId: 1,
          participantId: 999,
        },
      );

      await expect(guard.canActivate(context)).rejects.toThrow(NotFoundException);
    });
  });

  describe('PATCH (param-based validation)', () => {
    it('should allow when caller is the contribution participant', async () => {
      const userId = 100;
      const contribution = {
        id: 1,
        circuitId: 1,
        participantId: 1,
      };
      const participant = { id: 1, userId: 100, ceremonyId: 10 };

      mockContributionsService.findOne.mockResolvedValue(contribution);
      mockParticipantsService.findOne.mockResolvedValue(participant);

      const context = createContext(userId, { id: '1' });

      expect(await guard.canActivate(context)).toBe(true);
    });

    it('should allow when caller is the coordinator (via param)', async () => {
      const userId = 200;
      const contribution = {
        id: 1,
        circuitId: 1,
        participantId: 1,
      };
      const participant = { id: 1, userId: 100, ceremonyId: 10 };
      const circuit = { id: 1, ceremonyId: 10 };
      const ceremony = { id: 10, projectId: 1 };

      mockContributionsService.findOne.mockResolvedValue(contribution);
      mockParticipantsService.findOne.mockResolvedValue(participant);
      mockCircuitsService.findOne.mockResolvedValue(circuit);
      mockCeremoniesService.findCoordinatorOfCeremony.mockResolvedValue(ceremony);

      const context = createContext(userId, { id: '1' });

      expect(await guard.canActivate(context)).toBe(true);
    });

    it('should throw ForbiddenException when caller is neither participant nor coordinator (via param)', async () => {
      const userId = 999;
      const contribution = {
        id: 1,
        circuitId: 1,
        participantId: 1,
      };
      const participant = { id: 1, userId: 100, ceremonyId: 10 };
      const circuit = { id: 1, ceremonyId: 10 };

      mockContributionsService.findOne.mockResolvedValue(contribution);
      mockParticipantsService.findOne.mockResolvedValue(participant);
      mockCircuitsService.findOne.mockResolvedValue(circuit);
      mockCeremoniesService.findCoordinatorOfCeremony.mockResolvedValue(null);

      const context = createContext(userId, { id: '1' });

      await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
    });
  });

  it('should throw ForbiddenException when user is not authenticated', async () => {
    const context = createContext(undefined, { id: '1' });

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  it('should throw BadRequestException when neither id param nor body ids are present', async () => {
    const context = createContext(100, {}, {});

    await expect(guard.canActivate(context)).rejects.toThrow(BadRequestException);
  });
});
