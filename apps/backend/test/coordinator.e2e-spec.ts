import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.config';
import { AWS_CEREMONY_BUCKET_POSTFIX, PORT } from 'src/utils/constants';
import { ceremonyDto, circuits, coordinatorDto, projectDto } from './constants';
import { User } from 'src/users/user.model';
import { Ceremony } from 'src/ceremonies/ceremony.model';
import { Project } from 'src/projects/project.model';
import {
  getBucketName,
  sanitizeString,
  getURLOfPowersOfTau,
  getFilenameFromUrl,
  genesisZkeyIndex,
  multiPartUploadAPI,
  checkIfObjectExistAPI,
  calculateBlake2bHash,
} from '@brebaje/actions';
import { existsSync, mkdirSync } from 'fs';
import { downloadAndSaveFile } from 'src/utils';
import { zKey } from 'snarkjs';
import { Circuit } from 'src/circuits/circuit.model';
import { JwtService } from '@nestjs/jwt';
import { Participant } from 'src/participants/participant.model';
import { ParticipantContributionStep, ParticipantStatus } from 'src/types/enums';

const DOWNLOAD_DIRECTORY = './.downloads';
const TEST_URL = `http://localhost:${PORT}`;
const circuitArtifactHashes: Record<
  string,
  { pot: string; r1cs: string; wasm: string; zkey: string }
> = {};

// pass the Nest SQLite models to the database in /.db/data.sqlite3
process.env.DB_SQLITE_SYNCHRONIZE = 'true';
process.env.API_URL = TEST_URL;

describe('Coordinator (e2e)', () => {
  let app: INestApplication<App>;
  let jwtService: JwtService;
  let jwtToken: string | undefined;
  let coordinatorId: number | undefined;
  let projectId: number | undefined;
  let ceremonyId: number | undefined;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    jwtService = moduleFixture.get<JwtService>(JwtService);

    app = moduleFixture.createNestApplication();

    // Apply all global configurations (validation, CORS, Swagger)
    configureApp(app);

    await app.init();
    await app.listen(PORT);
  });

  afterAll(async () => {
    await Promise.all([
      Participant.destroy({ where: { id: ceremonyId || '' } }),
      Ceremony.destroy({ where: { id: ceremonyId || '' } }),
      Project.destroy({ where: { id: projectId || '' } }),
      User.destroy({ where: { id: coordinatorId || '' } }),
      app.close(),
    ]);
  });

  it('should create a new user', async () => {
    const response = await fetch(`${TEST_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(coordinatorDto),
    });

    const body = (await response.json()) as User;

    expect(typeof body.id).toBe('number');
    expect(typeof body.creationTime).toBe('number');
    expect(body.displayName).toBe(coordinatorDto.displayName);
    expect(body.avatarUrl).toBe(coordinatorDto.avatarUrl);
    expect(body.provider).toBe(coordinatorDto.provider);

    const userInstance = await User.findByPk(body.id);
    if (!userInstance) {
      throw new Error(`User with ID ${body.id} not found`);
    }
    const savedUser = userInstance.dataValues as User;

    expect(savedUser).toBeDefined();
    expect(savedUser.id).toBe(body.id);
    expect(savedUser.displayName).toBe(coordinatorDto.displayName);
    expect(savedUser.avatarUrl).toBe(coordinatorDto.avatarUrl);
    expect(savedUser.provider).toBe(coordinatorDto.provider);

    coordinatorId = body.id;
  });

  it('should authenticate the user using test endpoint', async () => {
    const response = await fetch(`${TEST_URL}/auth/test/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: coordinatorId,
      }),
    });

    const body = (await response.json()) as { user: User; jwt: string };

    expect(response.status).toBe(201);
    expect(typeof body.jwt).toBe('string');
    expect(body.user.id).toBe(coordinatorId);
    expect(body.user.displayName).toBe(coordinatorDto.displayName);

    // Verify and decode JWT token
    const decoded = await jwtService.verifyAsync<{ user: User }>(body.jwt);

    expect(decoded.user).toBeDefined();
    expect(decoded.user.id).toBe(coordinatorId);
    expect(decoded.user.displayName).toBe(coordinatorDto.displayName);
    expect(decoded.user.provider).toBe(coordinatorDto.provider);

    jwtToken = body.jwt;
  });

  it('should create a project', async () => {
    const response = await fetch(`${TEST_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(projectDto),
    });

    const body = (await response.json()) as Project;

    expect(typeof body.id).toBe('number');
    expect(body.name).toBe(projectDto.name);
    expect(body.contact).toBe(projectDto.contact);
    expect(body.coordinatorId).toBe(coordinatorId);

    const projectInstance = await Project.findByPk(body.id);
    if (!projectInstance) {
      throw new Error(`Project with ID ${body.id} not found`);
    }
    const savedProject = projectInstance.dataValues as Project;

    expect(savedProject).toBeDefined();
    expect(savedProject.id).toBe(body.id);
    expect(savedProject.name).toBe(projectDto.name);
    expect(savedProject.contact).toBe(projectDto.contact);
    expect(savedProject.coordinatorId).toBe(coordinatorId);

    projectId = body.id;
  });

  it('should create a ceremony', async () => {
    const response = await fetch(`${TEST_URL}/ceremonies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        ...ceremonyDto,
        projectId,
      }),
    });

    const body = (await response.json()) as Ceremony;

    expect(typeof body.id).toBe('number');
    expect(body.projectId).toBe(projectId);
    expect(body.description).toBe(ceremonyDto.description);
    expect(body.type).toBe(ceremonyDto.type);
    expect(body.state).toBe(ceremonyDto.state);
    expect(body.start_date).toBe(ceremonyDto.start_date);
    expect(body.end_date).toBe(ceremonyDto.end_date);
    expect(body.penalty).toBe(ceremonyDto.penalty);
    expect(body.authProviders).toEqual(ceremonyDto.authProviders);

    const ceremonyInstance = await Ceremony.findByPk(body.id);
    if (!ceremonyInstance) {
      throw new Error(`Ceremony with ID ${body.id} not found`);
    }
    const savedCeremony = ceremonyInstance.dataValues as Ceremony;

    expect(savedCeremony).toBeDefined();
    expect(savedCeremony.id).toBe(body.id);
    expect(savedCeremony.projectId).toBe(projectId);
    expect(savedCeremony.description).toBe(ceremonyDto.description);
    expect(savedCeremony.type).toBe(ceremonyDto.type);
    expect(savedCeremony.state).toBe(ceremonyDto.state);
    expect(savedCeremony.start_date).toBe(ceremonyDto.start_date);
    expect(savedCeremony.end_date).toBe(ceremonyDto.end_date);
    expect(savedCeremony.penalty).toBe(ceremonyDto.penalty);
    expect(savedCeremony.authProviders).toEqual(ceremonyDto.authProviders);

    ceremonyId = body.id;
  });

  it('should create a bucket in S3', async () => {
    const url = new URL('/storage/bucket', TEST_URL);
    url.searchParams.set('id', String(ceremonyId));

    const response = await fetch(url, {
      method: 'POST',
    });

    const body = (await response.json()) as { bucketName: string };

    const expectedBucketName = getBucketName(
      AWS_CEREMONY_BUCKET_POSTFIX,
      projectDto.name,
      ceremonyDto.description,
    );

    expect(body.bucketName).toBe(expectedBucketName);
  });

  it('should create a participant', async () => {
    const response = await fetch(`${TEST_URL}/participants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        ceremonyId,
      }),
    });

    const body = (await response.json()) as Participant;

    expect(typeof body.id).toBe('number');
    expect(body.userId).toBe(coordinatorId);
    expect(body.ceremonyId).toBe(ceremonyId);
    expect(body.status).toBe(ParticipantStatus.CREATED);
    expect(body.contributionStep).toBe(ParticipantContributionStep.DOWNLOADING);

    const participantInstance = await Participant.findByPk(body.id);
    if (!participantInstance) {
      throw new Error(`Participant with ID ${body.id} not found`);
    }
    const savedParticipant = participantInstance.dataValues as Participant;

    expect(savedParticipant).toBeDefined();
    expect(savedParticipant.id).toBe(body.id);
    expect(savedParticipant.userId).toBe(coordinatorId);
    expect(savedParticipant.ceremonyId).toBe(ceremonyId);
    expect(savedParticipant.status).toBe(ParticipantStatus.CREATED);
    expect(savedParticipant.contributionStep).toBe(ParticipantContributionStep.DOWNLOADING);
  });

  it(
    'should upload the circuit artifacts to the bucket',
    async () => {
      // make the download directory if it doesn't exist
      if (!existsSync(DOWNLOAD_DIRECTORY)) {
        mkdirSync(DOWNLOAD_DIRECTORY);
      }

      for (const circuit of circuits) {
        const { artifacts, name } = circuit;

        const prefix = sanitizeString(name);

        const localR1csPath = `${DOWNLOAD_DIRECTORY}/${prefix}.r1cs`;
        await downloadAndSaveFile(artifacts.r1csStoragePath, localR1csPath);

        const localWasmPath = `${DOWNLOAD_DIRECTORY}/${prefix}.wasm`;
        await downloadAndSaveFile(artifacts.wasmStoragePath, localWasmPath);

        const powersOfTauURL = await getURLOfPowersOfTau(localR1csPath);
        const localPTauPath = `${DOWNLOAD_DIRECTORY}/${getFilenameFromUrl(powersOfTauURL)}`;
        await downloadAndSaveFile(powersOfTauURL, localPTauPath);

        const localZkeyPath = `${DOWNLOAD_DIRECTORY}/${prefix}_${genesisZkeyIndex}.zkey`;
        await zKey.newZKey(localR1csPath, localPTauPath, localZkeyPath);

        const [r1csBlake2bHash, wasmBlake2bHash, potBlake2bHash, zkeyBlake2bHash] =
          await Promise.all([
            calculateBlake2bHash(localR1csPath),
            calculateBlake2bHash(localWasmPath),
            calculateBlake2bHash(localPTauPath),
            calculateBlake2bHash(localZkeyPath),
          ]);

        circuitArtifactHashes[prefix] = {
          pot: potBlake2bHash,
          r1cs: r1csBlake2bHash,
          wasm: wasmBlake2bHash,
          zkey: zkeyBlake2bHash,
        };

        await Promise.all([
          multiPartUploadAPI(
            jwtToken!,
            ceremonyId!,
            coordinatorId!,
            `${prefix}.r1cs`,
            localR1csPath,
            Number(process.env.CONFIG_STREAM_CHUNK_SIZE_IN_MB),
            true,
          ),
          multiPartUploadAPI(
            jwtToken!,
            ceremonyId!,
            coordinatorId!,
            `${prefix}.wasm`,
            localWasmPath,
            Number(process.env.CONFIG_STREAM_CHUNK_SIZE_IN_MB),
            true,
          ),
          multiPartUploadAPI(
            jwtToken!,
            ceremonyId!,
            coordinatorId!,
            `${prefix}.zkey`,
            localZkeyPath,
            Number(process.env.CONFIG_STREAM_CHUNK_SIZE_IN_MB),
            true,
          ),
        ]);

        const alreadyUploadedPot = await checkIfObjectExistAPI(
          jwtToken!,
          ceremonyId!,
          `pot/${getFilenameFromUrl(powersOfTauURL)}`,
        );

        // If it wasn't uploaded yet, upload it.
        if (!alreadyUploadedPot) {
          await multiPartUploadAPI(
            jwtToken!,
            ceremonyId!,
            coordinatorId!,
            `pot/${getFilenameFromUrl(powersOfTauURL)}`,
            localPTauPath,
            Number(process.env.CONFIG_STREAM_CHUNK_SIZE_IN_MB),
            true,
          );
        }
      }
    },
    5 * 60 * 1000, // Sets timeout to 5 minutes
  );

  it('should create the circuits', async () => {
    for (const circuit of circuits) {
      const response = await fetch(`${TEST_URL}/circuits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...circuit,
          ceremonyId,
        }),
      });

      const body = (await response.json()) as Circuit;

      expect(typeof body.id).toBe('number');
    }
  });
});
