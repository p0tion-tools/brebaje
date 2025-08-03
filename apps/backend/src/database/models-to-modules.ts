import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

export function modelsToModules() {
  try {
    const sourceDir = resolve('src/database/models');
    const modulesDir = resolve('src/modules');

    // Read all model files
    const modelFiles = readdirSync(sourceDir).filter(
      (file) => file.endsWith('.ts') && !file.includes('init-models'),
    );

    for (const file of modelFiles) {
      // Determine which module this model belongs to
      const modelName = file.replace('.ts', '');
      const moduleName = modelName.toLowerCase();

      // Create destination directory
      const destDir = join(modulesDir, moduleName, 'entities');
      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true });
      }

      // Read model content and update imports if needed
      const sourceFile = join(sourceDir, file);
      const content = readFileSync(sourceFile, 'utf8');

      // Write to new location
      const destFile = join(destDir, file);
      writeFileSync(destFile, content);
    }

    console.log('✅ Models relocated successfully');
  } catch (error) {
    console.error('❌ Error relocating models:', (error as Error).message);
    throw error;
  }
}
