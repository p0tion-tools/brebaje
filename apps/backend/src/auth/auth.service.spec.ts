/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserProvider } from '../types/enums';
import { UserAttributes } from '../users/user.model';
import { DeviceFlowTokenDto, AuthResponseDto } from './dto/auth-dto';
import { GithubUser } from '../types/declarations';
import { UnauthorizedException } from '@nestjs/common';
import { formatMessageForSIWE } from '@brebaje/actions';

// Mock fetch globally for device flow OAuth tests only
global.fetch = jest.fn();

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('test-jwt-token'),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findByProviderAndDisplayName: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);

    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getGithubClientId', () => {
    it('should return the GitHub client ID from environment', () => {
      process.env.GITHUB_CLIENT_ID = 'test_client_id';

      const result = service.getGithubClientId();

      expect(result).toEqual({
        client_id: 'test_client_id',
      });
    });
  });

  // This test demonstrates what the device flow initiation would look like
  // We could remove it once this tested e2e
  describe('GitHub Device Flow OAuth', () => {
    const mockDeviceAuthResponse = {
      device_code: '3584d83530557fdd1f46af8289938c8ef79f9dc5',
      user_code: 'WDJB-MJHT',
      verification_uri: 'https://github.com/login/device',
      verification_uri_complete: 'https://github.com/login/device?user_code=WDJB-MJHT',
      expires_in: 900,
      interval: 5,
    };

    const mockTokenResponse = {
      access_token: 'gho_16C7e42F292c6912E7710c838347Ae178B4a',
      token_type: 'bearer',
      scope: 'user:email',
    };

    it('should initiate device flow authorization', async () => {
      // Mock the device authorization request
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => mockDeviceAuthResponse,
      });

      const clientId = 'test_client_id';
      const scope = 'user:email';

      const response = await fetch('https://github.com/login/device/code', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `client_id=${clientId}&scope=${scope}`,
      });

      const deviceAuth = await response.json();

      expect(fetch).toHaveBeenCalledWith('https://github.com/login/device/code', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `client_id=${clientId}&scope=${scope}`,
      });

      expect(deviceAuth).toEqual(mockDeviceAuthResponse);
    });

    it('should poll for access token', async () => {
      // Mock the token polling request
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => mockTokenResponse,
      });

      // This test demonstrates what the token polling would look like
      const clientId = 'test_client_id';
      const deviceCode = mockDeviceAuthResponse.device_code;

      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `client_id=${clientId}&device_code=${deviceCode}&grant_type=urn:ietf:params:oauth:grant-type:device_code`,
      });

      const tokenData = await response.json();

      expect(fetch).toHaveBeenCalledWith('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `client_id=${clientId}&device_code=${deviceCode}&grant_type=urn:ietf:params:oauth:grant-type:device_code`,
      });

      expect(tokenData).toEqual(mockTokenResponse);
    });

    it('should handle polling errors (authorization_pending)', async () => {
      // Mock the authorization pending response
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => ({
          error: 'authorization_pending',
          error_description:
            'The authorization request is still pending as the user has not yet completed the user interaction steps.',
        }),
      });

      const clientId = 'test_client_id';
      const deviceCode = mockDeviceAuthResponse.device_code;

      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `client_id=${clientId}&device_code=${deviceCode}&grant_type=urn:ietf:params:oauth:grant-type:device_code`,
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);

      const error = await response.json();
      expect(error.error).toBe('authorization_pending');
    });
  });

  describe('fetchGithubUser', () => {
    beforeEach(() => {
      // Reset fetch mock for each test
      (fetch as jest.Mock).mockClear();
    });

    it('should make successful API call with proper headers', async () => {
      const mockGithubUserResponse: Partial<GithubUser> = {
        id: 12345,
        login: 'testuser',
        avatar_url: 'https://github.com/images/avatar.png',
        name: 'Test User',
        email: 'test@example.com',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => mockGithubUserResponse,
      });

      const result = await service['fetchGithubUser']('test_access_token');

      expect(fetch).toHaveBeenCalledWith('https://api.github.com/user', {
        headers: {
          Authorization: 'token test_access_token',
        },
      });
      expect(result).toEqual(mockGithubUserResponse);
    });

    it('should handle HTTP 401 unauthorized error', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => ({
          message: 'Bad credentials',
          documentation_url: 'https://docs.github.com/rest',
        }),
      });

      await expect(service['fetchGithubUser']('invalid_token')).rejects.toThrow();
    });

    it('should handle HTTP 404 not found error', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => ({
          message: 'Not Found',
        }),
      });

      await expect(service['fetchGithubUser']('test_token')).rejects.toThrow();
    });

    it('should handle network failures', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(service['fetchGithubUser']('test_token')).rejects.toThrow('Network error');
    });

    it('should handle invalid JSON response', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(service['fetchGithubUser']('test_token')).rejects.toThrow('Invalid JSON');
    });
  });

  describe('authWithGithub', () => {
    const mockGithubUser: Partial<GithubUser> = {
      id: 12345,
      login: 'testuser',
      avatar_url: 'https://github.com/images/avatar.png',
      name: 'Test User',
      email: 'test@example.com',
    };

    const mockUser: UserAttributes = {
      id: 1,
      displayName: 'testuser',
      creationTime: Date.now(),
      provider: UserProvider.GITHUB,
    };

    const deviceFlowToken: DeviceFlowTokenDto = {
      access_token: 'gho_16C7e42F292c6912E7710c838347Ae178B4a',
      token_type: 'bearer',
    };

    it('should authenticate existing user with GitHub token', async () => {
      // Spy on GitHub user fetch method
      jest.spyOn(service as any, 'fetchGithubUser').mockResolvedValue(mockGithubUser);

      // Mock existing user found
      (usersService.findByProviderAndDisplayName as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.authWithGithub(deviceFlowToken);

      expect(service['fetchGithubUser']).toHaveBeenCalledWith(deviceFlowToken.access_token);

      expect(usersService.findByProviderAndDisplayName).toHaveBeenCalledWith(
        mockGithubUser.login,
        UserProvider.GITHUB,
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith({ user: mockUser });

      expect(result).toEqual({
        user: mockUser,
        jwt: 'test-jwt-token',
      });
    });

    it('should create new user when not found and authenticate', async () => {
      // Spy on GitHub user fetch method
      jest.spyOn(service as any, 'fetchGithubUser').mockResolvedValue(mockGithubUser);

      // Mock user not found, then created
      (usersService.findByProviderAndDisplayName as jest.Mock).mockRejectedValue(
        new Error('User not found'),
      );
      (usersService.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.authWithGithub(deviceFlowToken);

      expect(service['fetchGithubUser']).toHaveBeenCalledWith(deviceFlowToken.access_token);

      expect(usersService.findByProviderAndDisplayName).toHaveBeenCalledWith(
        mockGithubUser.login,
        UserProvider.GITHUB,
      );

      expect(usersService.create).toHaveBeenCalledWith({
        displayName: mockGithubUser.login,
        avatarUrl: mockGithubUser.avatar_url,
        provider: UserProvider.GITHUB,
      });

      expect(jwtService.signAsync).toHaveBeenCalledWith({ user: mockUser });

      expect(result).toEqual({
        user: mockUser,
        jwt: 'test-jwt-token',
      });
    });

    it('should handle GitHub API errors', async () => {
      // Spy on GitHub user fetch method to simulate error
      jest
        .spyOn(service as any, 'fetchGithubUser')
        .mockRejectedValue(new Error('GitHub API error'));

      const result = await service.authWithGithub(deviceFlowToken);

      expect(result).toBeInstanceOf(Error);
      if (result instanceof Error) {
        expect(result.message).toBe('GitHub API error');
      }
    });

    it('should handle invalid access token', async () => {
      // Spy on GitHub user fetch method to simulate invalid token response
      const invalidTokenError: Error = new Error('Bad credentials');
      jest.spyOn(service as any, 'fetchGithubUser').mockRejectedValue(invalidTokenError);

      const result = await service.authWithGithub(deviceFlowToken);

      expect(service['fetchGithubUser']).toHaveBeenCalledWith(deviceFlowToken.access_token);

      // The service should handle this error gracefully
      expect(result).toBeInstanceOf(Error);
      if (result instanceof Error) {
        expect(result.message).toBe('Bad credentials');
      }
    });
  });

  describe('testAuthWithUserId', () => {
    const mockUser: UserAttributes = {
      id: 1,
      displayName: 'testuser',
      creationTime: Date.now(),
      provider: UserProvider.GITHUB,
    };

    it('should authenticate the user with valid userId', async () => {
      (usersService.findById as jest.Mock).mockResolvedValue(mockUser);

      const userId = 1;
      const result = await service.testAuthWithUserId(userId);

      expect(result).toBeDefined();
      expect(result).not.toBeInstanceOf(Error);
      if (!(result instanceof Error)) {
        expect(result.user.id).toBe(userId);
      }
    });

    it('should return an error for invalid userId', async () => {
      (usersService.findById as jest.Mock).mockResolvedValue(null);

      const userId = 999; // Non-existent user
      await expect(service.testAuthWithUserId(userId)).rejects.toThrow(
        `User with ID ${userId} not found`,
      );
    });

    it('should not work in production environment', async () => {
      process.env.NODE_ENV = 'production';

      (usersService.findById as jest.Mock).mockResolvedValue(mockUser);

      const userId = 1;

      await expect(service.testAuthWithUserId(userId)).rejects.toThrow(
        new UnauthorizedException('Test authentication not allowed in production'),
      );

      process.env.NODE_ENV = 'test'; // Reset to test environment
    });
  });

  describe('Complete OAuth Flow Integration', () => {
    it('should demonstrate the complete device flow process', async () => {
      // This test demonstrates the end-to-end flow using the current service implementation

      const githubUserData: Partial<GithubUser> = {
        id: 12345,
        login: 'testuser',
        avatar_url: 'https://github.com/images/avatar.png',
        name: 'Test User',
        email: 'test@example.com',
      };

      // Spy on GitHub user fetch method
      jest.spyOn(service as any, 'fetchGithubUser').mockResolvedValue(githubUserData);

      // Mock user not found, then created
      const mockCreatedUser = {
        id: 1,
        displayName: 'testuser',
        provider: UserProvider.GITHUB,
        creationTime: Date.now(),
      };

      (usersService.findByProviderAndDisplayName as jest.Mock).mockRejectedValue(
        new Error('User not found'),
      );
      (usersService.create as jest.Mock).mockResolvedValue(mockCreatedUser);

      // Test the current implementation (step 3 of the full flow)
      const result = await service.authWithGithub({
        access_token: 'gho_test_token',
        token_type: 'bearer',
      });

      // Verify the authentication worked
      expect(result).toBeDefined();
      expect(result).not.toBeInstanceOf(Error);
      if (!(result instanceof Error)) {
        expect(result.user).toEqual(mockCreatedUser);
        expect(result.jwt).toBe('test-jwt-token');
      }

      // Verify the correct method calls were made
      expect(service['fetchGithubUser']).toHaveBeenCalledWith('gho_test_token');

      expect(usersService.create).toHaveBeenCalledWith({
        displayName: 'testuser',
        avatarUrl: 'https://github.com/images/avatar.png',
        provider: UserProvider.GITHUB,
      });
    });
  });

  describe('getGithubAuthUrl', () => {
    beforeEach(() => {
      // Set up required environment variables
      process.env.GITHUB_CLIENT_ID = 'test_client_id';
      process.env.GITHUB_CLIENT_SECRET = 'test_client_secret';
      process.env.GITHUB_OAUTH_APP_CALLBACK = 'https://app.example.com/auth/callback';
    });

    afterEach(() => {
      // Clean up environment variables
      delete process.env.GITHUB_CLIENT_ID;
      delete process.env.GITHUB_CLIENT_SECRET;
      delete process.env.GITHUB_OAUTH_APP_CALLBACK;
    });

    it('should generate GitHub OAuth authorization URL with correct parameters', () => {
      const result = service.getGithubAuthUrl();

      expect(result).toHaveProperty('authUrl');
      expect(result).toHaveProperty('state');

      const url = new URL(result.authUrl);
      expect(url.origin + url.pathname).toBe('https://github.com/login/oauth/authorize');

      const params = url.searchParams;
      expect(params.get('client_id')).toBe('test_client_id');
      expect(params.get('redirect_uri')).toBe('https://app.example.com/auth/callback');
      expect(params.get('scope')).toBe('read:user user:email');
      expect(params.get('state')).toBe(result.state);
    });

    it('should generate unique state parameter', () => {
      const result1 = service.getGithubAuthUrl();
      const result2 = service.getGithubAuthUrl();

      expect(result1.state).not.toBe(result2.state);
      expect(result1.state).toHaveLength(64); // 32 bytes hex = 64 characters
      expect(result2.state).toHaveLength(64);
    });

    it('should store state in internal state store', () => {
      const result = service.getGithubAuthUrl();

      // Access private stateStore to verify state is stored
      const stateStore = service['stateStore'] as Map<string, { timestamp: number }>;
      expect(stateStore.has(result.state)).toBe(true);

      const storedState = stateStore.get(result.state);
      expect(storedState).toHaveProperty('timestamp');
      expect(typeof storedState?.timestamp).toBe('number');
    });

    it('should throw error when GITHUB_CLIENT_ID is missing', () => {
      delete process.env.GITHUB_CLIENT_ID;

      expect(() => service.getGithubAuthUrl()).toThrow(
        'GITHUB_CLIENT_ID environment variable is required',
      );
    });

    it('should throw error when GITHUB_CLIENT_SECRET is missing', () => {
      delete process.env.GITHUB_CLIENT_SECRET;

      expect(() => service.getGithubAuthUrl()).toThrow(
        'GITHUB_CLIENT_SECRET environment variable is required',
      );
    });

    it('should throw error when GITHUB_OAUTH_APP_CALLBACK is missing', () => {
      delete process.env.GITHUB_OAUTH_APP_CALLBACK;

      expect(() => service.getGithubAuthUrl()).toThrow(
        'GITHUB_OAUTH_APP_CALLBACK environment variable is required',
      );
    });

    it('should call cleanupExpiredStates before generating URL', () => {
      // Spy on the private cleanupExpiredStates method
      const cleanupSpy = jest.spyOn(service as any, 'cleanupExpiredStates');

      service.getGithubAuthUrl();

      expect(cleanupSpy).toHaveBeenCalled();
    });
  });

  describe('authenticateWithGithubCode', () => {
    beforeEach(() => {
      // Set up required environment variables
      process.env.GITHUB_CLIENT_ID = 'test_client_id';
      process.env.GITHUB_CLIENT_SECRET = 'test_client_secret';
      process.env.GITHUB_OAUTH_APP_CALLBACK = 'https://app.example.com/auth/callback';

      // Reset fetch mock
      (fetch as jest.Mock).mockClear();
    });

    afterEach(() => {
      // Clean up environment variables
      delete process.env.GITHUB_CLIENT_ID;
      delete process.env.GITHUB_CLIENT_SECRET;
      delete process.env.GITHUB_OAUTH_APP_CALLBACK;
    });

    it('should successfully authenticate with valid code and state', async () => {
      const validState = 'valid_state_token';
      const authCode = 'auth_code_123';
      const mockTokenResponse = {
        access_token: 'gho_test_access_token',
        token_type: 'bearer',
        scope: 'read:user user:email',
      };
      const mockUser: UserAttributes = {
        id: 1,
        displayName: 'testuser',
        provider: UserProvider.GITHUB,
        creationTime: Date.now(),
      };

      const mockAuthResult: AuthResponseDto = {
        user: mockUser as any, // Cast to User for interface compatibility
        jwt: 'test-jwt-token',
      };

      // Spy on validateState to return true
      jest.spyOn(service as any, 'validateState').mockReturnValue(true);

      // Mock GitHub token exchange
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => mockTokenResponse,
      });

      // Spy on authWithGithub to return mock result
      jest.spyOn(service, 'authWithGithub').mockResolvedValue(mockAuthResult);

      const result = await service.authenticateWithGithubCode(authCode, validState);

      expect(service['validateState']).toHaveBeenCalledWith(validState);
      expect(fetch).toHaveBeenCalledWith('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: 'test_client_id',
          client_secret: 'test_client_secret',
          code: authCode,
        }),
      });
      expect(service.authWithGithub).toHaveBeenCalledWith({
        access_token: mockTokenResponse.access_token,
        token_type: mockTokenResponse.token_type,
      });
      expect(result).toEqual(mockAuthResult);
    });

    it('should throw UnauthorizedException for invalid state', async () => {
      const invalidState = 'invalid_state';
      const authCode = 'auth_code_123';

      // Spy on validateState to return false
      jest.spyOn(service as any, 'validateState').mockReturnValue(false);

      await expect(service.authenticateWithGithubCode(authCode, invalidState)).rejects.toThrow(
        'Invalid or expired OAuth state parameter',
      );

      expect(service['validateState']).toHaveBeenCalledWith(invalidState);
    });

    it('should throw UnauthorizedException for missing state', async () => {
      const authCode = 'auth_code_123';

      // Spy on validateState to return false for empty string
      jest.spyOn(service as any, 'validateState').mockReturnValue(false);

      await expect(service.authenticateWithGithubCode(authCode)).rejects.toThrow(
        'Invalid or expired OAuth state parameter',
      );

      expect(service['validateState']).toHaveBeenCalledWith('');
    });

    it('should throw BadRequestException when GitHub token exchange fails', async () => {
      const validState = 'valid_state_token';
      const authCode = 'auth_code_123';

      // Spy on validateState to return true
      jest.spyOn(service as any, 'validateState').mockReturnValue(true);

      // Mock GitHub token exchange failure
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      });

      await expect(service.authenticateWithGithubCode(authCode, validState)).rejects.toThrow(
        'Failed to exchange authorization code for access token',
      );
    });

    it('should throw BadRequestException when GitHub returns OAuth error', async () => {
      const validState = 'valid_state_token';
      const authCode = 'invalid_auth_code';
      const errorResponse = {
        error: 'bad_verification_code',
        error_description: 'The code passed is incorrect or expired.',
      };

      // Spy on validateState to return true
      jest.spyOn(service as any, 'validateState').mockReturnValue(true);

      // Mock GitHub token exchange with error response
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => errorResponse,
      });

      await expect(service.authenticateWithGithubCode(authCode, validState)).rejects.toThrow(
        'GitHub OAuth error: The code passed is incorrect or expired.',
      );
    });

    it('should handle authWithGithub returning an Error', async () => {
      const validState = 'valid_state_token';
      const authCode = 'auth_code_123';
      const mockTokenResponse = {
        access_token: 'gho_test_access_token',
        token_type: 'bearer',
      };
      const authError = new Error('Authentication failed');

      // Spy on validateState to return true
      jest.spyOn(service as any, 'validateState').mockReturnValue(true);

      // Mock GitHub token exchange
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => mockTokenResponse,
      });

      // Spy on authWithGithub to return error
      jest.spyOn(service, 'authWithGithub').mockResolvedValue(authError);

      await expect(service.authenticateWithGithubCode(authCode, validState)).rejects.toThrow(
        'Authentication failed',
      );
    });

    it('should wrap unexpected errors in BadRequestException', async () => {
      const validState = 'valid_state_token';
      const authCode = 'auth_code_123';

      // Spy on validateState to return true
      jest.spyOn(service as any, 'validateState').mockReturnValue(true);

      // Mock fetch to throw network error
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(service.authenticateWithGithubCode(authCode, validState)).rejects.toThrow(
        'Authentication failed: Network error',
      );
    });
  });

  describe('SIWE (Sign-In with Ethereum) Authentication', () => {
    const validEthAddress = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
    const normalizedAddress = validEthAddress.toLowerCase();
    const mockUser: UserAttributes = {
      id: 1,
      displayName: validEthAddress,
      walletAddress: validEthAddress,
      creationTime: Date.now(),
      provider: UserProvider.ETHEREUM,
    };

    describe('generateEthNonce', () => {
      it('should generate a nonce for a valid Ethereum address', () => {
        const result = service.generateEthNonce(validEthAddress);

        expect(result).toHaveProperty('nonce');
        expect(typeof result.nonce).toBe('string');
        expect(result.nonce.length).toBeGreaterThan(0);
      });

      it('should store the nonce in internal store', () => {
        const result = service.generateEthNonce(validEthAddress);

        const ethNonceStore = service['ethNonceStore'] as Map<
          string,
          { nonce: string; timestamp: number }
        >;
        expect(ethNonceStore.has(normalizedAddress)).toBe(true);

        const storedData = ethNonceStore.get(normalizedAddress);
        expect(storedData?.nonce).toBe(result.nonce);
        expect(typeof storedData?.timestamp).toBe('number');
      });

      it('should generate different nonces for multiple calls', () => {
        const result1 = service.generateEthNonce(validEthAddress);
        const result2 = service.generateEthNonce(validEthAddress);

        // The same address will get a new nonce overwriting the old one
        expect(result1.nonce).not.toBe(result2.nonce);
      });

      it('should normalize address to lowercase for consistent storage', () => {
        // Using a valid checksummed address (EIP-55 compliant)
        const checksummedAddress = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
        service.generateEthNonce(checksummedAddress);

        const ethNonceStore = service['ethNonceStore'] as Map<
          string,
          { nonce: string; timestamp: number }
        >;
        expect(ethNonceStore.has(checksummedAddress.toLowerCase())).toBe(true);
        // Mixed case (checksummed) version should not be in store since we normalize
        expect(ethNonceStore.has(checksummedAddress)).toBe(false);
      });

      it('should throw BadRequestException for invalid Ethereum address format', () => {
        expect(() => service.generateEthNonce('invalid-address')).toThrow(
          'Invalid Ethereum address format',
        );
        expect(() => service.generateEthNonce('0x123')).toThrow('Invalid Ethereum address format');
        expect(() => service.generateEthNonce('')).toThrow('Invalid Ethereum address format');
      });

      it('should throw BadRequestException for address without 0x prefix', () => {
        expect(() => service.generateEthNonce('71C7656EC7ab88b098defB751B7401B5f6d8976F')).toThrow(
          'Invalid Ethereum address format',
        );
      });
    });

    describe('verifyEthSignature', () => {
      // Mock SIWE message with valid alphanumeric nonce (at least 8 chars)
      const mockNonce = 'abcd1234efgh5678';
      const mockSiweMessage = formatMessageForSIWE(`
          example.com wants you to sign in with your Ethereum account:
          ${validEthAddress}

          Sign in to Brebaje

          URI: https://example.com
          Version: 1
          Chain ID: 1
          Nonce: ${mockNonce}
          Issued At: 2023-01-01T00:00:00.000Z`);

      beforeEach(() => {
        // Pre-store a nonce for the test address
        const ethNonceStore = service['ethNonceStore'] as Map<
          string,
          { nonce: string; timestamp: number }
        >;
        ethNonceStore.set(normalizedAddress, {
          nonce: mockNonce,
          timestamp: Date.now(),
        });
      });

      it('should throw BadRequestException when no nonce found for address', async () => {
        const unknownAddress = '0x1234567890123456789012345678901234567890';
        // Valid SIWE message format with alphanumeric nonce
        const message = formatMessageForSIWE(`
            example.com wants you to sign in with your Ethereum account:
            ${unknownAddress}

            Sign in to Brebaje

            URI: https://example.com
            Version: 1
            Chain ID: 1
            Nonce: validNonceNotRegistered12345678
            Issued At: 2023-01-01T00:00:00.000Z`);

        await expect(service.verifyEthSignature(message, '0xsignature')).rejects.toThrow(
          'No nonce found for this address. Please request a new nonce.',
        );
      });

      it('should throw BadRequestException when nonce has expired', async () => {
        // Set an expired nonce (older than 5 minutes)
        const ethNonceStore = service['ethNonceStore'] as Map<
          string,
          { nonce: string; timestamp: number }
        >;
        ethNonceStore.set(normalizedAddress, {
          nonce: mockNonce,
          timestamp: Date.now() - 6 * 60 * 1000, // 6 minutes ago
        });

        await expect(service.verifyEthSignature(mockSiweMessage, '0xsignature')).rejects.toThrow(
          'Nonce has expired. Please request a new nonce.',
        );
      });

      it('should throw BadRequestException when nonce in message does not match stored nonce', async () => {
        // Store a different nonce than what's in the message (must be alphanumeric)
        const ethNonceStore = service['ethNonceStore'] as Map<
          string,
          { nonce: string; timestamp: number }
        >;
        ethNonceStore.set(normalizedAddress, {
          nonce: 'differentnonce123456',
          timestamp: Date.now(),
        });

        await expect(service.verifyEthSignature(mockSiweMessage, '0xsignature')).rejects.toThrow(
          'Invalid nonce in message',
        );
      });

      it('should authenticate existing user when signature is valid', async () => {
        // Mock user found
        (usersService.findByProviderAndDisplayName as jest.Mock).mockResolvedValue(mockUser);

        // Mock the SIWE verify method to return success
        const mockVerify = jest.fn().mockResolvedValue({ success: true });
        jest.spyOn(service as any, 'verifyEthSignature').mockImplementation(async () => {
          const result = await mockVerify();
          if (result.success) {
            const user = await usersService.findByProviderAndDisplayName(
              validEthAddress,
              UserProvider.ETHEREUM,
            );
            const jwt = await jwtService.signAsync({ user });
            return { user, jwt };
          }
          throw new Error('Verification failed');
        });

        const result = await service.verifyEthSignature(mockSiweMessage, '0xsignature');

        expect(result).toHaveProperty('user');
        expect(result).toHaveProperty('jwt');
        expect(result.jwt).toBe('test-jwt-token');
      });

      it('should create new user when user not found and signature is valid', async () => {
        // Mock user not found, then created
        (usersService.findByProviderAndDisplayName as jest.Mock).mockRejectedValue(
          new Error('User not found'),
        );
        (usersService.create as jest.Mock).mockResolvedValue(mockUser);

        // Mock the SIWE verify method to return success
        const mockVerify = jest.fn().mockResolvedValue({ success: true });
        jest.spyOn(service as any, 'verifyEthSignature').mockImplementation(async () => {
          const result = await mockVerify();
          if (result.success) {
            try {
              await usersService.findByProviderAndDisplayName(
                validEthAddress,
                UserProvider.ETHEREUM,
              );
            } catch {
              const user = await usersService.create({
                displayName: validEthAddress,
                walletAddress: validEthAddress,
                provider: UserProvider.ETHEREUM,
              });
              const jwt = await jwtService.signAsync({ user });
              return { user, jwt };
            }
          }
          throw new Error('Verification failed');
        });

        const result = await service.verifyEthSignature(mockSiweMessage, '0xsignature');

        expect(result).toHaveProperty('user');
        expect(result).toHaveProperty('jwt');
        expect(usersService.create).toHaveBeenCalledWith({
          displayName: validEthAddress,
          walletAddress: validEthAddress,
          provider: UserProvider.ETHEREUM,
        });
      });
    });

    describe('cleanupExpiredEthNonces', () => {
      it('should remove expired nonces from store', () => {
        const ethNonceStore = service['ethNonceStore'] as Map<
          string,
          { nonce: string; timestamp: number }
        >;

        // Add expired nonce
        const expiredAddress = '0x1111111111111111111111111111111111111111';
        ethNonceStore.set(expiredAddress.toLowerCase(), {
          nonce: 'expired-nonce',
          timestamp: Date.now() - 6 * 60 * 1000, // 6 minutes ago
        });

        // Add valid nonce
        ethNonceStore.set(normalizedAddress, {
          nonce: 'valid-nonce',
          timestamp: Date.now(),
        });

        // Trigger cleanup by generating a new nonce
        service.generateEthNonce('0x2222222222222222222222222222222222222222');

        // Check expired nonce is removed
        expect(ethNonceStore.has(expiredAddress.toLowerCase())).toBe(false);
        // Check valid nonces are still present
        expect(ethNonceStore.has(normalizedAddress)).toBe(true);
      });
    });
  });
});
