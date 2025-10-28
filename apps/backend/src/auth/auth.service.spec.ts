import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserProvider } from '../types/enums';
import { UserAttributes } from '../users/user.model';
import { DeviceFlowTokenDto, AuthResponseDto } from './dto/auth-dto';
import { GithubUser } from '../types/declarations';

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
        json: async () => mockDeviceAuthResponse,
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
        json: async () => mockTokenResponse,
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
        json: async () => ({
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
        json: async () => mockGithubUserResponse,
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
        json: async () => ({
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
        json: async () => ({
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
        json: async () => {
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
        json: async () => mockTokenResponse,
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
        json: async () => errorResponse,
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
        json: async () => mockTokenResponse,
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
});
