import { Request, Response } from 'express';
import { AuthService } from '../services';
import { CreateUserRequest, LoginRequest } from '../types';

const authService = new AuthService();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const input: CreateUserRequest = req.body;
    const result = await authService.register(input);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to register user' });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const input: LoginRequest = req.body;
    const result = await authService.login(input);
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to login' });
    }
  }
};
