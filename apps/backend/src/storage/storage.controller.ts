import { Body, Controller, Post, Query, Param } from '@nestjs/common';
import { StorageService } from './storage.service';
import {
  CompleteMultiPartUploadData,
  GeneratePreSignedUrlsPartsData,
  ObjectKeyDto,
} from './dto/storage-dto';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('ceremony/:id/bucket')
  createAndSetupBucket(@Param('id') ceremonyId: number) {
    return this.storageService.createAndSetupBucket(ceremonyId);
  }

  @Post('ceremony/:id/bucket/delete')
  deleteCeremonyBucket(@Param('id') ceremonyId: number) {
    return this.storageService.deleteCeremonyBucket(ceremonyId);
  }

  @Post('ceremony/:id/object/exists')
  checkIfObjectExists(@Param('id') ceremonyId: number, @Body() data: ObjectKeyDto) {
    return this.storageService.checkIfObjectExists(data, ceremonyId);
  }

  @Post('ceremony/:id/object/presigned-url')
  generateGetObjectPreSignedUrl(@Param('id') ceremonyId: number, @Body() data: ObjectKeyDto) {
    return this.storageService.generateGetObjectPreSignedUrl(data, ceremonyId);
  }

  @Post('ceremony/:id/multipart/start')
  startMultipartUpload(
    @Param('id') ceremonyId: number,
    @Query('userId') userId: string,
    @Body() data: ObjectKeyDto,
  ) {
    return this.storageService.startMultipartUpload(data, ceremonyId, userId);
  }

  @Post('ceremony/:id/multipart/urls')
  generatePreSignedUrlsParts(
    @Param('id') ceremonyId: number,
    @Query('userId') userId: string,
    @Body() data: GeneratePreSignedUrlsPartsData,
  ) {
    return this.storageService.generatePreSignedUrlsParts(data, ceremonyId, userId);
  }

  @Post('ceremony/:id/multipart/complete')
  completeMultipartUpload(
    @Param('id') ceremonyId: number,
    @Query('userId') userId: string,
    @Body() data: CompleteMultiPartUploadData,
  ) {
    return this.storageService.completeMultipartUpload(data, ceremonyId, userId);
  }
}
