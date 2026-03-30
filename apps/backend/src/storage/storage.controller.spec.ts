/* eslint-disable @typescript-eslint/unbound-method */
import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticatedRequest, JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import {
  ObjectKeyDto,
  GeneratePreSignedUrlsPartsData,
  CompleteMultiPartUploadData,
  TemporaryStoreCurrentContributionUploadedChunkData,
  UploadIdDto,
} from './dto/storage-dto';

describe('StorageController', () => {
  let controller: StorageController;
  let storageService: jest.Mocked<StorageService>;

  beforeEach(async () => {
    const mockStorageService = {
      createAndSetupBucket: jest.fn().mockResolvedValue({}),
      deleteCeremonyBucket: jest.fn().mockResolvedValue({}),
      checkIfObjectExists: jest.fn().mockResolvedValue({}),
      generateGetObjectPreSignedUrl: jest.fn().mockResolvedValue({}),
      startMultipartUpload: jest.fn().mockResolvedValue({}),
      generatePreSignedUrlsParts: jest.fn().mockResolvedValue({}),
      completeMultipartUpload: jest.fn().mockResolvedValue({}),
      temporaryStoreCurrentContributionMultiPartUploadId: jest.fn().mockResolvedValue(undefined),
      temporaryStoreCurrentContributionUploadedChunkData: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorageController],
      providers: [
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<StorageController>(StorageController);
    storageService = module.get<StorageService>(StorageService) as jest.Mocked<StorageService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createAndSetupBucket', () => {
    it('should call storageService.createAndSetupBucket with ceremonyId', async () => {
      const ceremonyId = 1;
      await controller.createAndSetupBucket(ceremonyId);
      expect(storageService.createAndSetupBucket).toHaveBeenCalledWith(ceremonyId);
    });
  });

  describe('deleteCeremonyBucket', () => {
    it('should call storageService.deleteCeremonyBucket with ceremonyId', async () => {
      const ceremonyId = 1;
      await controller.deleteCeremonyBucket(ceremonyId);
      expect(storageService.deleteCeremonyBucket).toHaveBeenCalledWith(ceremonyId);
    });
  });

  describe('checkIfObjectExists', () => {
    it('should call storageService.checkIfObjectExists with data and ceremonyId', async () => {
      const ceremonyId = 1;
      const data: ObjectKeyDto = { objectKey: 'test-key' };
      await controller.checkIfObjectExists(ceremonyId, data);
      expect(storageService.checkIfObjectExists).toHaveBeenCalledWith(data, ceremonyId);
    });
  });

  describe('generateGetObjectPreSignedUrl', () => {
    it('should call storageService.generateGetObjectPreSignedUrl with data and ceremonyId', async () => {
      const ceremonyId = 1;
      const data: ObjectKeyDto = { objectKey: 'test-key' };
      await controller.generateGetObjectPreSignedUrl(ceremonyId, data);
      expect(storageService.generateGetObjectPreSignedUrl).toHaveBeenCalledWith(data, ceremonyId);
    });
  });

  describe('startMultipartUpload', () => {
    it('should call storageService.startMultipartUpload with data, ceremonyId, and userId', async () => {
      const ceremonyId = 1;
      const userId = 1;
      const data: ObjectKeyDto = { objectKey: 'test-key' };
      await controller.startMultipartUpload(ceremonyId, userId, data);
      expect(storageService.startMultipartUpload).toHaveBeenCalledWith(data, ceremonyId, userId);
    });
  });

  describe('generatePreSignedUrlsParts', () => {
    it('should call storageService.generatePreSignedUrlsParts with data, ceremonyId, and userId', async () => {
      const ceremonyId = 1;
      const userId = 1;
      const data: GeneratePreSignedUrlsPartsData = {
        objectKey: 'test-key',
        uploadId: 'test-upload-id',
        numberOfParts: 3,
      };
      await controller.generatePreSignedUrlsParts(ceremonyId, userId, data);
      expect(storageService.generatePreSignedUrlsParts).toHaveBeenCalledWith(
        data,
        ceremonyId,
        userId,
      );
    });
  });

  describe('completeMultipartUpload', () => {
    it('should call storageService.completeMultipartUpload with data, ceremonyId, and userId', async () => {
      const ceremonyId = 1;
      const userId = 1;
      const data: CompleteMultiPartUploadData = {
        objectKey: 'test-key',
        uploadId: 'test-upload-id',
        parts: [],
      };
      await controller.completeMultipartUpload(ceremonyId, userId, data);
      expect(storageService.completeMultipartUpload).toHaveBeenCalledWith(data, ceremonyId, userId);
    });
  });

  describe('temporaryStoreMultipartUploadId', () => {
    it('should call storageService.temporaryStoreCurrentContributionMultiPartUploadId when user matches', async () => {
      const ceremonyId = 1;
      const userId = 1;
      const data: UploadIdDto = { uploadId: 'mpu-id' };
      const req = { user: { id: userId } } as AuthenticatedRequest;
      await controller.temporaryStoreMultipartUploadId(req, ceremonyId, userId, data);
      expect(
        storageService.temporaryStoreCurrentContributionMultiPartUploadId,
      ).toHaveBeenCalledWith(data, ceremonyId, userId);
    });

    it('should reject when query userId does not match JWT user', () => {
      const req = { user: { id: 2 } } as AuthenticatedRequest;
      expect(() =>
        controller.temporaryStoreMultipartUploadId(req, 1, 1, { uploadId: 'x' }),
      ).toThrow(ForbiddenException);
      expect(
        storageService.temporaryStoreCurrentContributionMultiPartUploadId,
      ).not.toHaveBeenCalled();
    });
  });

  describe('temporaryStoreUploadedChunkData', () => {
    it('should call storageService.temporaryStoreCurrentContributionUploadedChunkData when user matches', async () => {
      const ceremonyId = 1;
      const userId = 1;
      const data: TemporaryStoreCurrentContributionUploadedChunkData = {
        chunk: { ETag: '"e1"', PartNumber: 1 },
      };
      const req = { user: { id: userId } } as AuthenticatedRequest;
      await controller.temporaryStoreUploadedChunkData(req, ceremonyId, userId, data);
      expect(
        storageService.temporaryStoreCurrentContributionUploadedChunkData,
      ).toHaveBeenCalledWith(data, ceremonyId, userId);
    });

    it('should reject when query userId does not match JWT user', () => {
      const req = { user: { id: 99 } } as AuthenticatedRequest;
      expect(() =>
        controller.temporaryStoreUploadedChunkData(req, 1, 1, {
          chunk: { ETag: '"e1"', PartNumber: 1 },
        }),
      ).toThrow(ForbiddenException);
      expect(
        storageService.temporaryStoreCurrentContributionUploadedChunkData,
      ).not.toHaveBeenCalled();
    });
  });
});
