import { DeviceFlowTokenDto, JWTDto } from './auth-dto';

describe('Auth DTOs', () => {
  describe('JWTDto', () => {
    it('should be defined', () => {
      expect(new JWTDto()).toBeDefined();
    });
  });

  describe('DeviceFlowTokenDto', () => {
    it('should be defined', () => {
      expect(new DeviceFlowTokenDto()).toBeDefined();
    });
  });
});
