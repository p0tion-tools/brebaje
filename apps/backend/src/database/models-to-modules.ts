import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

export function modelsToModules() {
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
      let moduleName: string;

      if (modelName.endsWith('y')) {
        // If the model name ends with 'y', convert it to plural form
        moduleName = modelName.toLowerCase().slice(0, -1) + 'ie';
      } else {
        moduleName = modelName.toLowerCase() + 's';
      }

      // Create destination directory
      const destDir = join(modulesDir, moduleName, 'entities');
      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true });
      }

      // Read model content and update imports if needed
      const sourceFile = join(sourceDir, file);
      const content = readFileSync(sourceFile, 'utf8');

      // Write to new location
      const destFile = join(destDir, modelName + 'entity.ts');
      writeFileSync(destFile, content);
    }

    rmSync(sourceDir, { recursive: true });

    console.log('✅ Models relocated successfully');
  } catch (error) {
    console.error('❌ Error relocating models:', (error as Error).message);
    throw error;
  }
}
