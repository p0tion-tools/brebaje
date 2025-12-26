/* eslint-disable @typescript-eslint/no-explicit-any */

import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { StorageService } from './storage.service';
import { CeremoniesService } from '../ceremonies/ceremonies.service';
import { ParticipantsService } from '../participants/participants.service';
import { ParticipantContributionStep, ParticipantStatus } from 'src/types/enums';
import { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Mock AWS SDK
jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/s3-request-presigner');

describe('StorageService', () => {
  let service: StorageService;
  let ceremoniesService: jest.Mocked<CeremoniesService>;
  let participantsService: jest.Mocked<ParticipantsService>;
  let mockS3Send: jest.Mock;
  let mockGetSignedUrl: jest.Mock;

  interface MockCeremony {
    id: number;
    description: string;
    project: { name: string };
  }

  interface MockParticipant {
    status: ParticipantStatus;
    contributionStep: ParticipantContributionStep;
    tempContributionData: {
      [key: string]: any;
    };
    update: () => Promise<void>;
  }

  const mockCeremony: MockCeremony = {
    id: 1,
    description: 'test-ceremony',
    project: { name: 'test-project' },
  };

  const mockParticipant: MockParticipant = {
    status: ParticipantStatus.CONTRIBUTING,
    contributionStep: ParticipantContributionStep.UPLOADING,
    tempContributionData: {},
    update: async () => Promise.resolve(),
  };

  beforeEach(async () => {
    // Setup mocks
    mockS3Send = jest.fn();
    mockGetSignedUrl = jest.fn();

    // Mock AWS SDK modules
    (S3Client as jest.MockedClass<typeof S3Client>).mockImplementation(
      () =>
        ({
          send: mockS3Send,
        }) as never,
    );

    (getSignedUrl as jest.MockedFunction<typeof getSignedUrl>).mockImplementation(mockGetSignedUrl);
    const mockCeremoniesService = {
      findOne: jest.fn(),
      isCoordinator: jest.fn(),
    };

    const mockParticipantsService = {
      findAll: jest.fn(),
      findByUserIdAndCeremonyId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        {
          provide: CeremoniesService,
          useValue: mockCeremoniesService,
        },
        {
          provide: ParticipantsService,
          useValue: mockParticipantsService,
        },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
    ceremoniesService = module.get<CeremoniesService>(
      CeremoniesService,
    ) as jest.Mocked<CeremoniesService>;
    participantsService = module.get<ParticipantsService>(
      ParticipantsService,
    ) as jest.Mocked<ParticipantsService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getS3Client', () => {
    it('should create and return S3 client', () => {
      const s3Client = service.getS3Client();
      expect(s3Client).toBeDefined();
    });
  });

  describe('createAndSetupBucket', () => {
    beforeEach(() => {
      ceremoniesService.findOne.mockResolvedValue(mockCeremony as never);
    });

    it('should create and setup bucket successfully', async () => {
      mockS3Send
        .mockResolvedValueOnce({ Location: 'https://bucket.s3.amazonaws.com/' }) // CreateBucket
        .mockResolvedValueOnce({ $metadata: { httpStatusCode: 204 } }) // PutPublicAccessBlock
        .mockResolvedValueOnce({ $metadata: { httpStatusCode: 200 } }); // PutBucketCors

      const result = await service.createAndSetupBucket(1);

      expect(result).toEqual({ bucketName: expect.any(String) as unknown as string });
      expect(mockS3Send).toHaveBeenCalledTimes(3);
    });

    it('should throw ConflictException if bucket already exists', async () => {
      // Mock that CreateBucket throws BucketAlreadyExists error
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { BucketAlreadyExists } = require('@aws-sdk/client-s3') as {
        BucketAlreadyExists: new () => Error;
      };

      const error = Object.create(BucketAlreadyExists.prototype as object) as Error;
      error.message = 'Bucket already exists';
      error.name = 'BucketAlreadyExists';

      mockS3Send.mockRejectedValueOnce(error);

      await expect(service.createAndSetupBucket(1)).rejects.toThrow(ConflictException);
      expect(mockS3Send).toHaveBeenCalledTimes(1);
    });

    it('should throw InternalServerErrorException if ceremony not found', async () => {
      ceremoniesService.findOne.mockResolvedValue(null as never);

      await expect(service.createAndSetupBucket(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteCeremonyBucket', () => {
    it('should delete bucket successfully', async () => {
      ceremoniesService.findOne.mockResolvedValue(mockCeremony as never);
      mockS3Send.mockResolvedValueOnce({});

      await service.deleteCeremonyBucket(1);

      expect(mockS3Send).toHaveBeenCalledTimes(1);
    });

    it('should throw InternalServerErrorException if ceremony not found', async () => {
      ceremoniesService.findOne.mockResolvedValue(null as never);

      await expect(service.deleteCeremonyBucket(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('startMultipartUpload', () => {
    const mockData = { objectKey: 'test-object.zkey' };

    it('should start multipart upload successfully', async () => {
      ceremoniesService.findOne.mockResolvedValue(mockCeremony as never);
      ceremoniesService.isCoordinator.mockResolvedValue({ isCoordinator: true } as never);
      participantsService.findByUserIdAndCeremonyId.mockResolvedValue(mockParticipant as never);

      mockS3Send.mockResolvedValueOnce({
        $metadata: { httpStatusCode: 200 },
        UploadId: 'test-upload-id',
      });

      const result = await service.startMultipartUpload(mockData, 1, 1);

      expect(result).toEqual({ uploadId: 'test-upload-id' });
      expect(mockS3Send).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if ceremony not found', async () => {
      ceremoniesService.findOne.mockResolvedValue(null as never);

      await expect(service.startMultipartUpload(mockData, 999, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('generatePreSignedUrlsParts', () => {
    const mockData = {
      objectKey: 'test-object.zkey',
      uploadId: 'test-upload-id',
      numberOfParts: 3,
    };

    it('should generate pre-signed URLs for all parts', async () => {
      ceremoniesService.findOne.mockResolvedValue(mockCeremony as never);
      ceremoniesService.isCoordinator.mockResolvedValue({ isCoordinator: true } as never);

      mockGetSignedUrl
        .mockResolvedValueOnce('https://bucket.s3.amazonaws.com/part1')
        .mockResolvedValueOnce('https://bucket.s3.amazonaws.com/part2')
        .mockResolvedValueOnce('https://bucket.s3.amazonaws.com/part3');

      const result = await service.generatePreSignedUrlsParts(mockData, 1, 1);

      expect(result.parts).toHaveLength(3);
      expect(result.parts[0]).toBe('https://bucket.s3.amazonaws.com/part1');
      expect(result.parts[1]).toBe('https://bucket.s3.amazonaws.com/part2');
      expect(result.parts[2]).toBe('https://bucket.s3.amazonaws.com/part3');
      expect(mockGetSignedUrl).toHaveBeenCalledTimes(3);
    });

    it('should throw NotFoundException if ceremony not found', async () => {
      ceremoniesService.findOne.mockResolvedValue(null as never);

      await expect(service.generatePreSignedUrlsParts(mockData, 999, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('completeMultipartUpload', () => {
    const mockData = {
      objectKey: 'test-object.zkey',
      uploadId: 'test-upload-id',
      parts: [{ ETag: 'etag1', PartNumber: 1 }],
    };

    it('should complete multipart upload successfully', async () => {
      ceremoniesService.findOne.mockResolvedValue(mockCeremony as never);
      ceremoniesService.isCoordinator.mockResolvedValue({ isCoordinator: true } as never);

      mockS3Send.mockResolvedValueOnce({
        $metadata: { httpStatusCode: 200 },
        Location: 'https://bucket.s3.amazonaws.com/test-object.zkey',
      });

      const result = await service.completeMultipartUpload(mockData, 1, 1);

      expect(result).toEqual({ location: 'https://bucket.s3.amazonaws.com/test-object.zkey' });
      expect(mockS3Send).toHaveBeenCalledTimes(1);
    });

    it('should throw InternalServerErrorException if upload fails', async () => {
      ceremoniesService.findOne.mockResolvedValue(mockCeremony as never);
      ceremoniesService.isCoordinator.mockResolvedValue({ isCoordinator: true } as never);

      mockS3Send.mockResolvedValueOnce({
        $metadata: { httpStatusCode: 200 },
        Location: null,
      });

      await expect(service.completeMultipartUpload(mockData, 1, 1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('checkIfObjectExists', () => {
    const mockData = { objectKey: 'test-object.zkey' };

    it('should return true if object exists', async () => {
      ceremoniesService.findOne.mockResolvedValue(mockCeremony as never);
      mockS3Send.mockResolvedValueOnce({
        $metadata: { httpStatusCode: 200 },
        ETag: '"abc123"',
      });

      const result = await service.checkIfObjectExists(mockData, 1);

      expect(result).toEqual({ result: true });
      expect(mockS3Send).toHaveBeenCalledTimes(1);
    });

    it('should return false if object does not exist', async () => {
      ceremoniesService.findOne.mockResolvedValue(mockCeremony as never);
      mockS3Send.mockRejectedValueOnce(new Error('NoSuchKey'));

      const result = await service.checkIfObjectExists(mockData, 1);

      expect(result).toEqual({ result: false });
    });

    it('should throw ForbiddenException if access denied', async () => {
      ceremoniesService.findOne.mockResolvedValue(mockCeremony as never);
      const error = { $metadata: { httpStatusCode: 403 } };
      mockS3Send.mockRejectedValueOnce(error);

      await expect(service.checkIfObjectExists(mockData, 1)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('generateGetObjectPreSignedUrl', () => {
    const mockData = { objectKey: 'test-object.zkey' };

    it('should generate pre-signed URL for object', async () => {
      ceremoniesService.findOne.mockResolvedValue(mockCeremony as never);
      mockGetSignedUrl.mockResolvedValueOnce(
        'https://bucket.s3.amazonaws.com/test-object.zkey?signed',
      );

      const result = await service.generateGetObjectPreSignedUrl(mockData, 1);

      expect(result).toEqual({ url: 'https://bucket.s3.amazonaws.com/test-object.zkey?signed' });
      expect(mockGetSignedUrl).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if ceremony not found', async () => {
      ceremoniesService.findOne.mockResolvedValue(null as never);

      await expect(service.generateGetObjectPreSignedUrl(mockData, 999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('handleErrors', () => {
    it('should throw InternalServerErrorException for unknown errors', () => {
      const error = new Error('Unknown error');

      expect(() => service.handleErrors(error)).toThrow(InternalServerErrorException);
    });

    it('should handle BucketAlreadyExists error correctly', () => {
      // Import the actual class and create instance
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { BucketAlreadyExists } = require('@aws-sdk/client-s3') as {
        BucketAlreadyExists: new () => Error;
      };

      const error = Object.create(BucketAlreadyExists.prototype as object) as Error;
      error.message = 'Bucket already exists';
      error.name = 'BucketAlreadyExists';

      expect(() => service.handleErrors(error)).toThrow(ConflictException);
    });
  });
});
