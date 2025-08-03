import { ESLint } from 'eslint';
import { Sequelize } from 'sequelize';
import SequelizeAuto from 'sequelize-auto';
import { DB_SQLITE_STORAGE_PATH } from '../utils/constants';

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

    console.log('✅ Database setup complete. DBML loaded succesully.');
  } catch (error) {
    console.log('❌ Error setting up database:', (error as Error).message);
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
    console.log('✅ Models generated successfully.');
  } catch (error) {
    console.log('❌ Error generating models:', (error as Error).message);
    throw error;
  }

  try {
    const eslint = new ESLint({ fix: true });
    const result = await eslint.lintFiles(['src/database/models/**/*.ts']);
    await ESLint.outputFixes(result);
  } catch (error) {
    console.log('❌ Error running ESLint:', (error as Error).message);
    throw error;
  }
}
