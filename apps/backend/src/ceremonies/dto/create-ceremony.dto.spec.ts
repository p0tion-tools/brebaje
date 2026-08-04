import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CeremonyState, CeremonyType, UserProvider } from 'src/types/enums';
import { CreateCeremonyDto } from './create-ceremony.dto';
import { UpdateCeremonyDto } from './update-ceremony.dto';

function validCreatePayload(): CreateCeremonyDto {
  return {
    projectId: 1,
    description: 'Test Ceremony',
    type: CeremonyType.PHASE2,
    state: CeremonyState.SCHEDULED,
    start_date: 1672531200,
    end_date: 1675209600,
    penalty: 100,
    authProviders: [UserProvider.GITHUB],
  };
}

async function validateCreateDto(payload: object) {
  const dto = plainToInstance(CreateCeremonyDto, payload);
  return validate(dto);
}

async function validateUpdateDto(payload: object) {
  const dto = plainToInstance(UpdateCeremonyDto, payload);
  return validate(dto);
}

describe('CreateCeremonyDto', () => {
  it('should accept a single valid provider', async () => {
    const errors = await validateCreateDto(validCreatePayload());
    expect(errors).toHaveLength(0);
  });

  it('should accept multiple valid providers', async () => {
    const errors = await validateCreateDto({
      ...validCreatePayload(),
      authProviders: [UserProvider.GITHUB, UserProvider.ETHEREUM],
    });
    expect(errors).toHaveLength(0);
  });

  it('should reject an empty authProviders array', async () => {
    const errors = await validateCreateDto({
      ...validCreatePayload(),
      authProviders: [],
    });
    expect(errors.some((error) => error.property === 'authProviders')).toBe(true);
  });

  it('should reject an unknown provider identifier', async () => {
    const errors = await validateCreateDto({
      ...validCreatePayload(),
      authProviders: ['UNKNOWN'],
    });
    expect(errors.some((error) => error.property === 'authProviders')).toBe(true);
  });

  it('should reject mixed known and unknown providers', async () => {
    const errors = await validateCreateDto({
      ...validCreatePayload(),
      authProviders: [UserProvider.GITHUB, 'UNKNOWN'],
    });
    expect(errors.some((error) => error.property === 'authProviders')).toBe(true);
  });

  it('should reject the legacy boolean-map authProviders shape', async () => {
    const errors = await validateCreateDto({
      ...validCreatePayload(),
      authProviders: { github: true },
    });
    expect(errors.some((error) => error.property === 'authProviders')).toBe(true);
  });

  it('should reject when authProviders is omitted', async () => {
    const payload = validCreatePayload();
    delete (payload as Partial<CreateCeremonyDto>).authProviders;
    const errors = await validateCreateDto(payload);
    expect(errors.some((error) => error.property === 'authProviders')).toBe(true);
  });
});

describe('UpdateCeremonyDto authProviders', () => {
  it('should accept a valid authProviders update', async () => {
    const errors = await validateUpdateDto({
      authProviders: [UserProvider.CARDANO],
    });
    expect(errors).toHaveLength(0);
  });

  it('should reject an empty authProviders array on update', async () => {
    const errors = await validateUpdateDto({
      authProviders: [],
    });
    expect(errors.some((error) => error.property === 'authProviders')).toBe(true);
  });

  it('should reject an unknown provider on update', async () => {
    const errors = await validateUpdateDto({
      authProviders: ['INVALID'],
    });
    expect(errors.some((error) => error.property === 'authProviders')).toBe(true);
  });

  it('should allow updates that omit authProviders', async () => {
    const errors = await validateUpdateDto({
      description: 'Updated description only',
    });
    expect(errors).toHaveLength(0);
  });
});
