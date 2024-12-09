// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = []; // In-memory storage

  create(user: Partial<User>): User {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      isGovernmentIdVerified: false,
    } as User; // Generate an ID
    this.users.push(newUser);
    return newUser;
  }

  findOne(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  update(id: string, updateData: Partial<User>): User | undefined {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) return undefined;

    const updatedUser = { ...this.users[userIndex], ...updateData };
    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  delete(id: string): boolean {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) return false;

    this.users.splice(userIndex, 1);
    return true;
  }
}
