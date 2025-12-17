export * from './user';
export * from './auth';

export interface Post {
  id: number;
  title: string;
  content: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface PostCreateInput {
  title: string;
  content: string;
  user_id: number;
}
