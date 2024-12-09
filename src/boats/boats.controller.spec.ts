import { Test, TestingModule } from '@nestjs/testing';
import { BoatsController } from './boats.controller';
import { BoatsService } from './boats.service';
import { Boat } from './entities/boat.entity';

describe('BoatsController', () => {
  let controller: BoatsController;
  let service: BoatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoatsController],
      providers: [
        {
          provide: BoatsService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            list: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BoatsController>(BoatsController);
    service = module.get<BoatsService>(BoatsService);
  });

  it('should create a boat', async () => {
    const boatDto = {
      name: 'Sea Breeze',
      type: 'Yacht',
      capacity: 10,
      location: 'Miami',
      ownerIds: ['owner123'],
    };
    const createdBoat = { ...boatDto, id: 'boat123' } as Boat;

    jest.spyOn(service, 'create').mockReturnValue(createdBoat);

    const result = await controller.create(boatDto);
    expect(result).toEqual(createdBoat);
    expect(service.create).toHaveBeenCalledWith(boatDto);
  });

  it('should find a boat by ID', async () => {
    const boat = {
      id: 'boat123',
      name: 'Sea Breeze',
      type: 'Yacht',
      capacity: 10,
      location: 'Miami',
      ownerIds: ['owner123'],
    } as Boat;

    jest.spyOn(service, 'findOne').mockReturnValue(boat);

    const result = await controller.findOne('boat123');
    expect(result).toEqual(boat);
    expect(service.findOne).toHaveBeenCalledWith('boat123');
  });

  it('should list all boats', async () => {
    const boats = [
      {
        id: 'boat1',
        name: 'Boat 1',
        type: 'Yacht',
        capacity: 10,
        location: 'Miami',
        ownerIds: ['owner123'],
      } as Boat,
      {
        id: 'boat2',
        name: 'Boat 2',
        type: 'Fishing Boat',
        capacity: 6,
        location: 'San Diego',
        ownerIds: ['owner456'],
      } as Boat,
    ];

    jest.spyOn(service, 'list').mockReturnValue(boats);

    const result = await controller.list();
    expect(result).toEqual(boats);
    expect(service.list).toHaveBeenCalled();
  });

  it('should delete a boat', async () => {
    jest.spyOn(service, 'delete').mockReturnValue(true);

    const result = await controller.delete('boat123');
    expect(result).toBe(true);
    expect(service.delete).toHaveBeenCalledWith('boat123');
  });
});
