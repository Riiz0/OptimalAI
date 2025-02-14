import path from 'path';
import Database from 'better-sqlite3';
import { ExtendedSqliteAdapter } from '../adapters/extended-sqlite-adapter';

export function initializeDatabase(dataDir: string) {
  const filePath =
    process.env.SQLITE_FILE ?? path.resolve(dataDir, 'db.sqlite');
  const db = new ExtendedSqliteAdapter(new Database(filePath));
  return db;
}
