import { Request, Response } from 'express';
import { UserService } from '../services';

const userService = new UserService();

export const getAllUsers = (_req: Request, res: Response): void => {
  try {
    const users = userService.getAllUsers();
    res.json(users);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }
};

export const getUserById = (req: Request, res: Response): void => {
  try {
    const id = parseInt(req.params.id);
    const user = userService.getUserById(id);
    res.json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  }
};

export const updateUser = (req: Request, res: Response): void => {
  try {
    const id = parseInt(req.params.id);
    const user = userService.updateUser(id, req.body);
    res.json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to update user' });
    }
  }
};

export const deleteUser = (req: Request, res: Response): void => {
  try {
    const id = parseInt(req.params.id);
    userService.deleteUser(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to delete user' });
    }
  }
};
