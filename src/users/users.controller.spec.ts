import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should create a user', async () => {
    const userDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      role: 'CAPTAIN' as 'CAPTAIN' | 'OWNER',
    };
    const createdUser = { ...userDto, id: '123' } as User;

    jest.spyOn(service, 'create').mockReturnValue(createdUser);

    const result = await controller.create(userDto);
    expect(result).toEqual(createdUser);
    expect(service.create).toHaveBeenCalledWith(userDto);
  });

  it.skip('should not allow duplicate email signups', async () => {
    const userDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      role: 'CAPTAIN' as 'CAPTAIN' | 'OWNER',
    };

    jest.spyOn(service, 'create').mockImplementation(() => {
      throw new Error(`User with email ${userDto.email} already exists`);
    });

    await expect(controller.create(userDto)).rejects.toThrow(ConflictException);
  });

  it('should get a user by ID', async () => {
    const user = {
      id: '123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      role: 'CAPTAIN',
    } as User;

    jest.spyOn(service, 'findOne').mockReturnValue(user);

    const result = await controller.findOne('123');
    expect(result).toEqual(user);
    expect(service.findOne).toHaveBeenCalledWith('123');
  });

  it('should update a user', async () => {
    const updatedUser = {
      id: '123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '111-222-3333',
      role: 'CAPTAIN',
    } as User;

    jest.spyOn(service, 'update').mockReturnValue(updatedUser);

    const result = await controller.update('123', {
      phoneNumber: '111-222-3333',
    });
    expect(result).toEqual(updatedUser);
    expect(service.update).toHaveBeenCalledWith('123', {
      phoneNumber: '111-222-3333',
    });
  });

  it('should delete a user', async () => {
    jest.spyOn(service, 'delete').mockReturnValue(true);

    const result = await controller.delete('123');
    expect(result).toEqual({ message: 'User deleted successfully' });
    expect(service.delete).toHaveBeenCalledWith('123');
  });

  it.skip('should return a 404 if deleting a non-existent user', async () => {
    // Mock the service to throw a generic error
    jest.spyOn(service, 'delete').mockImplementation(() => {
      throw new Error('User not found');
    });

    // Expect the controller to handle it as a NotFoundException
    await expect(controller.delete('non-existent-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
