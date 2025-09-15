/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { DbmlToNestJSSequelizeGenerator } from './dbml-to-nestjs-sequelize';
import * as fs from 'node:fs';

describe('DbmlToNestJSSequelizeGenerator', () => {
  const testDbmlContent = `
Enum UserProvider {
  'GITHUB'
  'ETH'
}

Table users {
  id int [pk, increment]
  displayName varchar [not null]
  provider UserProvider [not null, default: 'GITHUB']
}

Table projects {
  id int [pk, increment]
  name varchar [not null, note: 'title in the frontend']
  coordinatorId int [ref: > users.id, not null]
}
`;

  beforeEach(() => {
    // Mock fs.readFileSync to return test content
    jest.spyOn(fs, 'readFileSync').mockReturnValue(testDbmlContent);
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'mkdirSync').mockImplementation();
    jest.spyOn(fs, 'writeFileSync').mockImplementation();
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should parse DBML and generate files', () => {
    const generator = new DbmlToNestJSSequelizeGenerator('test.dbml');

    expect(() => generator.generate()).not.toThrow();
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it('should generate enum file', () => {
    const generator = new DbmlToNestJSSequelizeGenerator('test.dbml');
    generator.generate();

    const writeFileSyncMock = fs.writeFileSync as jest.Mock;
    const enumCall = writeFileSyncMock.mock.calls.find((call: [string, string]) =>
      call[0].includes('enums.ts'),
    );

    expect(enumCall).toBeDefined();
    if (enumCall) {
      expect(enumCall[1]).toContain('export enum UserProvider');
      expect(enumCall[1]).toContain("GITHUB = 'GITHUB'");
    }
  });

  it('should generate model files', () => {
    const generator = new DbmlToNestJSSequelizeGenerator('test.dbml');
    generator.generate();

    const writeFileSyncMock = fs.writeFileSync as jest.Mock;
    const modelCalls = writeFileSyncMock.mock.calls.filter((call: [string, string]) =>
      call[0].includes('.model.ts'),
    );

    expect(modelCalls.length).toBeGreaterThan(0);

    const userModelCall = modelCalls.find((call: [string, string]) =>
      call[0].includes('user.model.ts'),
    );
    expect(userModelCall).toBeDefined();
    if (userModelCall) {
      expect(userModelCall[1]).toContain('export class User');
      expect(userModelCall[1]).toContain("@Table({ tableName: 'users' })");
    }
  });
});
