import { Injectable } from '@nestjs/common';
import { DeviceFlowTokenDto, GithubUser } from './dto/auth-dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserProvider } from '../types/enums';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  getGithubClientId() {
    return {
      client_id: process.env.GITHUB_CLIENT_ID,
    };
  }

  async getUserInfoFromGithub(deviceFlowTokenDto: DeviceFlowTokenDto) {
    try {
      const result = (await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${deviceFlowTokenDto.access_token}`,
        },
      }).then((res) => res.json())) as GithubUser;
      // find or create user
      const _user: CreateUserDto = {
        displayName: result.login || result.id.toString(),
        creationTime: Date.now(),
        lastSignInTime: Date.now(),
        lastUpdated: Date.now(),
        avatarUrl: result.avatar_url,
        provider: UserProvider.GITHUB,
      };
      const user = await this.usersService.create(_user);
      // create jwt
      const jwt = await this.jwtService.signAsync({ user: user });
      return { user, jwt };
    } catch (error) {
      return error;
    }
  }
}
