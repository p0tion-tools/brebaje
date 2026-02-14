import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  DeviceFlowTokenDto,
  GenerateNonceDto,
  TestLoginDto,
  VerifySignatureDto,
  GenerateEthNonceDto,
  VerifyEthSignatureDto,
} from './dto/auth-dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('github/client-id')
  @ApiOperation({ summary: 'Get GitHub client ID for OAuth setup' })
  @ApiResponse({ status: 200, description: 'GitHub client ID returned successfully' })
  getGithubClientId() {
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
  generateAuth() {
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

  @Post('cardano/generate-nonce')
  @ApiOperation({ summary: 'Generate nonce for Cardano wallet ownership proof' })
  @ApiResponse({
    status: 200,
    description: 'Nonce generated successfully',
    schema: {
      type: 'object',
      properties: {
        nonce: { type: 'string', description: 'Unique nonce to be signed by wallet' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid wallet address' })
  generateCardanoNonce(@Body() generateNonceDto: GenerateNonceDto) {
    return this.authService.generateCardanoNonce(generateNonceDto.userAddress);
  }

  @Post('cardano/verify-signature')
  @ApiOperation({ summary: 'Verify wallet signature and authenticate user' })
  @ApiResponse({
    status: 200,
    description: 'Signature verified and user authenticated successfully',
    schema: {
      type: 'object',
      properties: {
        user: { type: 'object', description: 'User information' },
        jwt: { type: 'string', description: 'JWT authentication token' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid signature or wallet address' })
  @ApiResponse({ status: 404, description: 'No nonce found for this address' })
  async verifyCardanoSignature(@Body() verifySignatureDto: VerifySignatureDto) {
    return this.authService.verifyCardanoNonce(
      verifySignatureDto.userAddress,
      verifySignatureDto.signature,
    );
  }

  @Post('test/login')
  @ApiOperation({ summary: 'Test endpoint to authenticate user by ID (for testing purposes only)' })
  @ApiResponse({
    status: 201,
    description: 'User authenticated successfully',
    schema: {
      type: 'object',
      properties: {
        user: { type: 'object', description: 'User information' },
        jwt: { type: 'string', description: 'JWT authentication token' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async testLogin(@Body() body: TestLoginDto) {
    return this.authService.testAuthWithUserId(body.userId);
  }

  @Post('eth/generate-nonce')
  @ApiOperation({ summary: 'Generate nonce for SIWE (Sign-In with Ethereum) authentication' })
  @ApiResponse({
    status: 201,
    description: 'Nonce generated successfully',
    schema: {
      type: 'object',
      properties: {
        nonce: { type: 'string', description: 'Unique nonce to be included in SIWE message' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid Ethereum address format' })
  generateEthNonce(@Body() generateEthNonceDto: GenerateEthNonceDto) {
    return this.authService.generateEthNonce(generateEthNonceDto.address);
  }

  @Post('eth/verify-signature')
  @ApiOperation({ summary: 'Verify SIWE signature and authenticate user (EIP-4361)' })
  @ApiResponse({
    status: 201,
    description: 'Signature verified and user authenticated successfully',
    schema: {
      type: 'object',
      properties: {
        user: { type: 'object', description: 'User information' },
        jwt: { type: 'string', description: 'JWT authentication token' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid signature, nonce, or message format' })
  async verifyEthSignature(@Body() verifyEthSignatureDto: VerifyEthSignatureDto) {
    return this.authService.verifyEthSignature(
      verifyEthSignatureDto.message,
      verifyEthSignatureDto.signature,
    );
  }
}
