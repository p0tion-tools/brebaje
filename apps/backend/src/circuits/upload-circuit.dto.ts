import { ApiProperty } from '@nestjs/swagger';

export class UploadCircuitDto {
  @ApiProperty({ example: 1 })
  ceremonyId: number;

  @ApiProperty({ example: 'My Circuit' })
  name: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Circuit file (.circom, .r1cs, .wasm, etc.)',
  })
  file: any;

  @ApiProperty({ example: 1, required: false })
  sequencePosition?: number;

  @ApiProperty({ example: {}, required: false })
  metadata?: object;
}
