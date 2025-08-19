import { Injectable } from '@nestjs/common';
import { DeviceFlowTokenDto } from './dto/auth-dto';
import type { GithubUser } from '../types/declarations';
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

  async authWithGithub(deviceFlowTokenDto: DeviceFlowTokenDto) {
    try {
      const result = (await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${deviceFlowTokenDto.access_token}`,
        },
      }).then((res) => res.json())) as GithubUser;

      let user;
      try {
        user = await this.usersService.findByGithubId(result.id);
      } catch {
        // User not found, create one
        const _user: CreateUserDto = {
          displayName: result.login || result.id.toString(),
          creationTime: Date.now(),
          avatarUrl: result.avatar_url,
          provider: UserProvider.GITHUB,
          githubId: result.id,
        };
        user = await this.usersService.create(_user);
      }

      // create jwt
      const jwt = await this.jwtService.signAsync({ user: user });
      return { user, jwt };
    } catch (error) {
      return error;
    }
  }

  async getUserInfoFromCardano() {}
}
