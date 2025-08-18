import { CreateCeremonyDto } from 'src/ceremonies/dto/create-ceremony.dto';
import { CreateProjectDto } from 'src/projects/dto/create-project.dto';
import { CeremonyState, CeremonyType, UserProvider } from 'src/types/enums';
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
