/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import {
  ObjectKeyDto,
  GeneratePreSignedUrlsPartsData,
  CompleteMultiPartUploadData,
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
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorageController],
      providers: [
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
      ],
    }).compile();

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
});
