import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ParticipantsModule } from './participants/participants.module';
import { CeremoniesModule } from './ceremonies/ceremonies.module';
import { CircuitsModule } from './circuits/circuits.module';
import { ProjectsModule } from './projects/projects.module';
import { ContributionsModule } from './contributions/contributions.module';
import { StorageModule } from './storage/storage.module';
import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';

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
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: process.env.DB_SQLITE_STORAGE_PATH || '.db/data.sqlite3',
      synchronize: process.env.DB_SQLITE_SYNCHRONIZE === 'true',
      autoLoadModels: true,
      logging: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
