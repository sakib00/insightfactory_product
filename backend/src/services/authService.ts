import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models';
import { RegisterInput, LoginInput, AuthResponse } from '../types';
import { config } from '../config';

export class AuthService {
  private userModel = new UserModel();
  private saltRounds = 10;

  async register(input: RegisterInput): Promise<AuthResponse> {
    const existingUser = this.userModel.findByEmail(input.email);

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(input.password, this.saltRounds);

    const user = this.userModel.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      String(config.jwt.secret),
      { expiresIn: '24h' } as jwt.SignOptions
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = this.userModel.findByEmail(input.email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      String(config.jwt.secret),
      { expiresIn: '24h' } as jwt.SignOptions
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
