import { createModels } from './create-models';
import { convertDbmlToSql } from './dbml-to-sql';
import { modelsToModules } from './models-to-modules';

export async function setUpDatabase() {
  const sql = convertDbmlToSql('src/database/diagram.dbml');

  await createModels(sql);

  modelsToModules();
}

void setUpDatabase();
