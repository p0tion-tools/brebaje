import { Allow, IsNumber, IsString } from 'class-validator';
import { User } from '../../users/user.model';

export class JWTDto {
  @IsNumber()
  exp: number;

  @IsString()
  sub: string;

  @Allow()
  user: User;
}

export class DeviceFlowTokenDto {
  @IsString()
  access_token: string;

  @IsString()
  token_type: string;
}

export interface AuthResponseDto {
  user: User;
  jwt: string;
}
