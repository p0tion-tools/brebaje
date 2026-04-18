import {
  Body,
  Controller,
  Post,
  Delete,
  Query,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { AuthenticatedRequest, JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { StorageService } from './storage.service';
import {
  CompleteMultiPartUploadData,
  GeneratePreSignedUrlsPartsData,
  ObjectKeyDto,
  TemporaryStoreCurrentContributionUploadedChunkData,
  UploadIdDto,
} from './dto/storage-dto';

function getAuthenticatedUserId(req: AuthenticatedRequest): number {
  const userId = req.user?.id;
  if (userId === undefined) {
    throw new ForbiddenException('User not authenticated');
  }

  return userId;
}

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
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'id', type: 'number', description: 'Ceremony ID' })
  @ApiBody({ type: ObjectKeyDto, description: 'Object key information' })
  @ApiResponse({ status: 200, description: 'Multipart upload started successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Ceremony not found.' })
  @UseGuards(JwtAuthGuard)
  @Post('multipart/start')
  startMultipartUpload(
    @Request() req: AuthenticatedRequest,
    @Query('id') ceremonyId: number,
    @Body() data: ObjectKeyDto,
  ) {
    return this.storageService.startMultipartUpload(data, ceremonyId, getAuthenticatedUserId(req));
  }

  @ApiOperation({ summary: 'Generate pre-signed URLs for multipart upload parts' })
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'id', type: 'number', description: 'Ceremony ID' })
  @ApiBody({ type: GeneratePreSignedUrlsPartsData, description: 'Multipart upload parts data' })
  @ApiResponse({ status: 200, description: 'Return pre-signed URLs for upload parts.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Ceremony not found.' })
  @UseGuards(JwtAuthGuard)
  @Post('multipart/urls')
  generatePreSignedUrlsParts(
    @Request() req: AuthenticatedRequest,
    @Query('id') ceremonyId: number,
    @Body() data: GeneratePreSignedUrlsPartsData,
  ) {
    return this.storageService.generatePreSignedUrlsParts(
      data,
      ceremonyId,
      getAuthenticatedUserId(req),
    );
  }

  @ApiOperation({ summary: 'Complete multipart upload' })
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'id', type: 'number', description: 'Ceremony ID' })
  @ApiBody({ type: CompleteMultiPartUploadData, description: 'Complete multipart upload data' })
  @ApiResponse({ status: 200, description: 'Multipart upload completed successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Ceremony not found.' })
  @UseGuards(JwtAuthGuard)
  @Post('multipart/complete')
  completeMultipartUpload(
    @Request() req: AuthenticatedRequest,
    @Query('id') ceremonyId: number,
    @Body() data: CompleteMultiPartUploadData,
  ) {
    return this.storageService.completeMultipartUpload(
      data,
      ceremonyId,
      getAuthenticatedUserId(req),
    );
  }

  @ApiOperation({
    summary:
      'Store multipart upload id for resumable contribution upload (actions client contract)',
  })
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'id', type: 'number', description: 'Ceremony ID' })
  @ApiBody({ type: UploadIdDto, description: 'S3 multipart upload id' })
  @ApiResponse({ status: 200, description: 'Temporary upload id stored.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Ceremony or participant not found.' })
  @UseGuards(JwtAuthGuard)
  @Post('temporary-store-current-contribution-multipart-upload-id')
  temporaryStoreMultipartUploadId(
    @Request() req: AuthenticatedRequest,
    @Query('id') ceremonyId: number,
    @Body() data: UploadIdDto,
  ) {
    return this.storageService.temporaryStoreCurrentContributionMultiPartUploadId(
      data,
      ceremonyId,
      getAuthenticatedUserId(req),
    );
  }

  @ApiOperation({
    summary:
      'Append uploaded chunk ETag/part for resumable contribution upload (actions client contract)',
  })
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'id', type: 'number', description: 'Ceremony ID' })
  @ApiBody({ type: TemporaryStoreCurrentContributionUploadedChunkData, description: 'Chunk data' })
  @ApiResponse({ status: 200, description: 'Chunk metadata stored.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Ceremony or participant not found.' })
  @UseGuards(JwtAuthGuard)
  @Post('temporary-store-current-contribution-uploaded-chunk-data')
  temporaryStoreUploadedChunkData(
    @Request() req: AuthenticatedRequest,
    @Query('id') ceremonyId: number,
    @Body() data: TemporaryStoreCurrentContributionUploadedChunkData,
  ) {
    return this.storageService.temporaryStoreCurrentContributionUploadedChunkData(
      data,
      ceremonyId,
      getAuthenticatedUserId(req),
    );
  }
}
