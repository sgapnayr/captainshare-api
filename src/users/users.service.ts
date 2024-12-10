import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = []; // In-memory storage

  create(user: Partial<User>): User {
    const existingUser = this.users.find((u) => u.email === user.email);
    if (existingUser) {
      throw new Error(`User with email ${user.email} already exists`);
    }

    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      isGovernmentIdVerified: false,
    } as User;

    this.users.push(newUser);
    return newUser;
  }

  findOne(id: string): User {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    return user;
  }

  update(id: string, updateData: Partial<User>): User {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const updatedUser = { ...this.users[userIndex], ...updateData };
    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  delete(id: string): boolean {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    this.users.splice(userIndex, 1);
    return true;
  }

  list(): User[] {
    return this.users; // Returns all users
  }
}
