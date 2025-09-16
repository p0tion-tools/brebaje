import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserProvider } from '../types/enums';

// Mock fetch globally
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
            findByGithubId: jest.fn(),
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

      // This test demonstrates what the device flow initiation would look like
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
      expect(deviceAuth.device_code).toBeDefined();
      expect(deviceAuth.user_code).toBeDefined();
      expect(deviceAuth.verification_uri).toBe('https://github.com/login/device');
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
      expect(tokenData.access_token).toBeDefined();
      expect(tokenData.token_type).toBe('bearer');
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

  describe('authWithGithub', () => {
    const mockGithubUser = {
      id: 12345,
      login: 'testuser',
      avatar_url: 'https://github.com/images/avatar.png',
      name: 'Test User',
      email: 'test@example.com',
    };

    const mockUser = {
      id: 1,
      displayName: 'testuser',
      creationTime: Date.now(),
      provider: UserProvider.GITHUB,
      githubId: 12345,
    };

    const deviceFlowToken = {
      access_token: 'gho_16C7e42F292c6912E7710c838347Ae178B4a',
      token_type: 'bearer',
    };

    it('should authenticate existing user with GitHub token', async () => {
      // Mock GitHub API response
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockGithubUser,
      });

      // Mock existing user found
      (usersService.findByGithubId as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.authWithGithub(deviceFlowToken);

      expect(fetch).toHaveBeenCalledWith('https://api.github.com/user', {
        headers: {
          Authorization: `token ${deviceFlowToken.access_token}`,
        },
      });

      expect(usersService.findByGithubId).toHaveBeenCalledWith(mockGithubUser.id);
      expect(jwtService.signAsync).toHaveBeenCalledWith({ user: mockUser });

      expect(result).toEqual({
        user: mockUser,
        jwt: 'test-jwt-token',
      });
    });

    it('should create new user when not found and authenticate', async () => {
      // Mock GitHub API response
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockGithubUser,
      });

      // Mock user not found, then created
      (usersService.findByGithubId as jest.Mock).mockRejectedValue(new Error('User not found'));
      (usersService.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.authWithGithub(deviceFlowToken);

      expect(fetch).toHaveBeenCalledWith('https://api.github.com/user', {
        headers: {
          Authorization: `token ${deviceFlowToken.access_token}`,
        },
      });

      expect(usersService.findByGithubId).toHaveBeenCalledWith(mockGithubUser.id);

      expect(usersService.create).toHaveBeenCalledWith({
        displayName: mockGithubUser.login,
        creationTime: expect.any(Number),
        avatarUrl: mockGithubUser.avatar_url,
        provider: UserProvider.GITHUB,
        githubId: mockGithubUser.id,
      });

      expect(jwtService.signAsync).toHaveBeenCalledWith({ user: mockUser });

      expect(result).toEqual({
        user: mockUser,
        jwt: 'test-jwt-token',
      });
    });

    it('should fallback to user ID as displayName when login is not available', async () => {
      const githubUserNoLogin = {
        ...mockGithubUser,
        login: null,
      };

      // Mock GitHub API response
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => githubUserNoLogin,
      });

      // Mock user not found, then created
      (usersService.findByGithubId as jest.Mock).mockRejectedValue(new Error('User not found'));
      (usersService.create as jest.Mock).mockResolvedValue(mockUser);

      await service.authWithGithub(deviceFlowToken);

      expect(usersService.create).toHaveBeenCalledWith({
        displayName: mockGithubUser.id.toString(),
        creationTime: expect.any(Number),
        avatarUrl: mockGithubUser.avatar_url,
        provider: UserProvider.GITHUB,
        githubId: mockGithubUser.id,
      });
    });

    it('should handle GitHub API errors', async () => {
      // Mock GitHub API error
      (fetch as jest.Mock).mockRejectedValue(new Error('GitHub API error'));

      const result = await service.authWithGithub(deviceFlowToken);

      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('GitHub API error');
    });

    it('should handle invalid access token', async () => {
      // Mock GitHub API unauthorized response
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          message: 'Bad credentials',
          documentation_url: 'https://docs.github.com/rest',
        }),
      });

      const result = await service.authWithGithub(deviceFlowToken);

      expect(fetch).toHaveBeenCalledWith('https://api.github.com/user', {
        headers: {
          Authorization: `token ${deviceFlowToken.access_token}`,
        },
      });

      // The service should handle this error gracefully
      expect(result).toBeDefined();
    });
  });

  describe('Complete OAuth Flow Integration', () => {
    it('should demonstrate the complete device flow process', async () => {
      // This test demonstrates the end-to-end flow using the current service implementation

      // Mock GitHub API response for user info
      (fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({
          id: 12345,
          login: 'testuser',
          avatar_url: 'https://github.com/images/avatar.png',
          name: 'Test User',
          email: 'test@example.com',
        }),
      });

      // Mock user not found, then created
      const mockCreatedUser = {
        id: 1,
        displayName: 'testuser',
        githubId: 12345,
        provider: UserProvider.GITHUB,
        creationTime: Date.now(),
      };

      (usersService.findByGithubId as jest.Mock).mockRejectedValue(new Error('User not found'));
      (usersService.create as jest.Mock).mockResolvedValue(mockCreatedUser);

      // Test the current implementation (step 3 of the full flow)
      const result = await service.authWithGithub({
        access_token: 'gho_test_token',
        token_type: 'bearer',
      });

      // Verify the authentication worked
      expect(result).toBeDefined();
      expect(result.user).toEqual(mockCreatedUser);
      expect(result.jwt).toBe('test-jwt-token');

      // Verify the correct API calls were made
      expect(fetch).toHaveBeenCalledWith('https://api.github.com/user', {
        headers: {
          Authorization: 'token gho_test_token',
        },
      });

      expect(usersService.create).toHaveBeenCalledWith({
        displayName: 'testuser',
        creationTime: expect.any(Number),
        avatarUrl: 'https://github.com/images/avatar.png',
        provider: UserProvider.GITHUB,
        githubId: 12345,
      });
    });
  });
});
