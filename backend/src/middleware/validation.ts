import { Request, Response, NextFunction } from 'express';
import { isValidPassword } from '../utils/validation';

export const validateRegistration = (req: Request, res: Response, next: NextFunction): void => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  if (username.trim().length < 3) {
    res.status(400).json({ error: 'Username must be at least 3 characters long' });
    return;
  }

  if (!isValidPassword(password)) {
    res.status(400).json({ error: 'Password must be at least 6 characters long' });
    return;
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  next();
};

export const validateSkill = (req: Request, res: Response, next: NextFunction): void => {
  const { content } = req.body;

  if (!content) {
    res.status(400).json({ error: 'Content is required' });
    return;
  }

  if (content.trim().length === 0) {
    res.status(400).json({ error: 'Content cannot be empty' });
    return;
  }

  next();
};
