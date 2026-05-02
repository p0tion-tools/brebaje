import { Module, forwardRef } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { AuthModule } from '../auth/auth.module';
import { CeremoniesModule } from '../ceremonies/ceremonies.module';
import { ParticipantsModule } from '../participants/participants.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [StorageController],
  imports: [
    AuthModule,
    forwardRef(() => CeremoniesModule),
    forwardRef(() => ParticipantsModule),
    UsersModule,
  ],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
