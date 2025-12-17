import getDatabase from '../database/connection';
import { User, UserCreateInput, UserResponse } from '../types';

export class UserModel {
  private db = getDatabase();

  findAll(): UserResponse[] {
    const users = this.db.prepare('SELECT id, name, email, created_at, updated_at FROM users').all() as User[];
    return users;
  }

  findById(id: number): UserResponse | null {
    const user = this.db
      .prepare('SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?')
      .get(id) as User | undefined;
    return user || null;
  }

  findByEmail(email: string): User | null {
    const user = this.db
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(email) as User | undefined;
    return user || null;
  }

  create(userData: UserCreateInput): UserResponse {
    const stmt = this.db.prepare(`
      INSERT INTO users (name, email, password)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(userData.name, userData.email, userData.password);
    const user = this.findById(Number(result.lastInsertRowid));

    if (!user) {
      throw new Error('Failed to create user');
    }

    return user;
  }

  update(id: number, userData: Partial<UserCreateInput>): UserResponse | null {
    const fields: string[] = [];
    const values: any[] = [];

    if (userData.name) {
      fields.push('name = ?');
      values.push(userData.name);
    }
    if (userData.email) {
      fields.push('email = ?');
      values.push(userData.email);
    }
    if (userData.password) {
      fields.push('password = ?');
      values.push(userData.password);
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
