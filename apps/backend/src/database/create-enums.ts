import { ESLint } from 'eslint';
import { writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

export async function createEnums(enums: Map<string, string[]>) {
  try {
    let content = '';

    for (const [enumName, values] of enums.entries()) {
      const enumContent = `export enum ${enumName} {\n  ${values.map((v) => `${v} = '${v}'`).join(',\n  ')}\n} \n`;
      content = content + enumContent;
    }

    const enumsDir = resolve('src/utils');
    const filePath = join(enumsDir, `enums.ts`);
    writeFileSync(filePath, content);

    console.log('✅ Enums created successfully');
  } catch (error) {
    console.error('❌ Error creating enums:', (error as Error).message);
    throw error;
  }

  try {
    const eslint = new ESLint({ fix: true });
    const result = await eslint.lintFiles(['src/utils/enums.ts']);
    await ESLint.outputFixes(result);
  } catch (error) {
    console.log('❌ Error running ESLint:', (error as Error).message);
    throw error;
  }
}
