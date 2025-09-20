import { Body, Controller, Get, Post, Query, BadRequestException, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { DeviceFlowTokenDto } from './dto/auth-dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('github/client-id')
  @ApiOperation({ summary: 'Get GitHub client ID for OAuth setup' })
  @ApiResponse({ status: 200, description: 'GitHub client ID returned successfully' })
  async getGithubClientId() {
    return this.authService.getGithubClientId();
  }

  @Post('github/user')
  @ApiOperation({ summary: 'Authenticate user with GitHub access token (Device Flow)' })
  @ApiResponse({ status: 200, description: 'User authenticated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid access token' })
  async githubUser(@Body() deviceFlowTokenDto: DeviceFlowTokenDto) {
    return this.authService.authWithGithub(deviceFlowTokenDto);
  }

  @Get('github/generate-auth')
  @ApiOperation({ summary: 'Generate GitHub OAuth authorization URL' })
  @ApiResponse({
    status: 200,
    description: 'Authorization URL generated successfully',
    schema: {
      type: 'object',
      properties: {
        authUrl: { type: 'string', description: 'GitHub OAuth authorization URL' },
        state: { type: 'string', description: 'CSRF protection state parameter' },
      },
    },
  })
  async generateAuth() {
    return this.authService.getGithubAuthUrl();
  }

  @Get('github/authorize-login')
  @ApiOperation({ summary: 'Handle GitHub OAuth callback (Authorization Code Flow)' })
  @ApiQuery({ name: 'code', description: 'Authorization code from GitHub' })
  @ApiQuery({ name: 'state', description: 'CSRF protection state parameter', required: false })
  @ApiResponse({ status: 302, description: 'Redirects to frontend with authentication result' })
  @ApiResponse({ status: 400, description: 'Invalid authorization code or missing parameters' })
  @ApiResponse({ status: 401, description: 'Invalid or expired state parameter' })
  async authorizeLogin(
    @Query('code') code: string,
    @Res() res: Response,
    @Query('state') state?: string,
  ) {
    if (!code) {
      const errorUrl = `http://localhost:3001/auth/github/authorize-login?error=${encodeURIComponent('Authorization code is required')}`;
      return res.redirect(errorUrl);
    }

    try {
      const authResult = await this.authService.authenticateWithGithubCode(code, state);
      const successUrl = `http://localhost:3001/auth/github/authorize-login?success=true&jwt=${authResult.jwt}&user=${encodeURIComponent(JSON.stringify(authResult.user))}`;
      return res.redirect(successUrl);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      const errorUrl = `http://localhost:3001/auth/github/authorize-login?error=${encodeURIComponent(errorMessage)}`;
      return res.redirect(errorUrl);
    }
  }
}
