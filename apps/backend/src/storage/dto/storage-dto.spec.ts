import 'reflect-metadata';
import { ObjectKeyDto, UploadIdDto } from './storage-dto';

describe('StorageDto', () => {
  it('should define ObjectKeyDto', () => {
    const dto = new ObjectKeyDto();
    expect(dto).toBeDefined();
  });

  it('should define UploadIdDto', () => {
    const dto = new UploadIdDto();
    expect(dto).toBeDefined();
  });
});
