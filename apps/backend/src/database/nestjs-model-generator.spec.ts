import { NestJSModelGenerator } from './nestjs-model-generator';
import { TableDefinition } from './dbml-to-sql';
import * as fs from 'node:fs';

// Mock the file system operations
jest.mock('node:fs', () => ({
  writeFileSync: jest.fn(),
  mkdirSync: jest.fn(),
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
}));

const mockWriteFileSync = fs.writeFileSync as jest.MockedFunction<typeof fs.writeFileSync>;
const mockMkdirSync = fs.mkdirSync as jest.MockedFunction<typeof fs.mkdirSync>;

describe('NestJSModelGenerator', () => {
  let generator: NestJSModelGenerator;
  let mockEnums: Map<string, string[]>;
  let mockTables: Map<string, TableDefinition>;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Setup mock enums
    mockEnums = new Map([
      ['UserProvider', ['GITHUB', 'ETH']],
      ['CeremonyState', ['SCHEDULED', 'OPENED', 'CLOSED']],
    ]);

    // Setup mock tables
    mockTables = new Map([
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
            {
              name: 'displayName',
              type: 'varchar',
              constraints: ['NOT NULL'],
            },
            {
              name: 'provider',
              type: 'UserProvider',
              constraints: ['NOT NULL', 'DEFAULT GITHUB'],
            },
          ],
          indexes: [],
          foreignKeys: [],
        },
      ],
      [
        'projects',
        {
          name: 'projects',
          columns: [
            {
              name: 'id',
              type: 'int',
              constraints: ['PRIMARY KEY', 'AUTOINCREMENT'],
            },
            {
              name: 'name',
              type: 'varchar',
              constraints: ['NOT NULL'],
            },
            {
              name: 'coordinatorId',
              type: 'int',
              constraints: ['NOT NULL'],
            },
          ],
          indexes: [],
          foreignKeys: [
            {
              columns: ['coordinatorId'],
              references: {
                table: 'users',
                columns: ['id'],
              },
            },
          ],
        },
      ],
      [
        'ceremonies',
        {
          name: 'ceremonies',
          columns: [
            {
              name: 'id',
              type: 'int',
              constraints: ['PRIMARY KEY', 'AUTOINCREMENT'],
            },
            {
              name: 'projectId',
              type: 'int',
              constraints: ['NOT NULL'],
            },
            {
              name: 'state',
              type: 'CeremonyState',
              constraints: ['NOT NULL', 'DEFAULT SCHEDULED'],
            },
          ],
          indexes: [],
          foreignKeys: [
            {
              columns: ['projectId'],
              references: {
                table: 'projects',
                columns: ['id'],
              },
            },
          ],
        },
      ],
    ]);

    generator = new NestJSModelGenerator(mockEnums, mockTables);
  });

  describe('generateAllModels', () => {
    it('should generate enums file and all model files', () => {
      generator.generateAllModels();

      // Should create enums file
      expect(mockWriteFileSync).toHaveBeenCalledWith(
        'src/types/enums.ts',
        expect.stringContaining('export enum UserProvider'),
      );

      // Should create model files
      expect(mockWriteFileSync).toHaveBeenCalledWith(
        'src/users/user.model.ts',
        expect.stringContaining("@Table({ tableName: 'users' })"),
      );

      expect(mockWriteFileSync).toHaveBeenCalledWith(
        'src/projects/project.model.ts',
        expect.stringContaining("@Table({ tableName: 'projects' })"),
      );

      expect(mockWriteFileSync).toHaveBeenCalledWith(
        'src/ceremonies/ceremony.model.ts',
        expect.stringContaining("@Table({ tableName: 'ceremonies' })"),
      );
    });

    it('should create necessary directories', () => {
      generator.generateAllModels();

      expect(mockMkdirSync).toHaveBeenCalledWith('src/types', { recursive: true });
      expect(mockMkdirSync).toHaveBeenCalledWith('src/users', { recursive: true });
      expect(mockMkdirSync).toHaveBeenCalledWith('src/projects', { recursive: true });
      expect(mockMkdirSync).toHaveBeenCalledWith('src/ceremonies', { recursive: true });
    });
  });

  describe('enum generation', () => {
    it('should generate correct enum content', () => {
      generator.generateAllModels();

      const enumCall = mockWriteFileSync.mock.calls.find(
        (call) => call[0] === 'src/types/enums.ts',
      );

      expect(enumCall).toBeDefined();
      const enumContent = enumCall![1] as string;

      expect(enumContent).toContain('export enum UserProvider {');
      expect(enumContent).toContain("GITHUB = 'GITHUB',");
      expect(enumContent).toContain("ETH = 'ETH',");

      expect(enumContent).toContain('export enum CeremonyState {');
      expect(enumContent).toContain("SCHEDULED = 'SCHEDULED',");
      expect(enumContent).toContain("OPENED = 'OPENED',");
      expect(enumContent).toContain("CLOSED = 'CLOSED',");
    });
  });

  describe('model generation', () => {
    it('should generate correct User model', () => {
      generator.generateAllModels();

      const userModelCall = mockWriteFileSync.mock.calls.find(
        (call) => call[0] === 'src/users/user.model.ts',
      );

      expect(userModelCall).toBeDefined();
      const userContent = userModelCall![1] as string;

      // Check imports
      expect(userContent).toContain("import { Optional } from 'sequelize'");
      expect(userContent).toContain('Column,');
      expect(userContent).toContain('DataType,');
      expect(userContent).toContain('Model,');
      expect(userContent).toContain('Table');
      expect(userContent).toContain("import { UserProvider } from 'src/types/enums'");

      // Check interface
      expect(userContent).toContain('export interface UserAttributes {');
      expect(userContent).toContain('id?: number;');
      expect(userContent).toContain('displayName: string;');
      expect(userContent).toContain('provider: UserProvider;');

      // Check class declaration
      expect(userContent).toContain("@Table({ tableName: 'users' })");
      expect(userContent).toContain('export class User extends Model implements UserAttributes');

      // Check columns
      expect(userContent).toContain('primaryKey: true');
      expect(userContent).toContain('autoIncrement: true');
      expect(userContent).toContain('declare id?: number');
      expect(userContent).toContain('DataType.ENUM(...Object.values(UserProvider))');
      expect(userContent).toContain('defaultValue: UserProvider.GITHUB');
    });

    it('should generate correct Project model with relations', () => {
      generator.generateAllModels();

      const projectModelCall = mockWriteFileSync.mock.calls.find(
        (call) => call[0] === 'src/projects/project.model.ts',
      );

      expect(projectModelCall).toBeDefined();
      const projectContent = projectModelCall![1] as string;

      // Check relation imports
      expect(projectContent).toContain("import { User } from 'src/users/user.model'");
      expect(projectContent).toContain("import { Ceremony } from 'src/ceremonies/ceremony.model'");
      expect(projectContent).toContain('BelongsTo');
      expect(projectContent).toContain('ForeignKey');
      expect(projectContent).toContain('HasMany');

      // Check belongsTo relation
      expect(projectContent).toContain('@ForeignKey(() => User)');
      expect(projectContent).toContain('@BelongsTo(() => User)');
      expect(projectContent).toContain('user: User;');

      // Check hasMany relation
      expect(projectContent).toContain("@HasMany(() => Ceremony, 'projectId')");
      expect(projectContent).toContain('ceremonies: Ceremony[];');
    });
  });

  describe('type mapping', () => {
    it('should map DBML types to Sequelize types correctly', () => {
      generator.generateAllModels();

      const userModelCall = mockWriteFileSync.mock.calls.find(
        (call) => call[0] === 'src/users/user.model.ts',
      );

      const userContent = userModelCall![1] as string;

      expect(userContent).toContain('DataType.INTEGER'); // int -> INTEGER
      expect(userContent).toContain('DataType.STRING'); // varchar -> STRING
    });

    it('should map DBML types to TypeScript types correctly', () => {
      generator.generateAllModels();

      const userModelCall = mockWriteFileSync.mock.calls.find(
        (call) => call[0] === 'src/users/user.model.ts',
      );

      const userContent = userModelCall![1] as string;

      expect(userContent).toContain('id?: number;'); // int -> number
      expect(userContent).toContain('displayName: string;'); // varchar -> string
    });
  });

  describe('relation mapping', () => {
    it('should detect belongsTo relations from foreign keys', () => {
      generator.generateAllModels();

      const projectModelCall = mockWriteFileSync.mock.calls.find(
        (call) => call[0] === 'src/projects/project.model.ts',
      );

      const projectContent = projectModelCall![1] as string;

      // Project belongs to User (coordinatorId -> users.id)
      expect(projectContent).toContain('@BelongsTo(() => User)');
      expect(projectContent).toContain('user: User;');
    });

    it('should detect hasMany relations from reverse foreign keys', () => {
      generator.generateAllModels();

      const userModelCall = mockWriteFileSync.mock.calls.find(
        (call) => call[0] === 'src/users/user.model.ts',
      );

      const userContent = userModelCall![1] as string;

      // User has many Projects (projects.coordinatorId -> users.id)
      expect(userContent).toContain("@HasMany(() => Project, 'coordinatorId')");
      expect(userContent).toContain('projects: Project[];');
    });
  });

  describe('constraint handling', () => {
    it('should handle primary key constraints', () => {
      generator.generateAllModels();

      const userModelCall = mockWriteFileSync.mock.calls.find(
        (call) => call[0] === 'src/users/user.model.ts',
      );

      const userContent = userModelCall![1] as string;

      expect(userContent).toContain('primaryKey: true');
    });

    it('should handle autoincrement constraints', () => {
      generator.generateAllModels();

      const userModelCall = mockWriteFileSync.mock.calls.find(
        (call) => call[0] === 'src/users/user.model.ts',
      );

      const userContent = userModelCall![1] as string;

      expect(userContent).toContain('autoIncrement: true');
      expect(userContent).toContain('declare id?: number'); // autoincrement should have declare
    });

    it('should handle not null constraints', () => {
      generator.generateAllModels();

      const userModelCall = mockWriteFileSync.mock.calls.find(
        (call) => call[0] === 'src/users/user.model.ts',
      );

      const userContent = userModelCall![1] as string;

      expect(userContent).toContain('allowNull: false'); // displayName is NOT NULL
    });

    it('should handle default value constraints', () => {
      generator.generateAllModels();

      const userModelCall = mockWriteFileSync.mock.calls.find(
        (call) => call[0] === 'src/users/user.model.ts',
      );

      const userContent = userModelCall![1] as string;

      expect(userContent).toContain('defaultValue: UserProvider.GITHUB');
    });
  });

  describe('import optimization', () => {
    it('should only import used enums per model', () => {
      generator.generateAllModels();

      const userModelCall = mockWriteFileSync.mock.calls.find(
        (call) => call[0] === 'src/users/user.model.ts',
      );

      const ceremonyModelCall = mockWriteFileSync.mock.calls.find(
        (call) => call[0] === 'src/ceremonies/ceremony.model.ts',
      );

      const userContent = userModelCall![1] as string;
      const ceremonyContent = ceremonyModelCall![1] as string;

      // User model should only import UserProvider
      expect(userContent).toContain("import { UserProvider } from 'src/types/enums'");
      expect(userContent).not.toContain('CeremonyState');

      // Ceremony model should only import CeremonyState
      expect(ceremonyContent).toContain("import { CeremonyState } from 'src/types/enums'");
      expect(ceremonyContent).not.toContain('UserProvider');
    });

    it('should only import necessary decorators', () => {
      generator.generateAllModels();

      const userModelCall = mockWriteFileSync.mock.calls.find(
        (call) => call[0] === 'src/users/user.model.ts',
      );

      const projectModelCall = mockWriteFileSync.mock.calls.find(
        (call) => call[0] === 'src/projects/project.model.ts',
      );

      const userContent = userModelCall![1] as string;
      const projectContent = projectModelCall![1] as string;

      // User has hasMany relations (Project references User), should import HasMany
      expect(userContent).toContain('Column,');
      expect(userContent).toContain('DataType,');
      expect(userContent).toContain('Model,');
      expect(userContent).toContain('Table');
      expect(userContent).toContain('HasMany'); // User has hasMany Project via coordinatorId
      expect(userContent).not.toContain('BelongsTo'); // User doesn't belong to anything

      // Project has relations, should import relation decorators
      expect(projectContent).toContain('BelongsTo');
      expect(projectContent).toContain('ForeignKey');
      expect(projectContent).toContain('HasMany');
    });
  });
});
