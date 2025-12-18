export * from './user';
export * from './auth';

// User
export interface User {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface UserPublic {
  id: number;
  username: string;
}

// Skill
export interface Skill {
  id: number;
  user_id: number;
  filename: string;
  file_size: number;
  name: string;
  description: string | null;
  version: string;
  author: string | null;
  content: string;
  is_public: boolean;
  download_count: number;
  clone_count: number;
  created_at: string;
  updated_at: string;
}

export interface SkillWithTags extends Skill {
  tags: Tag[];
}

export interface SkillWithOwner extends SkillWithTags {
  owner: UserPublic;
}

// Tag
export interface Tag {
  id: number;
  name: string;
  slug: string;
  usage_count: number;
  created_at: string;
}

// Request types
export interface CreateUserRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface CreateSkillRequest {
  content: string;
  tags?: string[];
  is_public?: boolean;
}

export interface UpdateSkillRequest {
  content?: string;
  tags?: string[];
  is_public?: boolean;
}
