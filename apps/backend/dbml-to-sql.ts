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

class DbDiagramToSQL {
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
        const column = this.parseColumn(line);
        if (column) {
          currentTable.columns.push(column);
        }
        continue;
      }

      // Parse indexes
      if (line.includes('indexes')) {
        // Handle indexes section
        continue;
      }

      /* TODO: parse foreign keys from each column
      // Parse foreign key references (separate lines)
      if (line.includes('>') && line.includes('ref') && !currentTable) {
        const fk = this.parseForeignKey(line);
        if (fk) {
          // Find the table this FK belongs to
          const tableName = line.split('.')[0].trim();
          const table = this.tables.get(tableName);
          if (table) {
            table.foreignKeys.push(fk);
          }
        }
      }
        */
    }

    return this.generateSQL();
  }

  private parseColumn(line: string): ColumnDefinition | null {
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

    // Parse constraints from bracket notation [pk, increment, not null, etc.]
    const bracketMatch = cleanLine.match(/\[(.*?)\]/);
    if (bracketMatch) {
      const constraintStr = bracketMatch[1];
      const constraintParts = constraintStr.split(',').map((s) => s.trim());

      for (const part of constraintParts) {
        if (part === 'pk') constraints.push('PRIMARY KEY');
        else if (part === 'increment') constraints.push('AUTO_INCREMENT');
        else if (part === 'unique') constraints.push('UNIQUE');
        else if (part === 'not null') constraints.push('NOT NULL');
        else if (part === 'null') constraints.push('NULL');
        else if (part.startsWith('default')) {
          const defaultValue = part.replace('default:', '').trim();
          constraints.push(`DEFAULT ${defaultValue}`);
        } else if (part.startsWith('ref')) {
          // Foreign key reference - handled separately
          continue;
        }
      }
    }

    return {
      name,
      type: this.normalizeType(type),
      constraints,
      comment,
    };
  }

  private parseForeignKey(line: string): ForeignKeyDefinition | null {
    // Parse patterns like: "column > ref table.column"
    const fkMatch = line.match(/(\w+)\s*>\s*ref\s+(\w+)\.(\w+)/);
    if (!fkMatch) return null;

    const [, column, refTable, refColumn] = fkMatch;

    // Check for onDelete/onUpdate
    const onDeleteMatch = line.match(/onDelete:\s*(\w+)/);
    const onUpdateMatch = line.match(/onUpdate:\s*(\w+)/);

    return {
      columns: [column],
      references: {
        table: refTable,
        columns: [refColumn],
      },
      onDelete: onDeleteMatch ? onDeleteMatch[1] : undefined,
      onUpdate: onUpdateMatch ? onUpdateMatch[1] : undefined,
    };
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
    const normalizedBaseType = typeMap[baseType.toLowerCase()] || baseType.toUpperCase();

    // Preserve size specifications
    const sizeMatch = type.match(/\(([^)]+)\)/);
    if (sizeMatch) {
      return `${normalizedBaseType}(${sizeMatch[1]})`;
    }

    return normalizedBaseType;
  }

  private generateSQL(): string {
    let sql = '';

    // Generate ENUM types first
    for (const [enumName, values] of this.enums) {
      sql += `CREATE TYPE "${enumName}" AS ENUM (\n`;
      sql += `  '${values.join("',\n  '")}'\n`;
      sql += `);\n\n`;
    }

    // Generate table definitions
    for (const table of this.tables.values()) {
      sql += `CREATE TABLE "${table.name}" (\n`;

      const columnDefs = table.columns.map((col) => {
        let def = `  "${col.name}" ${col.type}`;
        if (col.constraints.length > 0) {
          def += ` ${col.constraints.join(' ')}`;
        }
        if (col.comment) {
          def += ` -- ${col.comment}`;
        }
        return def;
      });

      sql += columnDefs.join(',\n');
      sql += '\n);\n\n';

      // Add comments
      for (const col of table.columns) {
        if (col.comment) {
          sql += `COMMENT ON COLUMN "${table.name}"."${col.name}" IS '${col.comment}';\n`;
        }
      }
      if (table.columns.some((col) => col.comment)) {
        sql += '\n';
      }
    }

    // Generate foreign key constraints
    for (const table of this.tables.values()) {
      for (const fk of table.foreignKeys) {
        sql += `ALTER TABLE "${table.name}" ADD FOREIGN KEY ("${fk.columns.join('", "')}") `;
        sql += `REFERENCES "${fk.references.table}" ("${fk.references.columns.join('", "')}")`;

        if (fk.onDelete) {
          sql += ` ON DELETE ${fk.onDelete.toUpperCase()}`;
        }
        if (fk.onUpdate) {
          sql += ` ON UPDATE ${fk.onUpdate.toUpperCase()}`;
        }
        sql += ';\n';
      }
    }

    return sql.trim();
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: ts-node dbdiagram-to-sql.ts <input-file> [output-file]');
    console.log('Example: ts-node dbdiagram-to-sql.ts schema.dbml schema.sql');
    process.exit(1);
  }

  const inputFile = args[0];
  const outputFile = args[1] || inputFile.replace(/\.(dbml|dbdiagram)$/, '.sql');

  try {
    const dbDiagramCode = fs.readFileSync(inputFile, 'utf8');
    const converter = new DbDiagramToSQL();
    const sql = converter.parse(dbDiagramCode);

    fs.writeFileSync(outputFile, sql);
    console.log(`✅ Successfully converted ${inputFile} to ${outputFile}`);
  } catch (error) {
    console.error('❌ Error:', (error as Error).message);
    process.exit(1);
  }
}

export { DbDiagramToSQL };
