import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models';
import { CreateUserRequest, LoginRequest, AuthResponse } from '../types';
import { config } from '../config';

export class AuthService {
  private userModel = new UserModel();
  private saltRounds = 10;

  async register(input: CreateUserRequest): Promise<AuthResponse> {
    const existingUser = this.userModel.findByUsername(input.username);

    if (existingUser) {
      throw new Error('User with this username already exists');
    }

    const hashedPassword = await bcrypt.hash(input.password, this.saltRounds);

    const user = this.userModel.create(input.username, hashedPassword);

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      String(config.jwt.secret),
      { expiresIn: '24h' } as jwt.SignOptions
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  async login(input: LoginRequest): Promise<AuthResponse> {
    const user = this.userModel.findByUsername(input.username);

    if (!user) {
      throw new Error('Invalid username or password');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password_hash);

    if (!isPasswordValid) {
      throw new Error('Invalid username or password');
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      String(config.jwt.secret),
      { expiresIn: '24h' } as jwt.SignOptions
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }
}
