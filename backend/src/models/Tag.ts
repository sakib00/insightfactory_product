import getDatabase from '../database/connection';
import { Tag } from '../types';

export class TagModel {
  private db = getDatabase();

  findAll(): Tag[] {
    return this.db.prepare('SELECT * FROM tags ORDER BY usage_count DESC, name ASC').all() as Tag[];
  }

  findById(id: number): Tag | null {
    const tag = this.db.prepare('SELECT * FROM tags WHERE id = ?').get(id) as Tag | undefined;
    return tag || null;
  }

  findBySlug(slug: string): Tag | null {
    const tag = this.db.prepare('SELECT * FROM tags WHERE slug = ?').get(slug) as Tag | undefined;
    return tag || null;
  }

  findByName(name: string): Tag | null {
    const tag = this.db.prepare('SELECT * FROM tags WHERE name = ?').get(name) as Tag | undefined;
    return tag || null;
  }

  create(name: string, slug: string): Tag {
    const stmt = this.db.prepare(`
      INSERT INTO tags (name, slug)
      VALUES (?, ?)
    `);

    const result = stmt.run(name, slug);
    const tag = this.findById(Number(result.lastInsertRowid));

    if (!tag) {
      throw new Error('Failed to create tag');
    }

    return tag;
  }

  findOrCreate(name: string): Tag {
    const slug = this.slugify(name);
    let tag = this.findBySlug(slug);

    if (!tag) {
      tag = this.create(name, slug);
    }

    return tag;
  }

  incrementUsageCount(id: number): void {
    this.db.prepare('UPDATE tags SET usage_count = usage_count + 1 WHERE id = ?').run(id);
  }

  decrementUsageCount(id: number): void {
    this.db.prepare('UPDATE tags SET usage_count = usage_count - 1 WHERE id = ?').run(id);
  }

  delete(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM tags WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
