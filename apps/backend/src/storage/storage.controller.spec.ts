/* eslint-disable @typescript-eslint/unbound-method */
import { UnauthorizedException } from '@nestjs/common';
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
    it('should call storageService.startMultipartUpload with data, ceremonyId, and authenticated user id', async () => {
      const ceremonyId = 1;
      const userId = 1;
      const data: ObjectKeyDto = { objectKey: 'test-key' };
      const req = { user: { id: userId } } as AuthenticatedRequest;
      await controller.startMultipartUpload(req, ceremonyId, data);
      expect(storageService.startMultipartUpload).toHaveBeenCalledWith(data, ceremonyId, userId);
    });

    it('should reject when the request user is undefined', () => {
      const req = { user: undefined } as unknown as AuthenticatedRequest;

      expect(() => controller.startMultipartUpload(req, 1, { objectKey: 'test-key' })).toThrow(
        UnauthorizedException,
      );
      expect(storageService.startMultipartUpload).not.toHaveBeenCalled();
    });
  });

  describe('generatePreSignedUrlsParts', () => {
    it('should call storageService.generatePreSignedUrlsParts with data, ceremonyId, and authenticated user id', async () => {
      const ceremonyId = 1;
      const userId = 1;
      const data: GeneratePreSignedUrlsPartsData = {
        objectKey: 'test-key',
        uploadId: 'test-upload-id',
        numberOfParts: 3,
      };
      const req = { user: { id: userId } } as AuthenticatedRequest;
      await controller.generatePreSignedUrlsParts(req, ceremonyId, data);
      expect(storageService.generatePreSignedUrlsParts).toHaveBeenCalledWith(
        data,
        ceremonyId,
        userId,
      );
    });
  });

  describe('completeMultipartUpload', () => {
    it('should call storageService.completeMultipartUpload with data, ceremonyId, and authenticated user id', async () => {
      const ceremonyId = 1;
      const userId = 1;
      const data: CompleteMultiPartUploadData = {
        objectKey: 'test-key',
        uploadId: 'test-upload-id',
        parts: [],
      };
      const req = { user: { id: userId } } as AuthenticatedRequest;
      await controller.completeMultipartUpload(req, ceremonyId, data);
      expect(storageService.completeMultipartUpload).toHaveBeenCalledWith(data, ceremonyId, userId);
    });
  });

  describe('temporaryStoreMultipartUploadId', () => {
    it('should call storageService.temporaryStoreCurrentContributionMultiPartUploadId with the authenticated user id', async () => {
      const ceremonyId = 1;
      const userId = 1;
      const data: UploadIdDto = { uploadId: 'mpu-id' };
      const req = { user: { id: userId } } as AuthenticatedRequest;
      await controller.temporaryStoreMultipartUploadId(req, ceremonyId, data);
      expect(
        storageService.temporaryStoreCurrentContributionMultiPartUploadId,
      ).toHaveBeenCalledWith(data, ceremonyId, userId);
    });
  });

  describe('temporaryStoreUploadedChunkData', () => {
    it('should call storageService.temporaryStoreCurrentContributionUploadedChunkData with the authenticated user id', async () => {
      const ceremonyId = 1;
      const userId = 1;
      const data: TemporaryStoreCurrentContributionUploadedChunkData = {
        chunk: { ETag: '"e1"', PartNumber: 1 },
      };
      const req = { user: { id: userId } } as AuthenticatedRequest;
      await controller.temporaryStoreUploadedChunkData(req, ceremonyId, data);
      expect(
        storageService.temporaryStoreCurrentContributionUploadedChunkData,
      ).toHaveBeenCalledWith(data, ceremonyId, userId);
    });
  });
});
