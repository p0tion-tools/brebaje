import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setUpDatabase } from './database';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);

  setUpDatabase();
}
void bootstrap();
