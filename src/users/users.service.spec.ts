import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', () => {
    const user: Partial<User> = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '123-456-7890',
      role: 'CAPTAIN',
    };

    const createdUser = service.create(user);
    expect(createdUser).toMatchObject(user);
    expect(createdUser.id).toBeDefined();
  });

  it('should not allow duplicate email signups', () => {
    const user: Partial<User> = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '123-456-7890',
      role: 'CAPTAIN',
    };

    service.create(user);

    expect(() => service.create(user)).toThrowError(
      `User with email ${user.email} already exists`,
    );
  });

  it('should find a user by ID', () => {
    const user = service.create({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phoneNumber: '987-654-3210',
      role: 'OWNER',
    });

    const foundUser = service.findOne(user.id);
    expect(foundUser).toEqual(user);
  });

  it('should update a user', () => {
    const user = service.create({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phoneNumber: '987-654-3210',
      role: 'OWNER',
    });

    const updatedUser = service.update(user.id, {
      phoneNumber: '111-222-3333',
    });
    expect(updatedUser?.phoneNumber).toBe('111-222-3333');
  });

  it('should throw an error if updating a non-existent user', () => {
    expect(() =>
      service.update('non-existent-id', { phoneNumber: '111-222-3333' }),
    ).toThrowError('User not found');
  });

  it('should delete a user', () => {
    const user = service.create({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phoneNumber: '987-654-3210',
      role: 'OWNER',
    });

    const result = service.delete(user.id);
    expect(result).toBe(true); // Successful deletion
    expect(() => service.findOne(user.id)).toThrowError(
      `User with ID ${user.id} not found`,
    ); // Confirm user no longer exists
  });

  it('should throw an error if deleting a non-existent user', () => {
    expect(() => service.delete('non-existent-id')).toThrowError(
      'User not found',
    );
  });
});
