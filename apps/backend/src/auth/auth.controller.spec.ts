/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            getGithubClientId: jest.fn(),
            authWithGithub: jest.fn(),
            generateEthNonce: jest.fn(),
            verifyEthSignature: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generateEthNonce', () => {
    it('should call authService.generateEthNonce with the provided address', () => {
      const address = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
      const mockNonce = { nonce: 'testNonce12345678' };

      (authService.generateEthNonce as jest.Mock).mockReturnValue(mockNonce);

      const result = controller.generateEthNonce({ address });

      expect(authService.generateEthNonce).toHaveBeenCalledWith(address);
      expect(result).toEqual(mockNonce);
    });
  });

  describe('verifyEthSignature', () => {
    it('should call authService.verifyEthSignature with message and signature', async () => {
      const message = 'example.com wants you to sign in...';
      const signature = '0xsignature';
      const mockResult = {
        user: { id: 1, displayName: '0x123...', provider: 'ETH' },
        jwt: 'test-jwt-token',
      };

      (authService.verifyEthSignature as jest.Mock).mockResolvedValue(mockResult);

      const result = await controller.verifyEthSignature({ message, signature });

      expect(authService.verifyEthSignature).toHaveBeenCalledWith(message, signature);
      expect(result).toEqual(mockResult);
    });
  });
});
