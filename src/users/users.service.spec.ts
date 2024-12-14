import { UsersService } from './users.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

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
});
