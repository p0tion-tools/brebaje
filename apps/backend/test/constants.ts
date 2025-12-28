import { CreateCeremonyDto } from 'src/ceremonies/dto/create-ceremony.dto';
import { CreateCircuitDto } from 'src/circuits/dto/create-circuit.dto';
import { CreateProjectDto } from 'src/projects/dto/create-project.dto';
import {
  CeremonyState,
  CeremonyType,
  CircuitTimeoutType,
  UserProvider,
  VerificationMachineType,
} from 'src/types/enums';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export const coordinatorDto: CreateUserDto = {
  displayName: 'Coordinator',
  avatarUrl: 'https://avatars.githubusercontent.com/u/221431248?v=4',
  provider: UserProvider.GITHUB,
};

export const projectDto: CreateProjectDto = {
  name: 'Test Project',
  contact: 'pse.dev',
  coordinatorId: 1, // set after creating the coordinator user
};

export const startDate = Date.now() + 5 * 60 * 1000; // five minutes from now
export const endDate = startDate + 5 * 60 * 1000; // five minutes after startDate

export const ceremonyDto: CreateCeremonyDto = {
  projectId: 1, // set after creating the project
  description: 'Test Ceremony',
  type: CeremonyType.PHASE2,
  state: CeremonyState.SCHEDULED,
  start_date: startDate,
  end_date: endDate,
  penalty: 1,
  authProviders: { github: true },
};

export const circuits: CreateCircuitDto[] = [
  {
    ceremonyId: 1,
    name: 'Test Circuit 1',
    timeoutMechanismType: CircuitTimeoutType.FIXED,
    fixedTimeWindow: 5 * 60 * 1000, // five minutes
    sequencePosition: 1,
    artifacts: {
      r1csStoragePath:
        'https://github.com/0xbow-io/privacy-pools-core/raw/refs/heads/dev/packages/circuits/build/withdraw/withdraw.r1cs',
      wasmStoragePath:
        'https://github.com/0xbow-io/privacy-pools-core/raw/refs/heads/dev/packages/circuits/build/withdraw/withdraw_js/withdraw.wasm',
    },
    verification: {
      serverOrVm: VerificationMachineType.SERVER,
    },
  },
];
