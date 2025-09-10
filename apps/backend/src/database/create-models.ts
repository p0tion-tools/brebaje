import { Sequelize } from 'sequelize';
import SequelizeAuto from 'sequelize-auto';
import { DB_SQLITE_STORAGE_PATH } from '../utils/constants';
import { ScriptLogger } from '../utils/logger';

const logger = new ScriptLogger('CreateModels');

export async function createModels(sql: string) {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: DB_SQLITE_STORAGE_PATH,
    logging: false,
  });

  try {
    await sequelize.authenticate();

    // Split SQL into individual statements and execute each one (SQLite)
    const statements = sql
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    for (const statement of statements) {
      if (statement.trim()) {
        await sequelize.query(statement + ';');
      }
    }

    logger.success('Database setup complete. DBML loaded successfully.');
  } catch (error) {
    logger.failure('Error setting up database');
    logger.error((error as Error).message, error as Error);
    throw error;
  }

  try {
    // use sequelize-auto to transform database to models
    const sequelizeAuto = new SequelizeAuto(sequelize, '', '', {
      directory: 'src/database/models',
      lang: 'ts',
      singularize: true,
      useDefine: false,
      caseModel: 'p',
      caseFile: 'l',
      noAlias: true,
      noInitModels: true,
    });

    await sequelizeAuto.run();
    logger.success('Models generated successfully.');
  } catch (error) {
    logger.failure('Error generating models');
    logger.error((error as Error).message, error as Error);
    throw error;
  }
}
