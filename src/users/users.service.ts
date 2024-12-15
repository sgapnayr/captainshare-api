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
    const validRoles = ['CAPTAIN', 'OWNER', 'ADMIN'];
    roles.forEach((role) => {
      if (!validRoles.includes(role)) {
        throw new BadRequestException(`Invalid role: ${role}`);
      }
    });
  }

  private isCaptain(userId: string): boolean {
    const user = this.findOne(userId);
    return user.roles.includes('CAPTAIN');
  }

  private isOwner(userId: string): boolean {
    const user = this.findOne(userId);
    return user.roles.includes('OWNER');
  }

  private validatePreferredCaptains(captains: string[]): void {
    captains.forEach((captainId) => {
      const captain = this.findOne(captainId);
      console.log(
        `Validating captain ID: ${captainId}, Roles: ${captain.roles}`,
      ); // Debug log
      if (!captain.roles.includes('CAPTAIN')) {
        throw new BadRequestException(
          `User with ID ${captainId} is not a valid captain.`,
        );
      }
    });
  }

  private paginate<T>(items: T[], page: number, limit: number): T[] {
    return items.slice((page - 1) * limit, page * limit);
  }

  private validateAvailabilityConflicts(
    userId: string,
    availability: AvailabilityDto,
  ): void {
    const user = this.findOne(userId);
    const conflict = user.availability?.some(
      (slot) =>
        slot.day === availability.day &&
        slot.startTime < availability.endTime &&
        slot.endTime > availability.startTime,
    );

    if (conflict) {
      throw new ConflictException(
        'The availability slot conflicts with an existing slot.',
      );
    }
  }

  create(user: Partial<User>): User {
    const existingUser = this.users.find(
      (u) => u.email === user.email && !u.isDeleted,
    );
    if (existingUser) {
      throw new ConflictException(
        `User with email ${user.email} already exists.`,
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
      certifications: user.certifications ?? [],
      preferredBoatTypes: user.preferredBoatTypes ?? [],
      preferredCaptains: user.preferredCaptains ?? [],
      ratePerHour: user.ratePerHour ?? 0,
      isEmailVerified: false,
      onboardingComplete: false,
      averageRating: 0,
      totalReviews: 0,
      referredBy: user.referredBy ?? '',
      referralCode: user.referralCode ?? '',
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
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user;
  }

  update(id: string, updateData: Partial<User>): User {
    const user = this.findOne(id);

    if (updateData.roles) {
      this.validateRoles(updateData.roles);
    }

    Object.assign(user, updateData, { updatedAt: new Date() });

    if (updateData.certifications) {
      user.certifications = Array.from(new Set(updateData.certifications));
    }

    if (updateData.preferredBoatTypes) {
      user.preferredBoatTypes = Array.from(
        new Set(updateData.preferredBoatTypes),
      );
    }

    if (updateData.preferredCaptains) {
      this.validatePreferredCaptains(updateData.preferredCaptains);
      user.preferredCaptains = Array.from(
        new Set(updateData.preferredCaptains),
      );
    }

    return user;
  }

  delete(id: string): void {
    const user = this.findOne(id);
    user.isDeleted = true;
    user.updatedAt = new Date();
  }

  list(filters: Partial<User> = {}): User[] {
    return this.users.filter((user) => {
      const includeDeleted = filters.isDeleted === true;
      if (!includeDeleted && user.isDeleted) {
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
    return this.paginate(filteredUsers, page, limit);
  }

  addAvailability(id: string, availability: AvailabilityDto): User {
    const user = this.findOne(id);

    if (!this.isCaptain(id)) {
      throw new BadRequestException('Only captains can set availability.');
    }

    this.validateAvailabilityConflicts(id, availability);

    user.availability = [...(user.availability || []), availability];
    user.updatedAt = new Date();
    return user;
  }

  addRole(id: string, role: 'CAPTAIN' | 'OWNER' | 'ADMIN'): User {
    const user = this.findOne(id);

    if (!['CAPTAIN', 'OWNER', 'ADMIN'].includes(role)) {
      throw new BadRequestException(`Invalid role: ${role}`);
    }

    if (!user.roles.includes(role)) {
      user.roles.push(role);
      user.updatedAt = new Date();
    }
    return user;
  }

  removeRole(id: string, role: 'CAPTAIN' | 'OWNER' | 'ADMIN'): User {
    const user = this.findOne(id);

    if (!user.roles.includes(role)) {
      throw new BadRequestException(`User does not have the role: ${role}`);
    }

    user.roles = user.roles.filter((r) => r !== role);
    user.updatedAt = new Date();
    return user;
  }

  updatePreferredCaptains(userId: string, captains: string[]): User {
    const user = this.findOne(userId);

    if (!this.isOwner(userId)) {
      throw new BadRequestException(
        'Only owners can manage preferred captains.',
      );
    }

    this.validatePreferredCaptains(captains);

    user.preferredCaptains = Array.from(new Set(captains));
    user.updatedAt = new Date();
    return user;
  }

  queryCaptainsByAvailability(
    availability: AvailabilityDto,
    certifications: string[] = [],
    rateRange?: { min: number; max: number },
  ): User[] {
    return this.list({ roles: ['CAPTAIN'] }).filter((captain) => {
      const matchesAvailability = captain.availability?.some(
        (slot) =>
          slot.day === availability.day &&
          slot.startTime < availability.endTime &&
          slot.endTime > availability.startTime,
      );

      const matchesCertifications =
        certifications.length === 0 ||
        certifications.every((cert) => captain.certifications?.includes(cert));

      const matchesRate =
        !rateRange ||
        (captain.ratePerHour >= rateRange.min &&
          captain.ratePerHour <= rateRange.max);

      return matchesAvailability && matchesCertifications && matchesRate;
    });
  }
}
