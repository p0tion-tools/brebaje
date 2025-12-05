import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Circuit } from './circuit.model';
import { CircuitsService } from './circuits.service';
import { CreateCircuitDto } from './dto/create-circuit.dto';
import { UpdateCircuitDto } from './dto/update-circuit.dto';
import { UploadCircuitDto } from './upload-circuit.dto';

@ApiTags('circuits')
@Controller('circuits')
export class CircuitsController {
  constructor(private readonly circuitsService: CircuitsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new circuit' })
  @ApiResponse({
    status: 201,
    description: 'The circuit has been successfully created.',
    type: Circuit,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createCircuitDto: CreateCircuitDto) {
    return this.circuitsService.create(createCircuitDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all circuits' })
  @ApiResponse({ status: 200, description: 'Return all circuits.', type: [Circuit] })
  findAll() {
    return this.circuitsService.findAll();
  }

  @Get()
  @ApiOperation({ summary: 'Find all circuits of a specific ceremony' })
  @ApiQuery({ name: 'ceremonyId', type: 'number' })
  @ApiResponse({ status: 200, description: 'Return all circuits.', type: [Circuit] })
  findAllByCeremonyId(@Query('ceremonyId') ceremonyId: number) {
    return this.circuitsService.findAllByCeremonyId(ceremonyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a circuit by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Return the circuit.', type: Circuit })
  @ApiResponse({ status: 404, description: 'Circuit not found.' })
  findOne(@Param('id') id: string) {
    return this.circuitsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a circuit' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'The circuit has been successfully updated.',
    type: Circuit,
  })
  @ApiResponse({ status: 404, description: 'Circuit not found.' })
  update(@Param('id') id: string, @Body() updateCircuitDto: UpdateCircuitDto) {
    return this.circuitsService.update(+id, updateCircuitDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a circuit' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'The circuit has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Circuit not found.' })
  remove(@Param('id') id: string) {
    return this.circuitsService.remove(+id);
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload a circuit file' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'The circuit file has been successfully uploaded.',
    type: Circuit,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/circuits',
        filename: (_req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          const extension = extname(file.originalname);
          cb(null, `${randomName}${extension}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        // Accept common circuit file types
        const allowedMimeTypes = [
          'text/plain', // .circom files
          'application/octet-stream', // .r1cs, .wasm files
          'application/json', // .json files
        ];
        const allowedExtensions = ['.circom', '.r1cs', '.wasm', '.json', '.ptau'];
        const fileExtension = extname(file.originalname).toLowerCase();

        if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
          cb(null, true);
        } else {
          cb(
            new Error(
              'Invalid file type. Only .circom, .r1cs, .wasm, .json, and .ptau files are allowed.',
            ),
            false,
          );
        }
      },
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
      },
    }),
  )
  uploadCircuit(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadCircuitDto: UploadCircuitDto,
  ) {
    return this.circuitsService.uploadCircuit(file, uploadCircuitDto);
  }
}
