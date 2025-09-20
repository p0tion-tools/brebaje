/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ScriptLogger } from './logger';

describe('ScriptLogger', () => {
  let logger: ScriptLogger;
  let consoleSpy: {
    log: jest.SpyInstance;
    error: jest.SpyInstance;
    warn: jest.SpyInstance;
  };

  beforeEach(() => {
    logger = new ScriptLogger('TestContext');

    // Mock console methods
    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation(),
    };
  });

  afterEach(() => {
    // Restore console methods
    consoleSpy.log.mockRestore();
    consoleSpy.error.mockRestore();
    consoleSpy.warn.mockRestore();
  });

  describe('log', () => {
    it('should log with context and timestamp', () => {
      const message = 'Test log message';
      logger.log(message);

      expect(consoleSpy.log).toHaveBeenCalledTimes(1);
      const logCall = consoleSpy.log.mock.calls[0]?.[0] as string;
      expect(logCall).toMatch(
        /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[TestContext\] Test log message/,
      );
    });
  });

  describe('error', () => {
    it('should log error with context and timestamp', () => {
      const message = 'Test error message';
      logger.error(message);

      expect(consoleSpy.error).toHaveBeenCalledTimes(1);
      const errorCall = consoleSpy.error.mock.calls[0]?.[0] as string;
      expect(errorCall).toMatch(
        /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[TestContext\] ERROR: Test error message/,
      );
    });

    it('should log error with stack trace when error object provided', () => {
      const message = 'Test error message';
      const error = new Error('Test error');
      logger.error(message, error);

      expect(consoleSpy.error).toHaveBeenCalledTimes(2);
      expect(consoleSpy.error.mock.calls[0]?.[0] as string).toMatch(/ERROR: Test error message/);
      expect(consoleSpy.error.mock.calls[1]?.[0] as string).toContain('Error: Test error');
    });
  });

  describe('warn', () => {
    it('should log warning with context and timestamp', () => {
      const message = 'Test warning message';
      logger.warn(message);

      expect(consoleSpy.warn).toHaveBeenCalledTimes(1);
      const warnCall = consoleSpy.warn.mock.calls[0]?.[0] as string;
      expect(warnCall).toMatch(
        /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[TestContext\] WARN: Test warning message/,
      );
    });
  });

  describe('success', () => {
    it('should log success message with checkmark emoji', () => {
      const message = 'Test success message';
      logger.success(message);

      expect(consoleSpy.log).toHaveBeenCalledTimes(1);
      const successCall = consoleSpy.log.mock.calls[0]?.[0] as string;
      expect(successCall).toMatch(
        /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[TestContext\] ✅ Test success message/,
      );
    });
  });

  describe('failure', () => {
    it('should log failure message with X emoji', () => {
      const message = 'Test failure message';
      logger.failure(message);

      expect(consoleSpy.log).toHaveBeenCalledTimes(1);
      const failureCall = consoleSpy.log.mock.calls[0]?.[0] as string;
      expect(failureCall).toMatch(
        /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[TestContext\] ❌ Test failure message/,
      );
    });
  });

  describe('context', () => {
    it('should use correct context in all log messages', () => {
      const customLogger = new ScriptLogger('CustomContext');

      customLogger.log('test');
      customLogger.error('test');
      customLogger.warn('test');
      customLogger.success('test');
      customLogger.failure('test');

      // Check that all calls include the custom context
      expect(consoleSpy.log.mock.calls[0]?.[0] as string).toContain('[CustomContext]');
      expect(consoleSpy.error.mock.calls[0]?.[0] as string).toContain('[CustomContext]');
      expect(consoleSpy.warn.mock.calls[0]?.[0] as string).toContain('[CustomContext]');
      expect(consoleSpy.log.mock.calls[1]?.[0] as string).toContain('[CustomContext]');
      expect(consoleSpy.log.mock.calls[2]?.[0] as string).toContain('[CustomContext]');
    });
  });
});
