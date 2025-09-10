/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { generateNestJSModels } from './generate-nestjs-models';
import { convertDbmlToSql } from './dbml-to-sql';
import { createModels } from './create-models';
import { NestJSModelGenerator } from './nestjs-model-generator';

// Mock all dependencies
jest.mock('./dbml-to-sql');
jest.mock('./create-models');
jest.mock('./nestjs-model-generator');

const mockConvertDbmlToSql = convertDbmlToSql as jest.MockedFunction<typeof convertDbmlToSql>;
const mockCreateModels = createModels as jest.MockedFunction<typeof createModels>;
const MockNestJSModelGenerator = NestJSModelGenerator as jest.MockedClass<
  typeof NestJSModelGenerator
>;

describe('generateNestJSModels Integration', () => {
  let mockGenerateAllModels: jest.MockedFunction<() => void>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the generateAllModels method
    mockGenerateAllModels = jest.fn();
    MockNestJSModelGenerator.mockImplementation(
      () =>
        ({
          generateAllModels: mockGenerateAllModels,
        }) as any,
    );

    // Mock convertDbmlToSql return value
    mockConvertDbmlToSql.mockReturnValue({
      sql: 'CREATE TABLE users (id INTEGER PRIMARY KEY);',
      enums: new Map([
        ['UserProvider', ['GITHUB', 'ETH']],
        ['CeremonyState', ['SCHEDULED', 'OPENED']],
      ]),
      tables: new Map([
        [
          'users',
          {
            name: 'users',
            columns: [
              {
                name: 'id',
                type: 'int',
                constraints: ['PRIMARY KEY', 'AUTOINCREMENT'],
              },
            ],
            indexes: [],
            foreignKeys: [],
          },
        ],
      ]),
    });

    // Mock createModels to resolve successfully
    mockCreateModels.mockResolvedValue(undefined);
  });

  describe('generateNestJSModels', () => {
    it('should execute the complete pipeline successfully', async () => {
      await generateNestJSModels();

      // Verify DBML conversion was called
      expect(mockConvertDbmlToSql).toHaveBeenCalledWith('src/database/diagram.dbml');

      // Verify database setup was called with SQL
      expect(mockCreateModels).toHaveBeenCalledWith('CREATE TABLE users (id INTEGER PRIMARY KEY);');

      // Verify NestJS generator was instantiated with correct data
      expect(MockNestJSModelGenerator).toHaveBeenCalledWith(
        expect.any(Map), // enums
        expect.any(Map), // tables
      );

      // Verify model generation was called
      expect(mockGenerateAllModels).toHaveBeenCalled();
    });

    it('should pass correct enums to generator', async () => {
      await generateNestJSModels();

      const generatorCall = MockNestJSModelGenerator.mock.calls[0];

      const enumsMap = generatorCall[0];

      expect(enumsMap.get('UserProvider')).toEqual(['GITHUB', 'ETH']);
      expect(enumsMap.get('CeremonyState')).toEqual(['SCHEDULED', 'OPENED']);
    });

    it('should pass correct tables to generator', async () => {
      await generateNestJSModels();

      const generatorCall = MockNestJSModelGenerator.mock.calls[0];

      const tablesMap = generatorCall[1] as Map<string, any>;

      expect(tablesMap.has('users')).toBe(true);
      expect(tablesMap.get('users')).toMatchObject({
        name: 'users',
        columns: expect.any(Array),
        indexes: expect.any(Array),
        foreignKeys: expect.any(Array),
      });
    });

    it('should handle errors in DBML conversion', async () => {
      const error = new Error('DBML parsing failed');
      mockConvertDbmlToSql.mockImplementation((): never => {
        throw error;
      });

      await expect(generateNestJSModels()).rejects.toThrow('DBML parsing failed');
    });

    it('should handle errors in database setup', async () => {
      const error = new Error('Database setup failed');
      mockCreateModels.mockRejectedValue(error);

      await expect(generateNestJSModels()).rejects.toThrow('Database setup failed');
    });

    it('should handle errors in model generation', async () => {
      const error = new Error('Model generation failed');
      mockGenerateAllModels.mockImplementation((): never => {
        throw error;
      });

      await expect(generateNestJSModels()).rejects.toThrow('Model generation failed');
    });
  });
});
