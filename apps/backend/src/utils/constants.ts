export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

export const DB_SQLITE_STORAGE_PATH = process.env.DB_SQLITE_STORAGE_PATH || '.db/data.sqlite3';
export const DB_SQLITE_SYNCHRONIZE = process.env.DB_SQLITE_SYNCHRONIZE === 'true';
export const DB_BUILD_MODELS = process.env.DB_BUILD_MODELS === 'true';

export const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecret';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
