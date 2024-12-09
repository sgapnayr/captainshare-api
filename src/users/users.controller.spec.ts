import { Test, TestingModule } from '@nestjs/testing';
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
});
