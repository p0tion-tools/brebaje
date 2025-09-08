import { Controller, Delete, Post, Query } from '@nestjs/common';
import { StorageService } from './storage.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

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
  createBucket(@Query('id') ceremonyId: number) {
    return this.storageService.createAndSetupBucket(ceremonyId);
  }

  @ApiOperation({ summary: 'Delete the S3 bucket for the ceremony' })
  @ApiQuery({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Bucket deleted successfully.' })
  @Delete('/bucket')
  deleteBucket(@Query('id') ceremonyId: number) {
    return this.storageService.deleteCeremonyBucket(ceremonyId);
  }
}
