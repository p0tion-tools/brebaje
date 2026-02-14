import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './utils/constants';
import { configureApp } from './app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply all global configurations (validation, CORS, Swagger)
  configureApp(app);

  await app.listen(PORT);
}
void bootstrap();
