import getDatabase from '../database/connection';
import { User, UserPublic } from '../types';

export class UserModel {
  private db = getDatabase();

  findAll(): UserPublic[] {
    const users = this.db.prepare('SELECT id, username FROM users').all() as UserPublic[];
    return users;
  }

  findById(id: number): UserPublic | null {
    const user = this.db
      .prepare('SELECT id, username FROM users WHERE id = ?')
      .get(id) as UserPublic | undefined;
    return user || null;
  }

  findByUsername(username: string): User | null {
    const user = this.db
      .prepare('SELECT * FROM users WHERE username = ?')
      .get(username) as User | undefined;
    return user || null;
  }

  create(username: string, passwordHash: string): UserPublic {
    const stmt = this.db.prepare(`
      INSERT INTO users (username, password_hash)
      VALUES (?, ?)
    `);

    const result = stmt.run(username, passwordHash);
    const user = this.findById(Number(result.lastInsertRowid));

    if (!user) {
      throw new Error('Failed to create user');
    }

    return user;
  }

  update(id: number, username?: string, passwordHash?: string): UserPublic | null {
    const fields: string[] = [];
    const values: any[] = [];

    if (username) {
      fields.push('username = ?');
      values.push(username);
    }
    if (passwordHash) {
      fields.push('password_hash = ?');
      values.push(passwordHash);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = this.db.prepare(`
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = ?
    `);

    stmt.run(...values);
    return this.findById(id);
  }

  delete(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM users WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}
