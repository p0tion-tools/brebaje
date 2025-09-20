import { Injectable, Logger, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { DeviceFlowTokenDto } from './dto/auth-dto';
import type { GithubUser } from '../types/declarations';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserProvider } from '../types/enums';
import { randomBytes } from 'crypto';
import { response } from 'express';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly stateStore = new Map<string, { timestamp: number }>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  getGithubClientId() {
    return {
      client_id: process.env.GITHUB_CLIENT_ID,
    };
  }

  /**
   * Validates OAuth state parameter to prevent CSRF attacks
   */
  private validateState(state: string): boolean {
    if (!state) {
      this.logger.warn('OAuth callback received without state parameter');
      return false;
    }

    const stored = this.stateStore.get(state);
    console.log('----------------------------------------------------');
    console.log(state);
    console.log(this.stateStore);
    console.log(stored);
    if (!stored) {
      this.logger.warn('OAuth callback received with unknown state parameter');
      return false;
    }

    // Check if state is expired (5 minutes)
    const isExpired = Date.now() - stored.timestamp > 5 * 60 * 1000;
    if (isExpired) {
      this.logger.warn('OAuth callback received with expired state parameter');
      this.stateStore.delete(state);
      return false;
    }

    // State is valid and one-time use
    this.stateStore.delete(state);
    this.logger.debug('OAuth state validated successfully');
    return true;
  }

  /**
   * Cleans up expired states from memory
   */
  private cleanupExpiredStates(): void {
    const now = Date.now();
    const expiredStates: string[] = [];

    this.stateStore.forEach((value, key) => {
      if (now - value.timestamp > 5 * 60 * 1000) {
        // 5 minutes
        expiredStates.push(key);
      }
    });

    expiredStates.forEach((state) => this.stateStore.delete(state));

    if (expiredStates.length > 0) {
      this.logger.debug(`Cleaned up ${expiredStates.length} expired OAuth states`);
    }
  }

  /**
   * Gets GitHub OAuth configuration from environment
   */
  private getGitHubConfig() {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    const callbackUrl = process.env.GITHUB_OAUTH_APP_CALLBACK;

    if (!clientId) {
      throw new BadRequestException('GITHUB_CLIENT_ID environment variable is required');
    }
    if (!clientSecret) {
      throw new BadRequestException('GITHUB_CLIENT_SECRET environment variable is required');
    }
    if (!callbackUrl) {
      throw new BadRequestException('GITHUB_OAUTH_APP_CALLBACK environment variable is required');
    }

    return { clientId, clientSecret, callbackUrl };
  }

  async authWithGithub(deviceFlowTokenDto: DeviceFlowTokenDto) {
    try {
      // Clean up expired states when OAuth methods are called
      //this.cleanupExpiredStates();

      const result = (await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${deviceFlowTokenDto.access_token}`,
        },
      }).then((res) => res.json())) as GithubUser;

      let user: any;
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
    this.logger.log('Generating GitHub OAuth authorization URL');

    // Clean up expired states when OAuth methods are called
    //this.cleanupExpiredStates();

    const { clientId, callbackUrl } = this.getGitHubConfig();
    const baseUrl = 'https://github.com/login/oauth/authorize';
    const state = randomBytes(32).toString('hex');

    // Store state with timestamp for validation
    this.stateStore.set(state, { timestamp: Date.now() });
    this.logger.debug(`Stored OAuth state for validation: ${state.substring(0, 8)}...`);

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: callbackUrl,
      scope: 'read:user user:email',
      state,
    });
    console.log(params);

    const authUrl = `${baseUrl}?${params.toString()}`;
    this.logger.log('GitHub OAuth authorization URL generated successfully');

    return {
      authUrl,
      state,
    };
  }

  /**
   * GitHub OAuth 2.0 Authorization Code Flow
   * Step 2: Exchange authorization code for access token and authenticate user
   */
  async authenticateWithGithubCode(code: string, state?: string) {
    console.log(this.stateStore);
    console.log('On authenticateWithGithubCode: ', code, state);
    try {
      this.logger.log(`Processing GitHub OAuth callback with code: ${code.substring(0, 8)}...`);

      // Validate state parameter for CSRF protection
      if (!this.validateState(state || '')) {
        throw new UnauthorizedException('Invalid or expired OAuth state parameter');
      }

      const { clientId, clientSecret } = this.getGitHubConfig();

      this.logger.debug('Exchanging authorization code for access token');
      console.log(code);
      // Exchange authorization code for access token
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
        }),
      });

      console.log('This is the body response: ', tokenResponse.body);
      if (!tokenResponse.ok) {
        this.logger.error(
          `GitHub token exchange failed: ${tokenResponse.status} ${tokenResponse.statusText}`,
        );
        throw new BadRequestException('Failed to exchange authorization code for access token');
      }

      const tokenData = await tokenResponse.json();
      console.log('token data: ', tokenData);

      if (tokenData.error) {
        this.logger.error(`GitHub OAuth error: ${tokenData.error}`, tokenData.error_description);
        throw new BadRequestException(
          `GitHub OAuth error: ${tokenData.error_description || tokenData.error}`,
        );
      }

      this.logger.log('Access token obtained successfully, authenticating user');

      // Use the access token to authenticate (reuse existing logic)
      const result = await this.authWithGithub({
        access_token: tokenData.access_token,
        token_type: tokenData.token_type || 'bearer',
      });
      console.log(result);

      this.logger.log('GitHub OAuth authentication completed successfully');
      return result;
    } catch (error) {
      console.log(error);
      this.logger.error('GitHub OAuth authentication failed', error.stack);

      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(`Authentication failed: ${error.message}`);
    }
  }

  async getUserInfoFromCardano() {}
}
