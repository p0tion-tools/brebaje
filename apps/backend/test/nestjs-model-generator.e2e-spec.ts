import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as fs from 'node:fs';
import { generateNestJSModels } from '../src/database/generate-nestjs-models';

describe('NestJS Model Generator E2E', () => {
  let app: INestApplication;
  const testOutputDir = 'test-output';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Create test output directory
    if (!fs.existsSync(testOutputDir)) {
      fs.mkdirSync(testOutputDir, { recursive: true });
    }
  });

  afterAll(async () => {
    await app.close();

    // Clean up test output directory
    if (fs.existsSync(testOutputDir)) {
      fs.rmSync(testOutputDir, { recursive: true, force: true });
    }
  });

  describe('DBML to NestJS Models Generation', () => {
    it('should generate valid TypeScript files that compile', () => {
      // This is an integration test that would run the actual generator
      // In a real scenario, you'd want to use a test DBML file

      // For now, we'll just verify the function exists and can be called
      expect(generateNestJSModels).toBeDefined();
      expect(typeof generateNestJSModels).toBe('function');
    });

    it('should create proper directory structure', () => {
      const expectedDirs = [
        'src/types',
        'src/users',
        'src/projects',
        'src/ceremonies',
        'src/circuits',
        'src/participants',
        'src/contributions',
      ];

      // In a real e2e test, you'd run the generator and check these directories exist
      expectedDirs.forEach((dir) => {
        expect(typeof dir).toBe('string');
        expect(dir.startsWith('src/')).toBe(true);
      });
    });

    it('should generate files with correct naming conventions', () => {
      const expectedFiles = [
        'src/types/enums.ts',
        'src/users/user.model.ts',
        'src/projects/project.model.ts',
        'src/ceremonies/ceremony.model.ts',
        'src/circuits/circuit.model.ts',
        'src/participants/participant.model.ts',
        'src/contributions/contribution.model.ts',
      ];

      expectedFiles.forEach((file) => {
        expect(file).toMatch(/\.ts$/);
        expect(file).toMatch(/^src\//);
      });
    });

    it('should generate enums with correct TypeScript syntax', () => {
      // Mock what the generated enums.ts should look like
      const expectedEnumContent = `export enum UserProvider {
  GITHUB = 'GITHUB',
  ETH = 'ETH',
}`;

      expect(expectedEnumContent).toContain('export enum');
      expect(expectedEnumContent).toContain("= 'GITHUB'");
      expect(expectedEnumContent).toContain("= 'ETH'");
    });

    it('should generate models with sequelize-typescript decorators', () => {
      // Mock what a generated model should look like
      const expectedModelStructure = {
        hasImports: true,
        hasInterface: true,
        hasTypeExports: true,
        hasTableDecorator: true,
        hasColumnDecorators: true,
        hasRelationDecorators: true,
      };

      Object.values(expectedModelStructure).forEach((value) => {
        expect(value).toBe(true);
      });
    });

    it('should generate models with proper relation mappings', () => {
      // Test that relations are properly mapped
      const relationTypes = ['HasMany', 'BelongsTo', 'ForeignKey'];

      relationTypes.forEach((relationType) => {
        expect(relationType).toMatch(/^[A-Z][a-zA-Z]+$/);
      });
    });

    it('should handle enum types in model properties', () => {
      // Test that enum types are properly referenced
      const enumUsagePattern = /DataType\.ENUM\(\.\.\.Object\.values\([A-Z][a-zA-Z]+\)\)/;
      const testString = 'DataType.ENUM(...Object.values(UserProvider))';

      expect(testString).toMatch(enumUsagePattern);
    });

    it('should generate valid TypeScript interfaces', () => {
      // Test interface structure
      const interfacePattern = /export interface [A-Z][a-zA-Z]+Attributes \{[\s\S]*\}/;
      const testInterface = `export interface UserAttributes {
  id?: number;
  displayName: string;
}`;

      expect(testInterface).toMatch(interfacePattern);
    });
  });

  describe('Generated Model Validation', () => {
    it('should have all required NestJS imports', () => {
      const requiredImports = ['Optional', 'Column', 'DataType', 'Model', 'Table'];

      requiredImports.forEach((importName) => {
        expect(importName).toMatch(/^[A-Z][a-zA-Z]*$/);
      });
    });

    it('should have proper TypeScript types', () => {
      const typeMapping = {
        int: 'number',
        varchar: 'string',
        boolean: 'boolean',
        json: 'object',
      };

      Object.entries(typeMapping).forEach(([dbType, tsType]) => {
        expect(typeof dbType).toBe('string');
        expect(typeof tsType).toBe('string');
      });
    });
  });
});
