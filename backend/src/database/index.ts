import path from 'path';
import { SqliteDatabaseAdapter } from '@elizaos/adapter-sqlite';
import Database from 'better-sqlite3';

export function initializeDatabase(dataDir: string) {
  const filePath =
    process.env.SQLITE_FILE ?? path.resolve(dataDir, 'db.sqlite');
  const db = new SqliteDatabaseAdapter(new Database(filePath));
  return db;
}
