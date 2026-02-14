import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CORS_ORIGINS } from './utils/constants';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Creates and configures the global validation pipe used across the application.
 * This ensures consistent validation behavior in both production and test environments.
 *
 * @returns Configured ValidationPipe instance
 */
export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true, // Strip properties that don't have decorators
    forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
    transform: true, // Automatically transform payloads to DTO instances
  });
}

/**
 * Configures CORS settings for the application.
 * Allows frontend applications to communicate with the API.
 *
 * @param app - The NestJS application instance
 */
export function configureCors(app: INestApplication): void {
  app.enableCors({
    origin: CORS_ORIGINS?.split(',').map((origin) => origin.trim()) || [
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
}

/**
 * Configures Swagger/OpenAPI documentation for the application.
 * Sets up the API documentation UI at /api endpoint.
 *
 * @param app - The NestJS application instance
 */
export function configureSwagger(app: INestApplication): void {
  // Get pkg info (e.g., name, version).
  const { description, version } = JSON.parse(
    readFileSync(join(__dirname, '..', 'package.json'), 'utf8'),
  ) as {
    description: string;
    version: string;
  };

  const config = new DocumentBuilder()
    .setTitle('Brebaje API')
    .setDescription(description)
    .setVersion(version)
    .addTag('brebaje')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

/**
 * Applies all global application configurations.
 * This includes validation pipes, CORS, and Swagger documentation.
 * Use this function to ensure consistent configuration across all environments.
 *
 * @param app - The NestJS application instance
 */
export function configureApp(app: INestApplication): void {
  app.useGlobalPipes(createValidationPipe());
  configureCors(app);
  configureSwagger(app);
}
