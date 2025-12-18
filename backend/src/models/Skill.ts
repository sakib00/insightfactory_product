import getDatabase from '../database/connection';
import { Skill, SkillWithTags, SkillWithOwner, Tag, UserPublic } from '../types';

export class SkillModel {
  private db = getDatabase();

  findAll(isPublicOnly = false): Skill[] {
    const query = isPublicOnly
      ? 'SELECT * FROM skills WHERE is_public = TRUE ORDER BY created_at DESC'
      : 'SELECT * FROM skills ORDER BY created_at DESC';
    return this.db.prepare(query).all() as Skill[];
  }

  findById(id: number): Skill | null {
    const skill = this.db.prepare('SELECT * FROM skills WHERE id = ?').get(id) as Skill | undefined;
    return skill || null;
  }

  findByIdWithTags(id: number): SkillWithTags | null {
    const skill = this.findById(id);
    if (!skill) return null;

    const tags = this.getSkillTags(id);
    return { ...skill, tags };
  }

  findByIdWithOwner(id: number): SkillWithOwner | null {
    const skillWithTags = this.findByIdWithTags(id);
    if (!skillWithTags) return null;

    const owner = this.db
      .prepare('SELECT id, username FROM users WHERE id = ?')
      .get(skillWithTags.user_id) as UserPublic | undefined;

    if (!owner) return null;

    return { ...skillWithTags, owner };
  }

  findByUserId(userId: number): Skill[] {
    return this.db
      .prepare('SELECT * FROM skills WHERE user_id = ? ORDER BY created_at DESC')
      .all(userId) as Skill[];
  }

  create(skillData: {
    user_id: number;
    filename: string;
    file_size: number;
    name: string;
    description?: string;
    version?: string;
    author?: string;
    content: string;
    is_public?: boolean;
  }): Skill {
    const stmt = this.db.prepare(`
      INSERT INTO skills (
        user_id, filename, file_size, name, description,
        version, author, content, is_public
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      skillData.user_id,
      skillData.filename,
      skillData.file_size,
      skillData.name,
      skillData.description || null,
      skillData.version || '1.0.0',
      skillData.author || null,
      skillData.content,
      skillData.is_public ? 1 : 0
    );

    const skill = this.findById(Number(result.lastInsertRowid));

    if (!skill) {
      throw new Error('Failed to create skill');
    }

    return skill;
  }

  update(
    id: number,
    skillData: {
      content?: string;
      is_public?: boolean;
      name?: string;
      description?: string;
      version?: string;
    }
  ): Skill | null {
    const fields: string[] = [];
    const values: any[] = [];

    if (skillData.content !== undefined) {
      fields.push('content = ?');
      values.push(skillData.content);
    }
    if (skillData.is_public !== undefined) {
      fields.push('is_public = ?');
      values.push(skillData.is_public ? 1 : 0);
    }
    if (skillData.name) {
      fields.push('name = ?');
      values.push(skillData.name);
    }
    if (skillData.description !== undefined) {
      fields.push('description = ?');
      values.push(skillData.description);
    }
    if (skillData.version) {
      fields.push('version = ?');
      values.push(skillData.version);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = this.db.prepare(`
      UPDATE skills
      SET ${fields.join(', ')}
      WHERE id = ?
    `);

    stmt.run(...values);
    return this.findById(id);
  }

  delete(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM skills WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  incrementDownloadCount(id: number): void {
    this.db.prepare('UPDATE skills SET download_count = download_count + 1 WHERE id = ?').run(id);
  }

  incrementCloneCount(id: number): void {
    this.db.prepare('UPDATE skills SET clone_count = clone_count + 1 WHERE id = ?').run(id);
  }

  // Tag management
  getSkillTags(skillId: number): Tag[] {
    return this.db
      .prepare(
        `
      SELECT t.* FROM tags t
      INNER JOIN skill_tags st ON t.id = st.tag_id
      WHERE st.skill_id = ?
    `
      )
      .all(skillId) as Tag[];
  }

  addTag(skillId: number, tagId: number): void {
    this.db.prepare('INSERT OR IGNORE INTO skill_tags (skill_id, tag_id) VALUES (?, ?)').run(skillId, tagId);
  }

  removeTag(skillId: number, tagId: number): void {
    this.db.prepare('DELETE FROM skill_tags WHERE skill_id = ? AND tag_id = ?').run(skillId, tagId);
  }

  clearTags(skillId: number): void {
    this.db.prepare('DELETE FROM skill_tags WHERE skill_id = ?').run(skillId);
  }
}
