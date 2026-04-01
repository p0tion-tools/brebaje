import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

/**
 * Runs before any e2e spec module is loaded. `DB_SQLITE_SYNCHRONIZE` must be set
 * before `src/utils/constants.ts` is first evaluated (SequelizeModule uses it at import time).
 */
process.env.DB_SQLITE_SYNCHRONIZE = 'true';

const e2eDbDir = join(__dirname, '.e2e-db');
if (!existsSync(e2eDbDir)) {
  mkdirSync(e2eDbDir, { recursive: true });
}
process.env.DB_SQLITE_STORAGE_PATH = join(e2eDbDir, 'data.sqlite3');
