CREATE TABLE IF NOT EXISTS skill_tags (
  skill_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (skill_id, tag_id),
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_skill_tags_skill_id ON skill_tags(skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_tags_tag_id ON skill_tags(tag_id);
