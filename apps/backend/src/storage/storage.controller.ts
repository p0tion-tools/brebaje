import { Body, Controller, Post, Delete, Query, Param } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { StorageService } from './storage.service';
import {
  CompleteMultiPartUploadData,
  GeneratePreSignedUrlsPartsData,
  ObjectKeyDto,
} from './dto/storage-dto';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @ApiOperation({
    summary:
      'Create a S3 bucket for the ceremony. If the bucket already exists, it will be reused.',
  })
  @ApiQuery({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Return the bucket name.' })
  @Post('/bucket')
  createAndSetupBucket(@Query('id') ceremonyId: number) {
    return this.storageService.createAndSetupBucket(ceremonyId);
  }

  @ApiOperation({ summary: 'Delete the S3 bucket for the ceremony' })
  @ApiQuery({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Bucket deleted successfully.' })
  @Delete('/bucket')
  deleteCeremonyBucket(@Query('id') ceremonyId: number) {
    return this.storageService.deleteCeremonyBucket(ceremonyId);
  }

  @ApiOperation({ summary: 'Check if object exists in ceremony bucket' })
  @ApiQuery({ name: 'id', type: 'number' })
  @Post('object/exists')
  checkIfObjectExists(@Query('id') ceremonyId: number, @Body() data: ObjectKeyDto) {
    return this.storageService.checkIfObjectExists(data, ceremonyId);
  }

  @ApiOperation({ summary: 'Generate pre-signed URL for object download' })
  @ApiQuery({ name: 'id', type: 'number' })
  @Post('object/presigned-url')
  generateGetObjectPreSignedUrl(@Query('id') ceremonyId: number, @Body() data: ObjectKeyDto) {
    return this.storageService.generateGetObjectPreSignedUrl(data, ceremonyId);
  }

  @ApiOperation({ summary: 'Start multipart upload for large files' })
  @ApiQuery({ name: 'id', type: 'number' })
  @ApiQuery({ name: 'userId', type: 'string' })
  @Post('multipart/start')
  startMultipartUpload(
    @Query('id') ceremonyId: number,
    @Query('userId') userId: string,
    @Body() data: ObjectKeyDto,
  ) {
    return this.storageService.startMultipartUpload(data, ceremonyId, userId);
  }

  @ApiOperation({ summary: 'Generate pre-signed URLs for multipart upload parts' })
  @ApiQuery({ name: 'id', type: 'number' })
  @ApiQuery({ name: 'userId', type: 'string' })
  @Post('multipart/urls')
  generatePreSignedUrlsParts(
    @Query('id') ceremonyId: number,
    @Query('userId') userId: string,
    @Body() data: GeneratePreSignedUrlsPartsData,
  ) {
    return this.storageService.generatePreSignedUrlsParts(data, ceremonyId, userId);
  }

  @ApiOperation({ summary: 'Complete multipart upload' })
  @ApiQuery({ name: 'id', type: 'number' })
  @ApiQuery({ name: 'userId', type: 'string' })
  @Post('multipart/complete')
  completeMultipartUpload(
    @Query('id') ceremonyId: number,
    @Query('userId') userId: string,
    @Body() data: CompleteMultiPartUploadData,
  ) {
    return this.storageService.completeMultipartUpload(data, ceremonyId, userId);
  }
}
