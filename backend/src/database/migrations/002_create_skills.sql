CREATE TABLE IF NOT EXISTS skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,

  -- File metadata
  filename TEXT NOT NULL,
  file_size INTEGER NOT NULL,

  -- Parsed frontmatter fields
  name TEXT NOT NULL,
  description TEXT,
  version TEXT DEFAULT '1.0.0',
  author TEXT,

  -- Full content
  content TEXT NOT NULL,

  -- Visibility & stats
  is_public BOOLEAN DEFAULT FALSE,
  download_count INTEGER DEFAULT 0,
  clone_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_skills_user_id ON skills(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_is_public ON skills(is_public);
