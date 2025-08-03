import { createModels } from './create-models';
import { convertDbmlToSql } from './dbml-to-sql';
import { enumsToModels } from './enums-to-models';
import { modelsToModules } from './models-to-modules';

export async function setUpDatabase() {
  const { sql, enums, tables } = convertDbmlToSql('src/database/diagram.dbml');

  await createModels(sql);

  enumsToModels(enums, tables);

  await modelsToModules();
}

void setUpDatabase();
