import { Body, Controller, Post } from '@nestjs/common';
import { StorageService } from './storage.service';
import {
  CompleteMultiPartUploadData,
  GeneratePreSignedUrlsPartsData,
  ObjectKeyDto,
  UploadIdDto,
  TemporaryStoreCurrentContributionUploadedChunkData,
} from './dto/storage-dto';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('/create-bucket')
  createBucket(@Body() data: { bucketName: string }) {
    return this.storageService.createBucket(data.bucketName);
  }

  @Post('/check-if-object-exists')
  checkIfObjectExists(@Body() data: ObjectKeyDto & { bucketName: string }) {
    return this.storageService.checkIfObjectExists(data, data.bucketName);
  }

  @Post('/generate-get-object-pre-signed-url')
  generateGetObjectPreSignedUrl(@Body() data: ObjectKeyDto & { bucketName: string }) {
    return this.storageService.generateGetObjectPreSignedUrl(data, data.bucketName);
  }

  @Post('/start-multipart-upload')
  startMultipartUpload(@Body() data: ObjectKeyDto & { bucketName: string }) {
    return this.storageService.startMultipartUpload(data, data.bucketName);
  }

  @Post('/generate-pre-signed-urls-parts')
  generatePreSignedUrlsParts(
    @Body() data: GeneratePreSignedUrlsPartsData & { bucketName: string },
  ) {
    return this.storageService.generatePreSignedUrlsParts(data, data.bucketName);
  }

  @Post('/complete-multipart-upload')
  completeMultipartUpload(@Body() data: CompleteMultiPartUploadData & { bucketName: string }) {
    return this.storageService.completeMultipartUpload(data, data.bucketName);
  }

  @Post('/temporary-store-current-contribution-multipart-upload-id')
  temporaryStoreCurrentContributionMultipartUploadId(@Body() data: UploadIdDto) {
    return this.storageService.temporaryStoreCurrentContributionMultiPartUploadId(data);
  }

  @Post('/temporary-store-current-contribution-uploaded-chunk-data')
  temporaryStoreCurrentContributionUploadedChunkData(
    @Body() data: TemporaryStoreCurrentContributionUploadedChunkData,
  ) {
    return this.storageService.temporaryStoreCurrentContributionUploadedChunkData(data);
  }
}
