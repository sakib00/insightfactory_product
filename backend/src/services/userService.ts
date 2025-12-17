import { UserModel } from '../models';
import { UserResponse } from '../types';

export class UserService {
  private userModel = new UserModel();

  getAllUsers(): UserResponse[] {
    return this.userModel.findAll();
  }

  getUserById(id: number): UserResponse {
    const user = this.userModel.findById(id);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  updateUser(id: number, data: { name?: string; email?: string }): UserResponse {
    const user = this.userModel.update(id, data);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  deleteUser(id: number): void {
    const deleted = this.userModel.delete(id);

    if (!deleted) {
      throw new Error('User not found');
    }
  }
}
