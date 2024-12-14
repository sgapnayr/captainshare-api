import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should create a user successfully', () => {
    const user = {
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '1234567890',
      email: 'john@example.com',
      roles: ['CAPTAIN' as 'CAPTAIN' | 'OWNER'],
    };
    jest.spyOn(usersService, 'create').mockImplementation(
      () =>
        ({
          ...user,
          id: '1',
          isDeleted: false,
        }) as User,
    );

    const result = usersController.create(user);
    expect(result.id).toBe('1');
  });

  it('should throw ConflictException for duplicate email', () => {
    const user = {
      firstName: 'Duplicate',
      lastName: 'User',
      phoneNumber: '1234567890',
      email: 'duplicate@example.com',
      roles: ['OWNER' as const],
    };
    jest.spyOn(usersService, 'create').mockImplementation(() => {
      throw new ConflictException();
    });

    expect(() => usersController.create(user)).toThrow(ConflictException);
  });

  it('should return a user by ID', () => {
    const user = { id: '1', email: 'test@example.com' } as User;
    jest.spyOn(usersService, 'findOne').mockReturnValue(user);

    const result = usersController.findOne('1');
    expect(result).toBe(user);
  });

  it('should throw NotFoundException for non-existent user', () => {
    jest.spyOn(usersService, 'findOne').mockImplementation(() => {
      throw new NotFoundException();
    });

    expect(() => usersController.findOne('non-existent-id')).toThrow(
      NotFoundException,
    );
  });

  it('should update a user successfully', () => {
    const user = { id: '1', firstName: 'Old Name' } as User;
    jest.spyOn(usersService, 'update').mockReturnValue({
      ...user,
      firstName: 'Updated Name',
      isCaptain: function (): boolean {
        throw new Error('Function not implemented.');
      },
      isOwner: function (): boolean {
        throw new Error('Function not implemented.');
      },
      isAdmin: function (): boolean {
        throw new Error('Function not implemented.');
      },
    });

    const result = usersController.update('1', { firstName: 'Updated Name' });
    expect(result.firstName).toBe('Updated Name');
  });

  it('should return a list of users', () => {
    const users = [
      { id: '1', email: 'user1@example.com' },
      { id: '2', email: 'user2@example.com' },
    ] as User[];
    jest.spyOn(usersService, 'list').mockReturnValue(users);

    const result = usersController.list();
    expect(result.length).toBe(2);
  });
});
