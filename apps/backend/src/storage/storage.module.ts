import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { CeremoniesService } from '../ceremonies/ceremonies.service';
import { ParticipantsService } from '../participants/participants.service';
import { Ceremony } from '../ceremonies/ceremony.model';
import { Participant } from '../participants/participant.model';
import { User } from '../users/user.model';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [StorageController],
  imports: [SequelizeModule.forFeature([Ceremony, Participant, User])],
  providers: [StorageService, CeremoniesService, ParticipantsService, UsersService],
  exports: [StorageService],
})
export class StorageModule {}
