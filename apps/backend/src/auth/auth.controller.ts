import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DeviceFlowTokenDto } from './dto/auth-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('github/client-id')
  async getGithubClientId() {
    return this.authService.getGithubClientId();
  }

  @Post('github/user')
  async githubUser(@Body() deviceFlowTokenDto: DeviceFlowTokenDto) {
    return this.authService.authWithGithub(deviceFlowTokenDto);
  }

  @Get('github/generate-auth')
  async generateAuth() {
    return this.authService.getGithubAuthUrl();
  }

  @Get('github/authorize-login')
  async authorizeLogin(@Query('code') code: string, @Query('state') state?: string) {
    if (!code) {
      throw new Error('Authorization code is required');
    }
    return this.authService.authenticateWithGithubCode(code, state);
  }
}
