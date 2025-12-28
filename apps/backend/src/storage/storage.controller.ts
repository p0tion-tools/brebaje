import { Body, Controller, Post, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { StorageService } from './storage.service';
import {
  CompleteMultiPartUploadData,
  GeneratePreSignedUrlsPartsData,
  ObjectKeyDto,
} from './dto/storage-dto';

@ApiTags('storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @ApiOperation({
    summary:
      'Create a S3 bucket for the ceremony. If the bucket already exists, it will be reused.',
  })
  @ApiQuery({ name: 'id', type: 'number', description: 'Ceremony ID' })
  @ApiResponse({ status: 200, description: 'Return the bucket name.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Ceremony not found.' })
  @ApiResponse({ status: 409, description: 'Bucket already exists.' })
  @ApiResponse({ status: 500, description: 'S3 service error.' })
  @Post('/bucket')
  createAndSetupBucket(@Query('id') ceremonyId: number) {
    return this.storageService.createAndSetupBucket(ceremonyId);
  }

  @ApiOperation({ summary: 'Delete the S3 bucket for the ceremony' })
  @ApiQuery({ name: 'id', type: 'number', description: 'Ceremony ID' })
  @ApiResponse({ status: 200, description: 'Bucket deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Ceremony not found.' })
  @Delete('/bucket')
  deleteCeremonyBucket(@Query('id') ceremonyId: number) {
    return this.storageService.deleteCeremonyBucket(ceremonyId);
  }

  @ApiOperation({ summary: 'Check if object exists in ceremony bucket' })
  @ApiQuery({ name: 'id', type: 'number', description: 'Ceremony ID' })
  @ApiBody({ type: ObjectKeyDto, description: 'Object key information' })
  @ApiResponse({ status: 200, description: 'Return object existence status.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Missing permissions to access object.' })
  @ApiResponse({ status: 404, description: 'Ceremony not found.' })
  @Post('object/exists')
  checkIfObjectExists(@Query('id') ceremonyId: number, @Body() data: ObjectKeyDto) {
    return this.storageService.checkIfObjectExists(data, ceremonyId);
  }

  @ApiOperation({ summary: 'Generate pre-signed URL for object download' })
  @ApiQuery({ name: 'id', type: 'number', description: 'Ceremony ID' })
  @ApiBody({ type: ObjectKeyDto, description: 'Object key information' })
  @ApiResponse({ status: 200, description: 'Return pre-signed URL for download.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Ceremony not found.' })
  @Post('object/presigned-url')
  generateGetObjectPreSignedUrl(@Query('id') ceremonyId: number, @Body() data: ObjectKeyDto) {
    return this.storageService.generateGetObjectPreSignedUrl(data, ceremonyId);
  }

  @ApiOperation({ summary: 'Start multipart upload for large files' })
  @ApiQuery({ name: 'id', type: 'number', description: 'Ceremony ID' })
  @ApiQuery({ name: 'userId', type: 'string', description: 'User ID' })
  @ApiBody({ type: ObjectKeyDto, description: 'Object key information' })
  @ApiResponse({ status: 200, description: 'Multipart upload started successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Ceremony not found.' })
  @Post('multipart/start')
  startMultipartUpload(
    @Query('id') ceremonyId: number,
    @Query('userId') userId: number,
    @Body() data: ObjectKeyDto,
  ) {
    return this.storageService.startMultipartUpload(data, ceremonyId, userId);
  }

  @ApiOperation({ summary: 'Generate pre-signed URLs for multipart upload parts' })
  @ApiQuery({ name: 'id', type: 'number', description: 'Ceremony ID' })
  @ApiQuery({ name: 'userId', type: 'string', description: 'User ID' })
  @ApiBody({ type: GeneratePreSignedUrlsPartsData, description: 'Multipart upload parts data' })
  @ApiResponse({ status: 200, description: 'Return pre-signed URLs for upload parts.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Ceremony not found.' })
  @Post('multipart/urls')
  generatePreSignedUrlsParts(
    @Query('id') ceremonyId: number,
    @Query('userId') userId: number,
    @Body() data: GeneratePreSignedUrlsPartsData,
  ) {
    return this.storageService.generatePreSignedUrlsParts(data, ceremonyId, userId);
  }

  @ApiOperation({ summary: 'Complete multipart upload' })
  @ApiQuery({ name: 'id', type: 'number', description: 'Ceremony ID' })
  @ApiQuery({ name: 'userId', type: 'string', description: 'User ID' })
  @ApiBody({ type: CompleteMultiPartUploadData, description: 'Complete multipart upload data' })
  @ApiResponse({ status: 200, description: 'Multipart upload completed successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Ceremony not found.' })
  @Post('multipart/complete')
  completeMultipartUpload(
    @Query('id') ceremonyId: number,
    @Query('userId') userId: number,
    @Body() data: CompleteMultiPartUploadData,
  ) {
    return this.storageService.completeMultipartUpload(data, ceremonyId, userId);
  }
}
