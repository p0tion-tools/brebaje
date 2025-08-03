import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { TableDefinition } from './dbml-to-sql';
import { singularize } from './utils';

export function enumsToModels(
  enums: Map<string, string[]>,
  tables: Map<string, TableDefinition>,
): string[] {
  const sourceDir = resolve('src/database/models');

  for (const table of tables.values()) {
    for (const column of table.columns) {
      const enumValues = enums.get(column.type);
      if (enumValues) {
        const tableName = singularize(table.name);
        const columnName = column.name;
        const enumName = column.type;

        const sourceFile = join(sourceDir, tableName + '.ts');

        let content = readFileSync(sourceFile, 'utf8');

        // Step 1: Find the attributes interface section
        const interfaceMatch = content.match(/export interface .*?Attributes {[\s\S]*?}/);
        if (interfaceMatch) {
          // Update only within the interface block
          const interfaceBlock = interfaceMatch[0];
          const updatedInterfaceBlock = interfaceBlock.replace(
            new RegExp(`(\\s+${columnName}\\??: ).*?(;|\n)`, 'g'),
            `$1${enumName}$2`,
          );
          content = content.replace(interfaceBlock, updatedInterfaceBlock);
        }

        // Step 2: Fix - Directly target the class property with a more precise regex
        const classPropertyRegex = new RegExp(
          `(export class [\\s\\S]+?{[\\s\\S]*?\\s+${columnName}\\??!?: )([^;\\n]*)(;|\\n)`,
          'g',
        );
        content = content.replace(classPropertyRegex, `$1${enumName}$3`);

        // Step 3: Add comment to DataTypes but don't change the type
        const dataTypesRegex = new RegExp(
          `(${columnName}: \\{[\\s\\S]*?type: )DataTypes\\.TEXT([\\s\\S]*?)\\},`,
          'g',
        );
        content = content.replace(dataTypesRegex, `$1DataTypes.TEXT /* Enum: ${enumName} */$2},`);

        // Step 4: Add enum definition at the top of the file
        const importSection = content.match(/import.*?;(\s*\n)+/s);
        if (importSection) {
          const enumDefinition = `
          export enum ${enumName} {
            ${enumValues.map((value) => `${value.toUpperCase()} = '${value}'`).join(',\n  ')}
          }`;
          content = content.replace(importSection[0], importSection[0] + enumDefinition);
        }

        writeFileSync(sourceFile, content);
      }
    }
  }

  console.log('✅ Enum types added to models successfully');
  return [];
}
