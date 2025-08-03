import { createEnums } from './create-enums';
import { createModels } from './create-models';
import { convertDbmlToSql } from './dbml-to-sql';
import { modelsToModules } from './models-to-modules';

export async function setUpDatabase() {
  const [sql, enums] = convertDbmlToSql('src/database/diagram.dbml');

  await createModels(sql);

  modelsToModules();

  await createEnums(enums);
}

void setUpDatabase();
