import { Body, Controller, Post, Delete, Query, Param } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { StorageService } from './storage.service';
import {
  CompleteMultiPartUploadData,
  GeneratePreSignedUrlsPartsData,
  ObjectKeyDto,
} from './dto/storage-dto';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @ApiOperation({ summary: 'Create and setup S3 bucket for ceremony' })
  @Post('ceremony/:id/bucket')
  createAndSetupBucket(@Param('id') ceremonyId: number) {
    return this.storageService.createAndSetupBucket(ceremonyId);
  }

  @ApiOperation({ summary: 'Delete S3 bucket for ceremony' })
  @Delete('ceremony/:id/bucket')
  deleteCeremonyBucket(@Param('id') ceremonyId: number) {
    return this.storageService.deleteCeremonyBucket(ceremonyId);
  }

  @ApiOperation({ summary: 'Check if object exists in ceremony bucket' })
  @Post('storage/:id/object/exists')
  checkIfObjectExists(@Param('id') ceremonyId: number, @Body() data: ObjectKeyDto) {
    return this.storageService.checkIfObjectExists(data, ceremonyId);
  }

  @ApiOperation({ summary: 'Generate pre-signed URL for object download' })
  @Post('ceremony/:id/object/presigned-url')
  generateGetObjectPreSignedUrl(@Param('id') ceremonyId: number, @Body() data: ObjectKeyDto) {
    return this.storageService.generateGetObjectPreSignedUrl(data, ceremonyId);
  }

  @ApiOperation({ summary: 'Start multipart upload for large files' })
  @Post('ceremony/:id/multipart/start')
  startMultipartUpload(
    @Param('id') ceremonyId: number,
    @Query('userId') userId: string,
    @Body() data: ObjectKeyDto,
  ) {
    return this.storageService.startMultipartUpload(data, ceremonyId, userId);
  }

  @ApiOperation({ summary: 'Generate pre-signed URLs for multipart upload parts' })
  @Post('ceremony/:id/multipart/urls')
  generatePreSignedUrlsParts(
    @Param('id') ceremonyId: number,
    @Query('userId') userId: string,
    @Body() data: GeneratePreSignedUrlsPartsData,
  ) {
    return this.storageService.generatePreSignedUrlsParts(data, ceremonyId, userId);
  }

  @ApiOperation({ summary: 'Complete multipart upload' })
  @Post('ceremony/:id/multipart/complete')
  completeMultipartUpload(
    @Param('id') ceremonyId: number,
    @Query('userId') userId: string,
    @Body() data: CompleteMultiPartUploadData,
  ) {
    return this.storageService.completeMultipartUpload(data, ceremonyId, userId);
  }
}
