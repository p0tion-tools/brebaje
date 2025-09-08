import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CeremoniesModule } from './ceremonies/ceremonies.module';
import { CircuitsModule } from './circuits/circuits.module';
import { ContributionsModule } from './contributions/contributions.module';
import { HealthModule } from './health/health.module';
import { ParticipantsModule } from './participants/participants.module';
import { ProjectsModule } from './projects/projects.module';
import { StorageModule } from './storage/storage.module';
import { UsersModule } from './users/users.module';
import { DB_SQLITE_STORAGE_PATH, DB_SQLITE_SYNCHRONIZE } from './utils/constants';

@Module({
  imports: [
    UsersModule,
    ParticipantsModule,
    CeremoniesModule,
    CircuitsModule,
    ProjectsModule,
    ContributionsModule,
    StorageModule,
    AuthModule,
    HealthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: DB_SQLITE_STORAGE_PATH,
      synchronize: DB_SQLITE_SYNCHRONIZE,
      autoLoadModels: true,
      logging: false,
      name: 'default',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
