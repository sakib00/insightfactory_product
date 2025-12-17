import Database from 'better-sqlite3';
import { databaseConfig } from '../config';

let db: Database.Database | null = null;

export const getDatabase = (): Database.Database => {
  if (!db) {
    db = new Database(databaseConfig.filename, databaseConfig.options);
    db.pragma('journal_mode = WAL');
  }
  return db;
};

export const closeDatabase = (): void => {
  if (db) {
    db.close();
    db = null;
  }
};

export default getDatabase;
