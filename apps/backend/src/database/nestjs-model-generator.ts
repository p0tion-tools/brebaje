import * as fs from 'node:fs';
import * as path from 'node:path';
import { TableDefinition } from './dbml-to-sql';

interface ColumnMapping {
  name: string;
  type: string;
  nullable: boolean;
  primary: boolean;
  autoIncrement: boolean;
  unique: boolean;
  defaultValue?: string;
  enumType?: string;
}

interface RelationMapping {
  type: 'hasMany' | 'belongsTo';
  property: string;
  targetModel: string;
  foreignKey?: string;
}

export class NestJSModelGenerator {
  private enums: Map<string, string[]>;
  private tables: Map<string, TableDefinition>;

  constructor(enums: Map<string, string[]>, tables: Map<string, TableDefinition>) {
    this.enums = enums;
    this.tables = tables;
  }

  generateAllModels(): void {
    this.generateEnumsFile();

    for (const [tableName, tableDefinition] of this.tables) {
      this.generateModelFile(tableName, tableDefinition);
    }
  }

  private generateEnumsFile(): void {
    let content = '// Auto-generated enums from DBML schema\n\n';

    for (const [enumName, enumValues] of this.enums) {
      content += `export enum ${enumName} {\n`;
      for (const value of enumValues) {
        content += `  ${value} = '${value}',\n`;
      }
      content += '}\n\n';
    }

    const enumsDir = 'src/types';
    const enumsPath = path.join(enumsDir, 'enums.ts');

    if (!fs.existsSync(enumsDir)) {
      fs.mkdirSync(enumsDir, { recursive: true });
    }

    fs.writeFileSync(enumsPath, content);
  }

  private generateModelFile(tableName: string, tableDefinition: TableDefinition): void {
    const modelName = this.toModelName(tableName);
    const content = this.generateModelContent(modelName, tableName, tableDefinition);

    const modelDir = `src/${tableName}`;
    const modelPath = path.join(modelDir, `${this.toSingular(tableName)}.model.ts`);

    if (!fs.existsSync(modelDir)) {
      fs.mkdirSync(modelDir, { recursive: true });
    }

    fs.writeFileSync(modelPath, content);
  }

  private generateModelContent(
    modelName: string,
    tableName: string,
    tableDefinition: TableDefinition,
  ): string {
    const columns = this.mapColumns(tableDefinition.columns);
    const relations = this.mapRelations(tableName, tableDefinition);

    // Determine which imports we need
    const imports = this.generateImports(columns, relations);
    const enumImports = this.generateEnumImports(columns);

    let content = imports;
    if (enumImports) {
      content += enumImports;
    }

    // Add relation model imports
    const relationImports = this.generateRelationImports(relations);
    if (relationImports) {
      content += relationImports;
    }

    content += '\n';

    // Generate interface
    content += this.generateInterface(modelName, columns);
    content += '\n';

    // Generate type exports
    content += this.generateTypeExports(modelName, columns);
    content += '\n';

    // Generate class
    content += this.generateClass(modelName, tableName, columns, relations);

    return content;
  }

  private generateImports(columns: ColumnMapping[], relations: RelationMapping[]): string {
    let imports = "import { Optional } from 'sequelize';\n";

    const decorators = ['Column', 'DataType', 'Model', 'Table'];

    if (relations.some((r) => r.type === 'belongsTo')) {
      decorators.push('BelongsTo', 'ForeignKey');
    }
    if (relations.some((r) => r.type === 'hasMany')) {
      decorators.push('HasMany');
    }

    imports += `import {\n`;
    for (let i = 0; i < decorators.length; i++) {
      imports += `  ${decorators[i]}${i === decorators.length - 1 ? '' : ','}\n`;
    }
    imports += `} from 'sequelize-typescript';\n`;

    return imports;
  }

  private generateEnumImports(columns: ColumnMapping[]): string {
    const usedEnums = columns
      .filter((col) => col.enumType)
      .map((col) => col.enumType!)
      .filter((value, index, self) => self.indexOf(value) === index);

    if (usedEnums.length === 0) return '';

    return `import { ${usedEnums.join(', ')} } from 'src/types/enums';\n`;
  }

  private generateRelationImports(relations: RelationMapping[]): string {
    const modelImports: string[] = [];

    for (const relation of relations) {
      const modelName = relation.targetModel;
      const tableName = this.toTableName(modelName);
      const fileName = this.toSingular(tableName);
      const importPath = `src/${tableName}/${fileName}.model`;

      if (!modelImports.find((imp) => imp.includes(modelName))) {
        modelImports.push(`import { ${modelName} } from '${importPath}';`);
      }
    }

    return modelImports.length > 0 ? modelImports.join('\n') + '\n' : '';
  }

  private generateInterface(modelName: string, columns: ColumnMapping[]): string {
    let content = `export interface ${modelName}Attributes {\n`;

    for (const col of columns) {
      const tsType = this.mapTypeToTypeScript(col.type, col.enumType);
      const optional = col.nullable || col.autoIncrement ? '?' : '';
      content += `  ${col.name}${optional}: ${tsType};\n`;
    }

    content += '}\n';
    return content;
  }

  private generateTypeExports(modelName: string, columns: ColumnMapping[]): string {
    const primaryKey = columns.find((col) => col.primary)?.name || 'id';
    const optionalColumns = columns
      .filter((col) => col.nullable || col.autoIncrement || col.defaultValue)
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

  private generateClass(
    modelName: string,
    tableName: string,
    columns: ColumnMapping[],
    relations: RelationMapping[],
  ): string {
    let content = `@Table({ tableName: '${tableName}' })\n`;
    content += `export class ${modelName} extends Model implements ${modelName}Attributes {\n`;

    // Generate column properties
    for (const col of columns) {
      content += this.generateColumnDecorator(col);
      content += this.generateColumnProperty(col);
    }

    // Generate relations
    for (const relation of relations) {
      content += '\n';
      content += this.generateRelationDecorator(relation);
      content += this.generateRelationProperty(relation);
    }

    content += '}\n';
    return content;
  }

  private generateColumnDecorator(col: ColumnMapping): string {
    let decorator = '  @Column({\n';

    if (col.enumType) {
      decorator += `    type: DataType.ENUM(...Object.values(${col.enumType})),\n`;
    } else {
      decorator += `    type: DataType.${this.mapTypeToSequelize(col.type)},\n`;
    }

    if (col.primary) {
      decorator += '    primaryKey: true,\n';
    }

    if (col.autoIncrement) {
      decorator += '    autoIncrement: true,\n';
    }

    decorator += `    allowNull: ${col.nullable},\n`;

    if (col.unique && !col.primary) {
      decorator += '    unique: true,\n';
    }

    if (col.defaultValue && col.enumType) {
      decorator += `    defaultValue: ${col.enumType}.${col.defaultValue},\n`;
    }

    decorator += '  })\n';
    return decorator;
  }

  private generateColumnProperty(col: ColumnMapping): string {
    const tsType = this.mapTypeToTypeScript(col.type, col.enumType);
    const optional = col.nullable || col.autoIncrement ? '?' : '';
    const declare = col.autoIncrement ? 'declare ' : '';

    return `  ${declare}${col.name}${optional}: ${tsType};\n\n`;
  }

  private generateRelationDecorator(rel: RelationMapping): string {
    if (rel.type === 'hasMany') {
      return `  @HasMany(() => ${rel.targetModel}, '${rel.foreignKey}')\n`;
    } else if (rel.type === 'belongsTo') {
      let decorator = `  @ForeignKey(() => ${rel.targetModel})\n`;
      decorator += `  @BelongsTo(() => ${rel.targetModel})\n`;
      return decorator;
    }
    return '';
  }

  private generateRelationProperty(rel: RelationMapping): string {
    if (rel.type === 'hasMany') {
      return `  ${rel.property}: ${rel.targetModel}[];\n`;
    } else if (rel.type === 'belongsTo') {
      return `  ${rel.property}: ${rel.targetModel};\n`;
    }
    return '';
  }

  private mapColumns(
    columns: Array<{
      name: string;
      type: string;
      constraints?: string[];
    }>,
  ): ColumnMapping[] {
    return columns.map((col) => {
      const constraints = col.constraints || [];
      const enumType = this.enums.has(col.type) ? col.type : undefined;

      return {
        name: col.name,
        type: col.type,
        nullable: !constraints.includes('NOT NULL'),
        primary: constraints.includes('PRIMARY KEY'),
        autoIncrement: constraints.includes('AUTOINCREMENT'),
        unique: constraints.includes('UNIQUE'),
        defaultValue: this.extractDefaultValue(constraints),
        enumType,
      };
    });
  }

  private mapRelations(tableName: string, table: TableDefinition): RelationMapping[] {
    const relations: RelationMapping[] = [];

    // BelongsTo relations (foreign keys in this table)
    for (const fk of table.foreignKeys) {
      const targetTable = fk.references.table;
      const targetModel = this.toModelName(targetTable);
      const propertyName = this.toSingular(targetTable);

      relations.push({
        type: 'belongsTo',
        property: propertyName,
        targetModel,
      });
    }

    // HasMany relations (this table is referenced by others)
    for (const [otherTableName, otherTable] of this.tables) {
      if (otherTableName === tableName) continue;

      for (const fk of otherTable.foreignKeys) {
        if (fk.references.table === tableName) {
          const otherModel = this.toModelName(otherTableName);
          const propertyName = otherTableName; // hasMany uses plural
          const foreignKey = fk.columns[0];

          relations.push({
            type: 'hasMany',
            property: propertyName,
            targetModel: otherModel,
            foreignKey,
          });
        }
      }
    }

    return relations;
  }

  private extractDefaultValue(constraints: string[]): string | undefined {
    for (const constraint of constraints) {
      if (constraint.startsWith('DEFAULT ')) {
        return constraint.replace('DEFAULT ', '');
      }
    }
    return undefined;
  }

  private mapTypeToSequelize(type: string): string {
    const typeMap: { [key: string]: string } = {
      int: 'INTEGER',
      integer: 'INTEGER',
      varchar: 'STRING',
      text: 'TEXT',
      boolean: 'BOOLEAN',
      float: 'FLOAT',
      double: 'DOUBLE',
      decimal: 'DECIMAL',
      date: 'DATE',
      datetime: 'DATE',
      timestamp: 'DATE',
      json: 'JSON',
    };

    return typeMap[type.toLowerCase()] || 'STRING';
  }

  private mapTypeToTypeScript(type: string, enumType?: string): string {
    if (enumType) {
      return enumType;
    }

    const typeMap: { [key: string]: string } = {
      int: 'number',
      integer: 'number',
      varchar: 'string',
      text: 'string',
      boolean: 'boolean',
      float: 'number',
      double: 'number',
      decimal: 'number',
      date: 'Date',
      datetime: 'Date',
      timestamp: 'Date',
      json: 'object',
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
    // Convert PascalCase to snake_case and pluralize
    const snakeCase = modelName
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .slice(1);

    // Simple pluralization
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
