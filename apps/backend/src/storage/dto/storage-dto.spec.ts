import 'reflect-metadata';
import {
  ObjectKeyDto,
  GeneratePreSignedUrlsPartsData,
  CompleteMultiPartUploadData,
} from './storage-dto';

describe('StorageDto', () => {
  describe('ObjectKeyDto', () => {
    it('should be defined', () => {
      expect(new ObjectKeyDto()).toBeDefined();
    });

    it('should create instance with objectKey', () => {
      const dto = new ObjectKeyDto();
      dto.objectKey = 'test-key';
      expect(dto.objectKey).toBe('test-key');
    });
  });

  describe('GeneratePreSignedUrlsPartsData', () => {
    it('should be defined', () => {
      expect(new GeneratePreSignedUrlsPartsData()).toBeDefined();
    });
  });

  describe('CompleteMultiPartUploadData', () => {
    it('should be defined', () => {
      expect(new CompleteMultiPartUploadData()).toBeDefined();
    });
  });
});
