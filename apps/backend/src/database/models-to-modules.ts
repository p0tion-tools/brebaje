import { ESLint } from 'eslint';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pluralize } from './utils';

export async function modelsToModules() {
  try {
    const sourceDir = resolve('src/database/models');
    const modulesDir = resolve('src');

    // Read all model files
    const modelFiles = readdirSync(sourceDir).filter(
      (file) => file.endsWith('.ts') && !file.includes('init-models'),
    );

    for (const file of modelFiles) {
      // Determine which module this model belongs to
      const modelName = file.replace('.ts', '');
      const moduleName = pluralize(modelName);

      // Create destination directory
      const destDir = join(modulesDir, moduleName);
      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true });
      }

      // Read model content and update imports if needed
      const sourceFile = join(sourceDir, file);

      let content = readFileSync(sourceFile, 'utf8');
      content = content.replace(
        /import\s+(type\s+)?\{\s*([^}]+)\s*\}\s+from\s+['"]\.\/([^'"]+)['"];?/g,
        (_match, typeKeyword, existingImports: string, oldModule: string) => {
          const newModule = `src/${pluralize(oldModule)}/${oldModule}.entity`;

          return `import ${typeKeyword || ''}{ ${existingImports.trim()} } from '${newModule}';`;
        },
      );

      // Write to new location
      const destFile = join(destDir, modelName + '.entity.ts');
      writeFileSync(destFile, content);
    }

    rmSync(sourceDir, { recursive: true });

    console.log('✅ Models relocated successfully');
  } catch (error) {
    console.error('❌ Error relocating models:', (error as Error).message);
    throw error;
  }

  try {
    const eslint = new ESLint({ fix: true });
    const result = await eslint.lintFiles(['src/**/*.entity.ts']);
    await ESLint.outputFixes(result);
  } catch (error) {
    console.log('❌ Error running ESLint:', (error as Error).message);
    throw error;
  }
}
