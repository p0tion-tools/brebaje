import { Injectable, Logger, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { DeviceFlowTokenDto, AuthResponseDto } from './dto/auth-dto';
import type { GithubUser } from '../types/declarations';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserProvider } from '../types/enums';
import { randomBytes } from 'crypto';
import { User } from '../users/user.model';
import { generateNonce, checkSignature, DataSignature } from '@meshsdk/core';
import { GithubTokenResponse } from 'src/types';
import { SiweMessage, generateNonce as generateSiweNonce } from 'siwe';
import { isAddress } from 'ethers';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly stateStore = new Map<string, { timestamp: number }>();
  private readonly nonceStore = new Map<string, string[]>();
  private readonly ethNonceStore = new Map<string, { nonce: string; timestamp: number }>();

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
    this.logger.debug('----------------------------------------------------');
    this.logger.debug(`State: ${state}`);
    this.logger.debug(`State Store: ${JSON.stringify([...this.stateStore.entries()])}`);
    this.logger.debug(`Stored: ${JSON.stringify(stored)}`);
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

  private async fetchGithubUser(accessToken: string): Promise<GithubUser> {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = (await response.json()) as { message: string };
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json() as Promise<GithubUser>;
  }

  async authWithGithub(deviceFlowTokenDto: DeviceFlowTokenDto): Promise<AuthResponseDto | Error> {
    try {
      const result = await this.fetchGithubUser(deviceFlowTokenDto.access_token);

      let user: User;
      try {
        user = await this.usersService.findByProviderAndDisplayName(
          result.login,
          UserProvider.GITHUB,
        );
      } catch {
        // User not found, create one
        const _user: CreateUserDto = {
          displayName: result.login,
          avatarUrl: result.avatar_url,
          provider: UserProvider.GITHUB,
        };
        user = await this.usersService.create(_user);
      }

      // create jwt
      const jwt = await this.jwtService.signAsync({ user: user });
      return { user, jwt };
    } catch (error) {
      return error as Error;
    }
  }

  /**
   * Test-only authentication method
   * Generates JWT token for existing user without OAuth flow
   * Only available in test/development environments
   */
  async testAuthWithUserId(userId: number): Promise<AuthResponseDto> {
    if (process.env.NODE_ENV === 'production') {
      throw new UnauthorizedException('Test authentication not allowed in production');
    }

    try {
      const user = await this.usersService.findById(userId);
      if (!user) {
        throw new BadRequestException(`User with ID ${userId} not found`);
      }

      const jwt = await this.jwtService.signAsync({ user: user });
      return { user, jwt };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException(`Failed to authenticate user: ${error}`);
    }
  }

  /**
   * GitHub OAuth 2.0 Authorization Code Flow
   * Step 1: Generate authorization URL for frontend redirect
   */
  getGithubAuthUrl() {
    this.logger.log('Generating GitHub OAuth authorization URL');

    // Clean up expired states before creating new ones
    this.cleanupExpiredStates();
    this.logger.debug('OAuth state cleanup done');

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
    this.logger.debug(`OAuth params: ${params.toString()}`);

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
    this.logger.debug(`State Store: ${JSON.stringify([...this.stateStore.entries()])}`);
    this.logger.debug(`On authenticateWithGithubCode - code: ${code}, state: ${state}`);
    try {
      this.logger.log(`Processing GitHub OAuth callback with code: ${code.substring(0, 8)}...`);

      // Validate state parameter for CSRF protection
      if (!this.validateState(state || '')) {
        throw new UnauthorizedException('Invalid or expired OAuth state parameter');
      }

      const { clientId, clientSecret } = this.getGitHubConfig();

      this.logger.debug('Exchanging authorization code for access token');
      this.logger.debug(`Code: ${code}`);
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

      this.logger.debug(`Token response body: ${JSON.stringify(tokenResponse.body)}`);
      if (!tokenResponse.ok) {
        this.logger.error(
          `GitHub token exchange failed: ${tokenResponse.status} ${tokenResponse.statusText}`,
        );
        throw new BadRequestException('Failed to exchange authorization code for access token');
      }

      const tokenData = (await tokenResponse.json()) as GithubTokenResponse;
      this.logger.debug(`Token data: ${JSON.stringify(tokenData)}`);

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
      this.logger.debug(`Auth result: ${JSON.stringify(result)}`);

      // Check if result is an error
      if (result instanceof Error) {
        throw result;
      }

      this.logger.log('GitHub OAuth authentication completed successfully');
      return result;
    } catch (error) {
      const errorObject = error as Error;
      this.logger.error('GitHub OAuth authentication failed', errorObject.stack);

      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(`Authentication failed: ${errorObject.message}`);
    }
  }

  generateCardanoNonce(userAddress: string) {
    this.logger.log(`Generating Cardano nonce for address: ${userAddress.substring(0, 8)}...`);

    // Check if address exists in nonceStore, if not create empty array
    if (!this.nonceStore.has(userAddress)) {
      this.nonceStore.set(userAddress, []);
    }

    const usedNonces = this.nonceStore.get(userAddress)!;

    // Generate initial nonce
    let nonce = generateNonce('Sign to prove wallet ownership: ');

    // Keep generating new nonces while current one is already used
    // Loop breaks when we find a unique nonce (not in usedNonces array)
    while (usedNonces.includes(nonce)) {
      nonce = generateNonce('Sign to prove wallet ownership: ');
    }

    // Add new unique nonce to the list
    usedNonces.push(nonce);

    this.logger.debug(
      `Stored nonce for address: ${userAddress.substring(0, 8)}..., total nonces: ${usedNonces.length}`,
    );

    return { nonce };
  }

  async verifyCardanoNonce(
    userAddress: string,
    signature: DataSignature,
  ): Promise<AuthResponseDto | Error> {
    this.logger.log(`Verifying Cardano signature for address: ${userAddress.substring(0, 8)}...`);

    // Check if address exists in nonceStore
    if (!this.nonceStore.has(userAddress)) {
      this.logger.warn(`No nonces found for address: ${userAddress.substring(0, 8)}...`);
      throw new BadRequestException('No nonce found for this address');
    }

    const usedNonces = this.nonceStore.get(userAddress)!;

    // Get the latest (most recent) nonce for this address
    if (usedNonces.length === 0) {
      this.logger.warn(`No nonces available for address: ${userAddress.substring(0, 8)}...`);
      throw new BadRequestException('No nonce available for verification');
    }

    const latestNonce = usedNonces[usedNonces.length - 1];
    this.logger.debug(`Using latest nonce for verification: ${latestNonce.substring(0, 8)}...`);

    // Verify the signature using Mesh SDK
    const isValidSignature = await checkSignature(latestNonce, signature, userAddress);

    this.logger.debug(`Signature verification result: ${isValidSignature}`);

    if (!isValidSignature) {
      this.logger.warn(`Invalid signature for address: ${userAddress.substring(0, 8)}...`);
      throw new BadRequestException('Invalid signature provided');
    }

    // Signature is valid, authenticate or create user
    try {
      let user: User;

      try {
        // Try to find existing user by wallet address and CARDANO provider
        user = await this.usersService.findByWalletAddressAndProvider(
          userAddress,
          UserProvider.CARDANO,
        );
        this.logger.debug(
          `Found existing Cardano user for address: ${userAddress.substring(0, 8)}...`,
        );
      } catch {
        // User not found, create new one
        this.logger.debug(
          `Creating new Cardano user for address: ${userAddress.substring(0, 8)}...`,
        );
        const createUserData: CreateUserDto = {
          displayName: `Cardano User ${userAddress.substring(0, 8)}`,
          walletAddress: userAddress,
          provider: UserProvider.CARDANO,
        };
        user = await this.usersService.create(createUserData);
      }

      // Generate JWT token
      const jwt = await this.jwtService.signAsync({ user });

      this.logger.log(
        `Cardano authentication successful for address: ${userAddress.substring(0, 8)}...`,
      );
      return { user, jwt };
    } catch (error) {
      this.logger.error(`Cardano authentication failed: ${(error as Error).message}`);
      return error as Error;
    }
  }

  // async getUserInfoFromCardano() {}

  /**
   * Generates a nonce for SIWE (Sign-In with Ethereum) authentication
   * The nonce is stored with a timestamp and expires after 5 minutes
   * @param address - The Ethereum wallet address (0x prefixed)
   * @returns Object containing the generated nonce
   */
  generateEthNonce(address: string) {
    this.logger.log(`Generating ETH SIWE nonce for address: ${address.substring(0, 10)}...`);

    // Validate Ethereum address using ethers.js isAddress (EIP-55 checksum aware)
    // Also require 0x prefix for SIWE compatibility
    if (!address || !address.startsWith('0x') || !isAddress(address)) {
      this.logger.warn(`Invalid Ethereum address format: ${address}`);
      throw new BadRequestException('Invalid Ethereum address format');
    }

    // Normalize address to lowercase for consistent storage
    const normalizedAddress = address.toLowerCase();

    // Clean up expired nonces before generating a new one
    this.cleanupExpiredEthNonces();

    // Generate a unique nonce using SIWE library
    const nonce = generateSiweNonce();

    // Store the nonce with timestamp
    this.ethNonceStore.set(normalizedAddress, {
      nonce,
      timestamp: Date.now(),
    });

    this.logger.debug(`Stored ETH nonce for address: ${normalizedAddress.substring(0, 10)}...`);

    return { nonce };
  }

  /**
   * Cleans up expired ETH nonces from memory (older than 5 minutes)
   */
  private cleanupExpiredEthNonces(): void {
    const now = Date.now();
    const expiredAddresses: string[] = [];

    this.ethNonceStore.forEach((value, key) => {
      if (now - value.timestamp > 5 * 60 * 1000) {
        expiredAddresses.push(key);
      }
    });

    expiredAddresses.forEach((address) => this.ethNonceStore.delete(address));

    if (expiredAddresses.length > 0) {
      this.logger.debug(`Cleaned up ${expiredAddresses.length} expired ETH nonces`);
    }
  }

  /**
   * Verifies a SIWE (Sign-In with Ethereum) signature and authenticates the user
   * Following EIP-4361 standard
   * @param message - The SIWE message that was signed
   * @param signature - The cryptographic signature from the wallet
   * @returns AuthResponseDto with user and JWT token
   */
  async verifyEthSignature(message: string, signature: string): Promise<AuthResponseDto> {
    this.logger.log('Verifying ETH SIWE signature');

    try {
      // Parse the SIWE message
      const siweMessage = new SiweMessage(message);

      // Normalize address for lookup
      const normalizedAddress = siweMessage.address.toLowerCase();

      // Check if we have a nonce stored for this address
      const storedNonceData = this.ethNonceStore.get(normalizedAddress);
      if (!storedNonceData) {
        this.logger.warn(`No nonce found for address: ${normalizedAddress.substring(0, 10)}...`);
        throw new BadRequestException(
          'No nonce found for this address. Please request a new nonce.',
        );
      }

      // Check if nonce has expired (5 minutes)
      if (Date.now() - storedNonceData.timestamp > 5 * 60 * 1000) {
        this.logger.warn(`Nonce expired for address: ${normalizedAddress.substring(0, 10)}...`);
        this.ethNonceStore.delete(normalizedAddress);
        throw new BadRequestException('Nonce has expired. Please request a new nonce.');
      }

      // Verify the nonce in the message matches the stored nonce
      if (siweMessage.nonce !== storedNonceData.nonce) {
        this.logger.warn(`Nonce mismatch for address: ${normalizedAddress.substring(0, 10)}...`);
        throw new BadRequestException('Invalid nonce in message');
      }

      // Verify the signature using SIWE library
      const verificationResult = await siweMessage.verify({ signature });

      if (!verificationResult.success) {
        this.logger.warn(
          `Invalid signature for address: ${normalizedAddress.substring(0, 10)}... Error: ${verificationResult.error?.type}`,
        );
        throw new BadRequestException('Invalid signature provided');
      }

      // Nonce is now used, remove it from store (one-time use)
      this.ethNonceStore.delete(normalizedAddress);
      this.logger.debug(`ETH nonce consumed for address: ${normalizedAddress.substring(0, 10)}...`);

      // Get the verified address from the message
      const verifiedAddress = siweMessage.address;

      // Find or create user
      let user: User;

      try {
        // Try to find existing user by displayName (0x address) and ETH provider
        user = await this.usersService.findByProviderAndDisplayName(
          verifiedAddress,
          UserProvider.ETH,
        );
        this.logger.debug(
          `Found existing ETH user for address: ${verifiedAddress.substring(0, 10)}...`,
        );
      } catch {
        // User not found, create new one
        this.logger.debug(
          `Creating new ETH user for address: ${verifiedAddress.substring(0, 10)}...`,
        );
        const createUserData: CreateUserDto = {
          displayName: verifiedAddress,
          walletAddress: verifiedAddress,
          provider: UserProvider.ETH,
        };
        user = await this.usersService.create(createUserData);
      }

      // Generate JWT token
      const jwt = await this.jwtService.signAsync({ user });

      this.logger.log(
        `ETH SIWE authentication successful for address: ${verifiedAddress.substring(0, 10)}...`,
      );
      return { user, jwt };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`ETH SIWE authentication failed: ${(error as Error).message}`);
      throw new BadRequestException(`Authentication failed: ${(error as Error).message}`);
    }
  }
}
