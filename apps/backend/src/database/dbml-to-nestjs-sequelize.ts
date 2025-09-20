#!/usr/bin/env ts-node

import * as fs from 'node:fs';
import * as path from 'node:path';

interface EnumDefinition {
  name: string;
  values: string[];
}

interface ColumnDefinition {
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isAutoIncrement: boolean;
  isNotNull: boolean;
  isUnique: boolean;
  defaultValue?: string;
  note?: string;
}

interface ReferenceDefinition {
  fromColumn: string;
  toTable: string;
  toColumn: string;
}

interface TableDefinition {
  name: string;
  columns: ColumnDefinition[];
  references: ReferenceDefinition[];
}

export class DbmlToNestJSSequelizeGenerator {
  private enums: EnumDefinition[] = [];
  private tables: TableDefinition[] = [];

  constructor(private dbmlPath: string) {}

  generate(): void {
    const dbmlContent = fs.readFileSync(this.dbmlPath, 'utf-8');
    this.parseDbml(dbmlContent);
    this.generateEnumsFile();
    this.generateModelFiles();
    console.log('✅ Generated NestJS Sequelize models from DBML');
  }

  private parseDbml(content: string): void {
    const lines = content.split('\n').map((line) => line.trim());
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      if (line.startsWith('Enum ')) {
        i = this.parseEnum(lines, i);
      } else if (line.startsWith('Table ')) {
        i = this.parseTable(lines, i);
      } else {
        i++;
      }
    }
  }

  private parseEnum(lines: string[], startIndex: number): number {
    const enumName = lines[startIndex].replace('Enum ', '').replace(' {', '').trim();
    const values: string[] = [];
    let i = startIndex + 1;

    while (i < lines.length && !lines[i].includes('}')) {
      const line = lines[i].trim();
      if (line && line !== '' && !line.startsWith('//')) {
        const value = line.replace(/['"]/g, '').replace(/,$/, '');
        if (value) {
          values.push(value);
        }
      }
      i++;
    }

    this.enums.push({ name: enumName, values });
    return i + 1;
  }

  private parseTable(lines: string[], startIndex: number): number {
    const tableName = lines[startIndex].replace('Table ', '').replace(' {', '').trim();
    const columns: ColumnDefinition[] = [];
    const references: ReferenceDefinition[] = [];
    let i = startIndex + 1;

    while (i < lines.length && !lines[i].includes('}')) {
      const line = lines[i].trim();
      if (line && line !== '' && !line.startsWith('//')) {
        const column = this.parseColumn(line);
        if (column) {
          columns.push(column);

          // Check for references
          const refMatch = line.match(/\[ref: > ([^.]+)\.([^,\]]+)/);
          if (refMatch) {
            references.push({
              fromColumn: column.name,
              toTable: refMatch[1],
              toColumn: refMatch[2],
            });
          }
        }
      }
      i++;
    }

    this.tables.push({ name: tableName, columns, references });
    return i + 1;
  }

  private parseColumn(line: string): ColumnDefinition | null {
    const parts = line.split(' ').filter((part) => part.trim() !== '');
    if (parts.length < 2) return null;

    const name = parts[0];
    const type = parts[1];

    const options = line.includes('[')
      ? line.substring(line.indexOf('[') + 1, line.indexOf(']'))
      : '';
    const note = line.includes('note:')
      ? line
          .substring(line.indexOf('note:') + 5, line.lastIndexOf(']'))
          .replace(/['"]/g, '')
          .trim()
      : undefined;

    return {
      name,
      type,
      isPrimaryKey: options.includes('pk'),
      isAutoIncrement: options.includes('increment'),
      isNotNull: options.includes('not null'),
      isUnique: options.includes('unique'),
      defaultValue: this.extractDefaultValue(options),
      note,
    };
  }

  private extractDefaultValue(options: string): string | undefined {
    const defaultMatch = options.match(/default: ['"]?([^,\]'"]+)['"]?/);
    return defaultMatch ? defaultMatch[1] : undefined;
  }

  private generateEnumsFile(): void {
    let content = '// Auto-generated enums from DBML schema\n\n';

    for (const enumDef of this.enums) {
      content += `export enum ${enumDef.name} {\n`;
      for (const value of enumDef.values) {
        content += `  ${value} = '${value}',\n`;
      }
      content += '}\n\n';
    }

    const enumsDir = 'src/types';
    if (!fs.existsSync(enumsDir)) {
      fs.mkdirSync(enumsDir, { recursive: true });
    }

    fs.writeFileSync(path.join(enumsDir, 'enums.ts'), content);
    console.log('✅ Generated src/types/enums.ts');
  }

  private generateModelFiles(): void {
    for (const table of this.tables) {
      this.generateModelFile(table);
    }
  }

  private generateModelFile(table: TableDefinition): void {
    const modelName = this.toModelName(table.name);
    const content = this.generateModelContent(table, modelName);

    const modelDir = `src/${table.name}`;
    if (!fs.existsSync(modelDir)) {
      fs.mkdirSync(modelDir, { recursive: true });
    }

    const fileName = `${this.toSingular(table.name)}.model.ts`;
    fs.writeFileSync(path.join(modelDir, fileName), content);
    console.log(`✅ Generated ${modelDir}/${fileName}`);
  }

  private generateModelContent(table: TableDefinition, modelName: string): string {
    const imports = this.generateImports(table);
    const interfaceCode = this.generateInterface(table, modelName);
    const typesCode = this.generateTypes(table, modelName);
    const classCode = this.generateClass(table, modelName);

    return `${imports}\n${interfaceCode}\n${typesCode}\n${classCode}`;
  }

  private generateImports(table: TableDefinition): string {
    const decorators = ['Column', 'DataType', 'Model', 'Table'];
    const enumTypes = new Set<string>();
    const relationModels = new Set<string>();

    // Check for enum types
    for (const column of table.columns) {
      const enumDef = this.enums.find((e) => e.name === column.type);
      if (enumDef) {
        enumTypes.add(column.type);
      }
    }

    // Check for relations
    const hasReferences = table.references.length > 0;
    const isReferenced = this.tables.some((t) =>
      t.references.some((ref) => ref.toTable === table.name),
    );

    if (hasReferences) {
      decorators.push('BelongsTo');
      // Add referenced models
      for (const ref of table.references) {
        relationModels.add(this.toModelName(ref.toTable));
      }
    }

    if (isReferenced) {
      decorators.push('HasMany');
      // Add referencing models
      for (const otherTable of this.tables) {
        for (const ref of otherTable.references) {
          if (ref.toTable === table.name) {
            relationModels.add(this.toModelName(otherTable.name));
          }
        }
      }
    }

    // Check for indexes
    const hasIndexes = table.columns.some((col) => col.name === 'displayName'); // Based on user.model.ts pattern
    if (hasIndexes) {
      decorators.push('Index');
    }

    let imports = "import { Optional } from 'sequelize';\n";
    imports += `import {\n  ${decorators.join(',\n  ')}\n} from 'sequelize-typescript';\n`;

    // Add enum imports
    if (enumTypes.size > 0) {
      imports += `import { ${Array.from(enumTypes).join(', ')} } from 'src/types/enums';\n`;
    }

    // Add relation model imports
    for (const modelName of relationModels) {
      const tableName = this.toTableName(modelName);
      const fileName = this.toSingular(tableName);
      imports += `import { ${modelName} } from 'src/${tableName}/${fileName}.model';\n`;
    }

    return imports;
  }

  private generateInterface(table: TableDefinition, modelName: string): string {
    let content = `export interface ${modelName}Attributes {\n`;

    for (const column of table.columns) {
      const tsType = this.mapToTypeScript(column.type);
      const optional = column.isAutoIncrement || !column.isNotNull ? '?' : '';
      content += `  ${column.name}${optional}: ${tsType};\n`;
    }

    content += '}\n';
    return content;
  }

  private generateTypes(table: TableDefinition, modelName: string): string {
    const primaryKey = table.columns.find((col) => col.isPrimaryKey)?.name || 'id';
    const optionalColumns = table.columns
      .filter((col) => col.isAutoIncrement || !col.isNotNull || col.defaultValue)
      .map((col) => `'${col.name}'`)
      .join(' | ');

    let content = `export type ${modelName}Pk = '${primaryKey}';\n`;
    content += `export type ${modelName}Id = ${modelName}[${modelName}Pk];\n`;

    if (optionalColumns) {
      content += `export type ${modelName}OptionalAttributes = ${optionalColumns};\n`;
      content += `export type ${modelName}CreationAttributes = Optional<${modelName}Attributes, ${modelName}OptionalAttributes>;\n`;
    } else {
      content += `export type ${modelName}CreationAttributes = ${modelName}Attributes;\n`;
    }

    return content;
  }

  private generateClass(table: TableDefinition, modelName: string): string {
    let content = `@Table({ tableName: '${table.name}' })\n`;
    content += `export class ${modelName} extends Model implements ${modelName}Attributes {\n`;

    // Generate columns
    for (const column of table.columns) {
      content += this.generateColumnCode(column);
    }

    // Generate relations
    content += this.generateRelations(table);

    content += '}\n';
    return content;
  }

  private generateColumnCode(column: ColumnDefinition): string {
    let code = '';

    // Add index decorator if needed (based on pattern from user.model.ts)
    if (column.name === 'displayName') {
      code += '  @Index\n';
    }

    // Column decorator
    code += '  @Column({\n';

    const enumDef = this.enums.find((e) => e.name === column.type);
    if (enumDef) {
      code += `    type: DataType.ENUM(...Object.values(${column.type})),\n`;
    } else {
      code += `    type: DataType.${this.mapToSequelize(column.type)},\n`;
    }

    if (column.isPrimaryKey) {
      code += '    primaryKey: true,\n';
    }

    if (column.isAutoIncrement) {
      code += '    autoIncrement: true,\n';
    }

    // AutoIncrement fields should not allow null
    const allowNull = column.isAutoIncrement ? false : !column.isNotNull;
    code += `    allowNull: ${allowNull},\n`;

    if (column.defaultValue && enumDef) {
      code += `    defaultValue: ${column.type}.${column.defaultValue},\n`;
    }

    if (column.note) {
      code += `    comment: '${column.note}',\n`;
    }

    code += '  })\n';

    // Property declaration
    const tsType = this.mapToTypeScript(column.type);
    const optional = column.isAutoIncrement || !column.isNotNull ? '?' : '';
    // Only use declare for autoincrement fields
    const declare = column.isAutoIncrement ? 'declare ' : 'declare ';

    code += `  ${declare}${column.name}${optional}: ${tsType};\n\n`;

    return code;
  }

  private generateRelations(table: TableDefinition): string {
    let code = '';

    // BelongsTo relations
    for (const ref of table.references) {
      const targetModel = this.toModelName(ref.toTable);
      const propertyName = this.toSingular(ref.toTable);

      code += `  @BelongsTo(() => ${targetModel}, '${ref.fromColumn}')\n`;
      code += `  declare ${propertyName}: ${targetModel};\n\n`;
    }

    // HasMany relations
    for (const otherTable of this.tables) {
      for (const ref of otherTable.references) {
        if (ref.toTable === table.name) {
          const targetModel = this.toModelName(otherTable.name);
          code += `  @HasMany(() => ${targetModel}, '${ref.fromColumn}')\n`;
          code += `  declare ${otherTable.name}: ${targetModel}[];\n\n`;
        }
      }
    }

    return code;
  }

  private mapToSequelize(type: string): string {
    const typeMap: { [key: string]: string } = {
      int: 'INTEGER',
      integer: 'INTEGER',
      varchar: 'STRING',
      text: 'TEXT',
      boolean: 'BOOLEAN',
      json: 'JSON',
      float: 'FLOAT',
      double: 'DOUBLE',
      date: 'DATE',
      datetime: 'DATE',
      timestamp: 'DATE',
    };

    return typeMap[type.toLowerCase()] || 'STRING';
  }

  private mapToTypeScript(type: string): string {
    // Check if it's an enum
    const enumDef = this.enums.find((e) => e.name === type);
    if (enumDef) {
      return type;
    }

    const typeMap: { [key: string]: string } = {
      int: 'number',
      integer: 'number',
      varchar: 'string',
      text: 'string',
      boolean: 'boolean',
      json: 'object',
      float: 'number',
      double: 'number',
      date: 'Date',
      datetime: 'Date',
      timestamp: 'Date',
    };

    return typeMap[type.toLowerCase()] || 'string';
  }

  private toModelName(tableName: string): string {
    return this.toSingular(tableName)
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  private toTableName(modelName: string): string {
    const snakeCase = modelName
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .slice(1);

    if (snakeCase.endsWith('y')) {
      return snakeCase.slice(0, -1) + 'ies';
    }
    return snakeCase + 's';
  }

  private toSingular(word: string): string {
    if (word.endsWith('ies')) {
      return word.slice(0, -3) + 'y';
    }
    if (word.endsWith('s')) {
      return word.slice(0, -1);
    }
    return word;
  }
}

// Main function
export function generateFromDbml(dbmlPath: string = 'src/database/diagram.dbml'): void {
  console.log('🚀 Starting DBML to NestJS Sequelize generation...');

  try {
    const generator = new DbmlToNestJSSequelizeGenerator(dbmlPath);
    generator.generate();
    console.log('🎉 Generation completed successfully!');
  } catch (error) {
    console.error('❌ Error generating models:', error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  generateFromDbml();
}
