import { UsersService } from './users.service';
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(() => {
    usersService = new UsersService();
  });

  it('should create a user successfully', () => {
    const user = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      roles: ['CAPTAIN' as 'CAPTAIN' | 'OWNER' | 'ADMIN'],
    };

    const createdUser = usersService.create(user);
    expect(createdUser).toBeDefined();
    expect(createdUser.email).toBe(user.email);
    expect(createdUser.id).toBeDefined();
  });

  it('should throw a ConflictException if email already exists', () => {
    const user = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      roles: ['CAPTAIN' as 'CAPTAIN' | 'OWNER' | 'ADMIN'],
    };

    usersService.create(user);
    expect(() => usersService.create(user)).toThrow(ConflictException);
  });

  it('should find a user by ID', () => {
    const user = usersService.create({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      roles: ['OWNER'],
    });

    const foundUser = usersService.findOne(user.id);
    expect(foundUser).toBeDefined();
    expect(foundUser.id).toBe(user.id);
  });

  it('should throw NotFoundException if user does not exist', () => {
    expect(() => usersService.findOne('non-existent-id')).toThrow(
      NotFoundException,
    );
  });

  it('should update a user successfully', () => {
    const user = usersService.create({
      firstName: 'Mark',
      lastName: 'Smith',
      email: 'mark.smith@example.com',
      roles: ['CAPTAIN'],
    });

    const updatedUser = usersService.update(user.id, {
      firstName: 'Updated Mark',
    });
    expect(updatedUser.firstName).toBe('Updated Mark');
  });

  it('should throw NotFoundException when updating a non-existent user', () => {
    expect(() =>
      usersService.update('non-existent-id', { firstName: 'Updated Name' }),
    ).toThrow(NotFoundException);
  });

  it('should throw BadRequestException for invalid role updates', () => {
    const user = usersService.create({
      firstName: 'Alice',
      lastName: 'Brown',
      email: 'alice.brown@example.com',
      roles: ['OWNER'],
    });

    expect(() =>
      usersService.update(user.id, { roles: ['INVALID_ROLE' as any] }),
    ).toThrow(BadRequestException);
  });

  it('should soft delete a user', () => {
    const user = usersService.create({
      firstName: 'Anna',
      lastName: 'Taylor',
      email: 'anna.taylor@example.com',
      roles: ['OWNER'],
    });

    usersService.delete(user.id);
    expect(() => usersService.findOne(user.id)).toThrow(NotFoundException);
  });

  it('should prevent updates to soft-deleted users', () => {
    const user = usersService.create({
      firstName: 'Soft Deleted',
      email: 'softdeleted@example.com',
      roles: ['CAPTAIN'],
    });

    usersService.delete(user.id);

    expect(() =>
      usersService.update(user.id, { firstName: 'Updated Name' }),
    ).toThrow(NotFoundException);
  });

  it('should return an empty list when no users match the filter', () => {
    usersService.create({
      firstName: 'John',
      email: 'john@example.com',
      roles: ['CAPTAIN'],
    });

    const result = usersService.list({ roles: ['OWNER'], isDeleted: false });
    expect(result).toEqual([]);
  });

  it('should not include deleted users in list', () => {
    const user1 = usersService.create({
      firstName: 'Active User',
      email: 'active@example.com',
      roles: ['CAPTAIN'],
    });

    const user2 = usersService.create({
      firstName: 'Deleted User',
      email: 'deleted@example.com',
      roles: ['OWNER'],
    });

    usersService.delete(user2.id);
    const users = usersService.list();
    expect(users.length).toBe(1);
    expect(users[0].id).toBe(user1.id);
  });

  it('should exclude deleted users by default in list', () => {
    const user1 = usersService.create({
      firstName: 'Active User',
      email: 'active@example.com',
      roles: ['CAPTAIN'],
    });

    const user2 = usersService.create({
      firstName: 'Deleted User',
      email: 'deleted@example.com',
      roles: ['OWNER'],
    });

    usersService.delete(user2.id);
    const users = usersService.list();
    expect(users.length).toBe(1);
    expect(users[0].id).toBe(user1.id);
  });

  it('should return a list of users', () => {
    usersService.create({
      firstName: 'User1',
      email: 'user1@example.com',
      roles: ['CAPTAIN'],
    });
    usersService.create({
      firstName: 'User2',
      email: 'user2@example.com',
      roles: ['OWNER'],
    });

    const users = usersService.list();
    expect(users.length).toBe(2);
  });

  it('should paginate the list of users', () => {
    for (let i = 0; i < 15; i++) {
      usersService.create({
        firstName: `User${i + 1}`,
        email: `user${i + 1}@example.com`,
        roles: ['CAPTAIN'],
      });
    }

    const page1 = usersService.listWithPagination({}, 1, 5);
    const page2 = usersService.listWithPagination({}, 2, 5);
    const page3 = usersService.listWithPagination({}, 4, 5);

    expect(page1.length).toBe(5);
    expect(page1[0].firstName).toBe('User1');
    expect(page2[0].firstName).toBe('User6');
    expect(page3.length).toBe(0);
  });

  it('should throw BadRequestException if non-CAPTAIN adds availability', () => {
    const user = usersService.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      roles: ['OWNER'],
    });

    expect(() =>
      usersService.addAvailability(user.id, {
        day: 'Monday',
        startTime: '09:00',
        endTime: '17:00',
      }),
    ).toThrow(BadRequestException);
  });

  it('should filter users by role', () => {
    usersService.create({
      firstName: 'User1',
      email: 'user1@example.com',
      roles: ['CAPTAIN'],
    });
    usersService.create({
      firstName: 'User2',
      email: 'user2@example.com',
      roles: ['OWNER'],
    });

    const captains = usersService.list({ roles: ['CAPTAIN'] });
    expect(captains.length).toBe(1);
    expect(captains[0].roles).toContain('CAPTAIN');
  });

  it('should update certifications for a user', () => {
    const user = usersService.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      roles: ['CAPTAIN'],
    });

    const updatedUser = usersService.update(user.id, {
      certifications: ['CPR', 'Boating Safety', 'First Aid'],
    });

    expect(updatedUser.certifications).toEqual([
      'CPR',
      'Boating Safety',
      'First Aid',
    ]);
  });

  it('should handle empty certifications gracefully', () => {
    const user = usersService.create({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      roles: ['CAPTAIN'],
    });

    const updatedUser = usersService.update(user.id, {
      certifications: [],
    });

    expect(updatedUser.certifications).toEqual([]);
  });
});
