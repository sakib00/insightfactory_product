import { UserModel } from '../models';
import { UserPublic } from '../types';

export class UserService {
  private userModel = new UserModel();

  getAllUsers(): UserPublic[] {
    return this.userModel.findAll();
  }

  getUserById(id: number): UserPublic {
    const user = this.userModel.findById(id);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  updateUser(id: number, data: { username?: string; password?: string }): UserPublic {
    const user = this.userModel.update(id, data.username, data.password);

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
