#!/usr/bin/env ts-node

import * as fs from 'fs';

interface TableDefinition {
  name: string;
  columns: ColumnDefinition[];
  indexes: IndexDefinition[];
  foreignKeys: ForeignKeyDefinition[];
}

interface ColumnDefinition {
  name: string;
  type: string;
  constraints: string[];
  comment?: string;
}

interface IndexDefinition {
  name: string;
  columns: string[];
  unique: boolean;
}

interface ForeignKeyDefinition {
  columns: string[];
  references: {
    table: string;
    columns: string[];
  };
  onDelete?: string;
  onUpdate?: string;
}

export default class DbmlToSQL {
  private tables: Map<string, TableDefinition> = new Map();
  private enums: Map<string, string[]> = new Map();

  /**
   * Parse dbdiagram.io syntax and convert to SQL DDL
   */
  parse(dbDiagramCode: string): string {
    this.tables.clear();
    this.enums.clear();

    const lines = dbDiagramCode.split('\n').map((line) => line.trim());
    let currentTable: TableDefinition | null = null;
    let currentEnum: string | null = null;

    for (const line of lines) {
      if (line.startsWith('//') || line === '') continue; // Skip comments and empty lines

      // Parse enum definitions
      if (line.startsWith('Enum')) {
        const enumMatch = line.match(/Enum\s+(\w+)\s*{/);
        if (enumMatch) {
          currentEnum = enumMatch[1];
          this.enums.set(currentEnum, []);
        }
        continue;
      }

      if (currentEnum && line.includes('}')) {
        currentEnum = null;
        continue;
      }

      if (currentEnum && line.includes("'")) {
        const enumValue = line.match(/'([^']+)'/)?.[1];
        if (enumValue) {
          this.enums.get(currentEnum)!.push(enumValue);
        }
        continue;
      }

      // Parse table definitions
      if (line.includes('Table')) {
        const tableMatch = line.match(/Table\s+(\w+)\s*{/);
        if (tableMatch) {
          currentTable = {
            name: tableMatch[1],
            columns: [],
            indexes: [],
            foreignKeys: [],
          };
          this.tables.set(currentTable.name, currentTable);
        }
        continue;
      }

      if (currentTable && line.includes('}')) {
        currentTable = null;
        continue;
      }

      // Parse column definitions
      if (currentTable && line.includes(' ') && !line.startsWith('}')) {
        const colResult = this.parseColumn(line);
        if (!colResult) continue;
        if ('column' in colResult) {
          currentTable.columns.push(colResult.column);
          if (colResult.foreignKey) {
            currentTable.foreignKeys.push(colResult.foreignKey);
          }
        } else {
          currentTable.columns.push(colResult);
        }
        continue;
      }

      // Parse indexes
      if (line.includes('indexes')) {
        // Handle indexes section
        continue;
      }
    }

    return this.generateSQL();
  }

  private parseColumn(
    line: string,
  ): ColumnDefinition | null | { column: ColumnDefinition; foreignKey?: ForeignKeyDefinition } {
    // Remove comments
    const commentMatch = line.match(/\s*\/\/\s*(.+)$/);
    const comment = commentMatch ? commentMatch[1] : undefined;
    const cleanLine = line.replace(/\s*\/\/.*$/, '').trim();

    // Parse column definition
    const parts = cleanLine.split(/\s+/);
    if (parts.length < 2) return null;

    const name = parts[0];
    const type = parts[1];
    const constraints: string[] = [];
    let foreignKey: ForeignKeyDefinition | undefined = undefined;

    // Parse constraints from bracket notation [pk, increment, not null, etc.]
    const bracketMatch = cleanLine.match(/\[(.*?)\]/);
    if (bracketMatch) {
      const constraintStr = bracketMatch[1];
      const constraintParts = constraintStr.split(',').map((s) => s.trim());

      for (const part of constraintParts) {
        if (part === 'pk') constraints.push('PRIMARY KEY');
        else if (part === 'increment') constraints.push('AUTOINCREMENT');
        else if (part === 'unique') constraints.push('UNIQUE');
        else if (part === 'not null') constraints.push('NOT NULL');
        else if (part === 'null') constraints.push('NULL');
        else if (part.startsWith('default')) {
          const defaultValue = part.replace('default:', '').trim();
          constraints.push(`DEFAULT ${defaultValue}`);
        } else if (part.startsWith('ref')) {
          // Foreign key reference: ref: > projects.id
          const refMatch = part.match(/ref:\s*>\s*(\w+)\.(\w+)/);
          if (refMatch) {
            const refTable = refMatch[1];
            const refColumn = refMatch[2];
            foreignKey = {
              columns: [name],
              references: {
                table: refTable,
                columns: [refColumn],
              },
            };
          }
        }
      }
    }

    const column: ColumnDefinition = {
      name,
      type: this.normalizeType(type),
      constraints,
      comment,
    };
    if (foreignKey) {
      return { column, foreignKey };
    }
    return column;
  }

  private normalizeType(type: string): string {
    // Normalize dbdiagram types to standard SQL types
    const typeMap: Record<string, string> = {
      int: 'INTEGER',
      integer: 'INTEGER',
      bigint: 'BIGINT',
      smallint: 'SMALLINT',
      tinyint: 'TINYINT',
      varchar: 'VARCHAR',
      char: 'CHAR',
      text: 'TEXT',
      longtext: 'LONGTEXT',
      mediumtext: 'MEDIUMTEXT',
      tinytext: 'TINYTEXT',
      boolean: 'BOOLEAN',
      bool: 'BOOLEAN',
      bit: 'BIT',
      decimal: 'DECIMAL',
      numeric: 'NUMERIC',
      float: 'FLOAT',
      double: 'DOUBLE',
      real: 'REAL',
      date: 'DATE',
      datetime: 'DATETIME',
      timestamp: 'TIMESTAMP',
      time: 'TIME',
      year: 'YEAR',
      json: 'JSON',
      blob: 'BLOB',
      longblob: 'LONGBLOB',
      mediumblob: 'MEDIUMBLOB',
      tinyblob: 'TINYBLOB',
      binary: 'BINARY',
      varbinary: 'VARBINARY',
    };

    // Handle types with size specifications like varchar(255)
    const baseType = type.replace(/\([^)]*\)/, '');
    const normalizedBaseType = typeMap[baseType.toLowerCase()] || baseType;

    // Preserve size specifications
    const sizeMatch = type.match(/\(([^)]+)\)/);
    if (sizeMatch) {
      return `${normalizedBaseType}(${sizeMatch[1]})`;
    }

    return normalizedBaseType;
  }

  private generateSQL(): string {
    let sql = '';

    // Drop tables if they exist (in reverse order to handle foreign key dependencies)
    const tableNames = Array.from(this.tables.keys());
    for (const tableName of tableNames.reverse()) {
      sql += `DROP TABLE IF EXISTS "${tableName}";\n`;
    }
    sql += '\n';

    // Generate table definitions
    for (const table of this.tables.values()) {
      sql += `CREATE TABLE "${table.name}" (\n`;

      const columnDefs = table.columns.map((col) => {
        let def = `  "${col.name}" ${col.type}`;

        // Check if this column type is an enum
        const enumValues = this.enums.get(col.type);
        if (enumValues && enumValues.length > 0) {
          // Replace enum type with TEXT and add CHECK constraint
          def = `  "${col.name}" TEXT CHECK("${col.name}" IN ('${enumValues.join("', '")}'))`;
        }

        if (col.constraints.length > 0) {
          def += ` ${col.constraints.join(' ')}`;
        }
        if (col.comment) {
          def += ` -- ${col.comment}`;
        }
        return def;
      });

      // Add foreign key constraints inline
      const foreignKeyDefs = table.foreignKeys.map((fk) => {
        let fkDef = `  FOREIGN KEY ("${fk.columns.join('", "')}") `;
        fkDef += `REFERENCES "${fk.references.table}" ("${fk.references.columns.join('", "')}")`;

        if (fk.onDelete) {
          fkDef += ` ON DELETE ${fk.onDelete.toUpperCase()}`;
        }
        if (fk.onUpdate) {
          fkDef += ` ON UPDATE ${fk.onUpdate.toUpperCase()}`;
        }
        return fkDef;
      });

      // Combine column definitions and foreign key definitions
      const allDefs = [...columnDefs, ...foreignKeyDefs];
      sql += allDefs.join(',\n');
      sql += '\n);\n\n';

      // Add comments (SQLite doesn't support COMMENT ON COLUMN)
      // Comments are already included inline above
    }

    return sql.trim();
  }
}

export function convertDbmlToSql(dbInputFilePath: string, dbOutputFilePath?: string): string {
  if (process.env.NODE_ENV !== 'production') {
    try {
      const dbDiagramCode = fs.readFileSync(dbInputFilePath, 'utf8');
      const converter = new DbmlToSQL();
      const sql = converter.parse(dbDiagramCode);

      const outputFile = dbOutputFilePath || dbInputFilePath.replace(/\.(dbml|dbdiagram)$/, '.sql');
      fs.writeFileSync(outputFile, sql);

      return sql;
    } catch (error) {
      console.error('❌ Error:', (error as Error).message);
      throw error;
    }
  } else {
    // TODO: update existing database schema without deleting data
    return '';
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: pnpm convert <input-file> [output-file]');
    console.log('Example: pnpm convert diagram.dbml');
    process.exit(1);
  }

  const inputFile = args[0];
  const outputFile = args[1];

  try {
    convertDbmlToSql(inputFile, outputFile);
  } catch {
    process.exit(1);
  }
}
