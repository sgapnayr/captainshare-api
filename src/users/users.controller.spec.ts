import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

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
      roles: ['CAPTAIN' as 'CAPTAIN' | 'OWNER' | 'ADMIN'],
    };
    jest.spyOn(usersService, 'create').mockReturnValue({
      ...user,
      id: '1',
      isDeleted: false,
    } as User);

    const result = usersController.create(user);
    expect(result.id).toBe('1');
    expect(usersService.create).toHaveBeenCalledWith(user);
  });

  it('should throw ConflictException for duplicate email', () => {
    const user = {
      firstName: 'Duplicate',
      lastName: 'User',
      phoneNumber: '1234567890',
      email: 'duplicate@example.com',
      roles: ['OWNER' as 'CAPTAIN' | 'OWNER' | 'ADMIN'],
    };
    jest.spyOn(usersService, 'create').mockImplementation(() => {
      throw new ConflictException('User already exists');
    });

    expect(() => usersController.create(user)).toThrow(ConflictException);
  });

  it('should return a user by ID', () => {
    const user = { id: '1', email: 'test@example.com' } as User;
    jest.spyOn(usersService, 'findOne').mockReturnValue(user);

    const result = usersController.findOne('1');
    expect(result).toBe(user);
    expect(usersService.findOne).toHaveBeenCalledWith('1');
  });

  it('should throw NotFoundException for non-existent user', () => {
    jest.spyOn(usersService, 'findOne').mockImplementation(() => {
      throw new NotFoundException('User not found');
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
    expect(usersService.update).toHaveBeenCalledWith('1', {
      firstName: 'Updated Name',
    });
  });

  it('should throw NotFoundException when updating a non-existent user', () => {
    jest.spyOn(usersService, 'update').mockImplementation(() => {
      throw new NotFoundException('User not found');
    });

    expect(() => usersController.update('non-existent-id', {})).toThrow(
      NotFoundException,
    );
  });

  it('should add availability for a captain', () => {
    const user = { id: '1', roles: ['CAPTAIN'], availability: [] } as User;
    const availability = {
      day: 'Monday',
      startTime: '09:00',
      endTime: '17:00',
    };

    jest.spyOn(usersService, 'addAvailability').mockReturnValue({
      ...user,
      availability: [availability],
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

    const result = usersController.addAvailability('1', availability);
    expect(result.availability).toContainEqual(availability);
    expect(usersService.addAvailability).toHaveBeenCalledWith(
      '1',
      availability,
    );
  });

  it('should throw BadRequestException if adding availability to a non-captain', () => {
    jest.spyOn(usersService, 'addAvailability').mockImplementation(() => {
      throw new BadRequestException('Only captains can set availability');
    });

    expect(() =>
      usersController.addAvailability('2', {
        day: 'Monday',
        startTime: '09:00',
        endTime: '17:00',
      }),
    ).toThrow(BadRequestException);
  });

  it('should return a list of users', () => {
    const users = [
      { id: '1', email: 'user1@example.com' },
      { id: '2', email: 'user2@example.com' },
    ] as User[];
    jest.spyOn(usersService, 'listWithPagination').mockReturnValue(users);

    const result = usersController.list();
    expect(result).toEqual(users);
    expect(usersService.listWithPagination).toHaveBeenCalled();
  });

  it('should add a role to a user', () => {
    const user = { id: '1', roles: ['CAPTAIN'] } as User;

    jest.spyOn(usersService, 'addRole').mockReturnValue({
      ...user,
      roles: ['CAPTAIN', 'OWNER'],
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

    const result = usersController.addRole('1', 'OWNER');
    expect(result.roles).toContain('OWNER');
    expect(usersService.addRole).toHaveBeenCalledWith('1', 'OWNER');
  });

  it('should throw BadRequestException when adding an invalid role', () => {
    jest.spyOn(usersService, 'addRole').mockImplementation(() => {
      throw new BadRequestException('Invalid role');
    });

    expect(() => usersController.addRole('1', 'INVALID_ROLE' as any)).toThrow(
      BadRequestException,
    );
  });

  it('should remove a role from a user', () => {
    const user = { id: '1', roles: ['CAPTAIN', 'OWNER'] } as User;

    jest.spyOn(usersService, 'removeRole').mockReturnValue({
      ...user,
      roles: ['CAPTAIN'],
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

    const result = usersController.removeRole('1', 'OWNER');
    expect(result.roles).not.toContain('OWNER');
    expect(usersService.removeRole).toHaveBeenCalledWith('1', 'OWNER');
  });

  it('should throw BadRequestException when removing a role the user does not have', () => {
    jest.spyOn(usersService, 'removeRole').mockImplementation(() => {
      throw new BadRequestException('User does not have the role');
    });

    expect(() => usersController.removeRole('1', 'ADMIN' as any)).toThrow(
      BadRequestException,
    );
  });
});
