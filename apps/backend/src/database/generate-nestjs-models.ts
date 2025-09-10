#!/usr/bin/env ts-node

import { convertDbmlToSql } from './dbml-to-sql';
import { createModels } from './create-models';
import { NestJSModelGenerator } from './nestjs-model-generator';

/**
 * Main script to generate NestJS models from DBML schema
 *
 * This script:
 * 1. Converts DBML to SQL and extracts schema information
 * 2. Sets up the database with the generated SQL
 * 3. Generates NestJS models with proper decorators and relations
 */
export async function generateNestJSModels(): Promise<void> {
  try {
    console.log('🚀 Starting NestJS model generation from DBML...');

    // Step 1: Convert DBML to SQL and extract schema info
    console.log('📖 Converting DBML to SQL...');
    const result = convertDbmlToSql('src/database/diagram.dbml');
    console.log(
      `✅ Converted DBML schema with ${result.tables.size} tables and ${result.enums.size} enums`,
    );

    // Step 2: Setup database with the SQL
    console.log('🗄️  Setting up database...');
    await createModels(result.sql);
    console.log('✅ Database setup completed');

    // Step 3: Generate NestJS models
    console.log('🏗️  Generating NestJS models...');
    const generator = new NestJSModelGenerator(result.enums, result.tables);
    generator.generateAllModels();
    console.log('✅ NestJS models generated successfully');

    console.log('🎉 Model generation completed! Files created:');
    console.log('   - src/types/enums.ts');

    for (const tableName of result.tables.keys()) {
      const singularName = tableName.endsWith('s') ? tableName.slice(0, -1) : tableName;
      console.log(`   - src/${tableName}/${singularName}.model.ts`);
    }
  } catch (error) {
    console.error('❌ Error generating models:', error);
    throw error;
  }
}

// Run the script if executed directly
if (require.main === module) {
  void generateNestJSModels();
}
