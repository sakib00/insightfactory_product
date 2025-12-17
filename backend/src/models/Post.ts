import getDatabase from '../database/connection';
import { Post, PostCreateInput } from '../types';

export class PostModel {
  private db = getDatabase();

  findAll(): Post[] {
    return this.db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all() as Post[];
  }

  findById(id: number): Post | null {
    const post = this.db.prepare('SELECT * FROM posts WHERE id = ?').get(id) as Post | undefined;
    return post || null;
  }

  findByUserId(userId: number): Post[] {
    return this.db
      .prepare('SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC')
      .all(userId) as Post[];
  }

  create(postData: PostCreateInput): Post {
    const stmt = this.db.prepare(`
      INSERT INTO posts (title, content, user_id)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(postData.title, postData.content, postData.user_id);
    const post = this.findById(Number(result.lastInsertRowid));

    if (!post) {
      throw new Error('Failed to create post');
    }

    return post;
  }

  update(id: number, postData: Partial<Omit<PostCreateInput, 'user_id'>>): Post | null {
    const fields: string[] = [];
    const values: any[] = [];

    if (postData.title) {
      fields.push('title = ?');
      values.push(postData.title);
    }
    if (postData.content) {
      fields.push('content = ?');
      values.push(postData.content);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = this.db.prepare(`
      UPDATE posts
      SET ${fields.join(', ')}
      WHERE id = ?
    `);

    stmt.run(...values);
    return this.findById(id);
  }

  delete(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM posts WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}
