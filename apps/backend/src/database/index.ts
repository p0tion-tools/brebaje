import { ESLint } from 'eslint';
import { Sequelize } from 'sequelize';
import { convertDbmlToSql } from './dbml-to-sql';
import SequelizeAuto from 'sequelize-auto';
import { DB_SQLITE_STORAGE_PATH } from '../utils/constants';

export async function setUpDatabase() {
  const sql = convertDbmlToSql('src/database/diagram.dbml');

  console.log(sql);

  // load the DBML file, convert it to SQL and load it into the database
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: DB_SQLITE_STORAGE_PATH,
    logging: false,
  });

  try {
    await sequelize.authenticate();
    await sequelize.query(sql);

    console.log('✅ Database setup complete. DBML loaded succesully.');
  } catch (error) {
    console.log('❌ Error setting up database:', (error as Error).message);
    throw error;
  }

  // use sequelize-auto to transform database to models
  const sequelizeAuto = new SequelizeAuto(sequelize, '', '', {
    directory: 'src/database/models',
    lang: 'ts',
    singularize: true,
    useDefine: false,
    caseModel: 'p',
    caseFile: 'l',
  });

  try {
    await sequelizeAuto.run();
    console.log('✅ Models generated successfully.');
  } catch (error) {
    console.log('❌ Error generating models:', (error as Error).message);
    throw error;
  }

  const eslint = new ESLint({ fix: true });
  const result = await eslint.lintFiles(['src/database/models/**/*.ts']);
  await ESLint.outputFixes(result);
}

void setUpDatabase();
