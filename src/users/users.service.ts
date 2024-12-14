import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { AvailabilityDto } from './dto/availability.dto';

@Injectable()
export class UsersService {
  private users: User[] = [];

  private validateRoles(roles: string[]): void {
    const validRoles = ['CAPTAIN', 'OWNER'];
    roles.forEach((role) => {
      if (!validRoles.includes(role)) {
        throw new BadRequestException(`Invalid role: ${role}`);
      }
    });
  }

  create(user: Partial<User>): User {
    const existingUser = this.users.find(
      (u) => u.email === user.email && !u.isDeleted,
    );
    if (existingUser) {
      throw new ConflictException(
        `User with email ${user.email} already exists`,
      );
    }

    this.validateRoles(user.roles || []);

    const newUser: User = {
      id: Date.now().toString(),
      roles: Array.from(new Set(user.roles || [])),
      isGovernmentIdVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      email: user.email ?? '',
      phoneNumber: user.phoneNumber ?? '',
      availability: user.availability ?? [],
      isEmailVerified: false,
      onboardingComplete: false,
      isCaptain: function (): boolean {
        throw new Error('Function not implemented.');
      },
      isOwner: function (): boolean {
        throw new Error('Function not implemented.');
      },
      isAdmin: function (): boolean {
        throw new Error('Function not implemented.');
      },
    };

    this.users.push(newUser);
    return newUser;
  }

  findOne(id: string): User {
    const user = this.users.find((u) => u.id === id && !u.isDeleted);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  update(id: string, updateData: Partial<User>): User {
    const user = this.findOne(id);
    if (updateData.roles) {
      this.validateRoles(updateData.roles);
    }
    Object.assign(user, updateData, { updatedAt: new Date() });
    return user;
  }

  delete(id: string): void {
    const user = this.findOne(id);
    user.isDeleted = true;
    user.updatedAt = new Date();
  }

  list(filters: Partial<User> = {}): User[] {
    return this.users.filter((user) => {
      if (
        filters.isDeleted !== undefined &&
        user.isDeleted !== filters.isDeleted
      ) {
        return false;
      }
      if (
        filters.roles &&
        !filters.roles.some((role) => user.roles.includes(role))
      ) {
        return false;
      }
      return true;
    });
  }

  listWithPagination(
    filters: Partial<User>,
    page: number,
    limit: number,
  ): User[] {
    const filteredUsers = this.list(filters);
    return filteredUsers.slice((page - 1) * limit, page * limit);
  }

  addAvailability(id: string, availability: AvailabilityDto): User {
    const user = this.findOne(id);
    if (!user.roles.includes('CAPTAIN')) {
      throw new BadRequestException('Only captains can set availability');
    }
    user.availability = [...(user.availability || []), availability];
    user.updatedAt = new Date();
    return user;
  }

  addRole(id: string, role: 'CAPTAIN' | 'OWNER'): User {
    const user = this.findOne(id);
    if (!['CAPTAIN', 'OWNER'].includes(role)) {
      throw new BadRequestException(`Invalid role: ${role}`);
    }
    if (!user.roles.includes(role)) {
      user.roles.push(role);
      user.updatedAt = new Date();
    }
    return user;
  }

  removeRole(id: string, role: 'CAPTAIN' | 'OWNER'): User {
    const user = this.findOne(id);
    if (!user.roles.includes(role)) {
      throw new BadRequestException(`User does not have the role: ${role}`);
    }
    user.roles = user.roles.filter((r) => r !== role);
    user.updatedAt = new Date();
    return user;
  }
}
