import { Injectable } from '@nestjs/common';
import { DeviceFlowTokenDto } from './dto/auth-dto';
import type { GithubUser } from '../types/declarations';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserProvider } from '../types/enums';
import { randomBytes } from 'crypto';

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

  /**
   * GitHub OAuth 2.0 Authorization Code Flow
   * Step 1: Generate authorization URL for frontend redirect
   */
  getGithubAuthUrl() {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const callbackUrl = process.env.GITHUB_OAUTH_APP_CALLBACK;

    if (!clientId) {
      throw new Error('GITHUB_CLIENT_ID environment variable is required');
    } else if (!callbackUrl) {
      throw new Error('GITHUB_OAUTH_APP_CALLBACK environment variable is required');
    }

    const baseUrl = 'https://github.com/login/oauth/authorize';
    const state = randomBytes(32).toString('hex');

    // Ojo: deberías guardar este state en sesión o cookie firmada
    // para verificarlo luego en el callback
    // Ejemplo con sesión: req.session.oauthState = state;

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: callbackUrl,
      scope: 'read:user user:email',
      state,
    });

    return {
      authUrl: `${baseUrl}?${params.toString()}`,
      state,
    };
  }

  /**
   * GitHub OAuth 2.0 Authorization Code Flow
   * Step 2: Exchange authorization code for access token and authenticate user
   */
  async authenticateWithGithubCode(code: string, state?: string) {
    try {
      const clientId = process.env.GITHUB_CLIENT_ID;
      const clientSecret = process.env.GITHUB_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        throw new Error(
          'GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET environment variables are required',
        );
      }

      console.log('The code is: ', code);

      // Exchange authorization code for access token
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
        }).toString(),
      });

      console.log(tokenResponse);

      const tokenData = await tokenResponse.json();
      console.log(tokenData);

      if (tokenData.error) {
        throw new Error(`GitHub OAuth error: ${tokenData.error_description || tokenData.error}`);
      }

      // Use the access token to authenticate (reuse existing logic)
      return await this.authWithGithub({
        access_token: tokenData.access_token,
        token_type: tokenData.token_type || 'bearer',
      });
    } catch (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  async getUserInfoFromCardano() {}
}
