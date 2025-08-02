export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

export const DB_SQLITE_STORAGE_PATH = process.env.DB_SQLITE_STORAGE_PATH || '.db/data.sqlite3';
export const DB_SQLITE_SYNCHRONIZE = process.env.DB_SQLITE_SYNCHRONIZE === 'true';
export const DB_BUILD_MODELS = process.env.DB_BUILD_MODELS === 'true';
export const DB_NAME = process.env.DB_NAME || 'coordinator';
