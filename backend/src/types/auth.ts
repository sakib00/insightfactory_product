export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
  };
}

export interface JwtPayload {
  userId: number;
  username: string;
}
