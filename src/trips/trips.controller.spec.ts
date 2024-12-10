import { Test, TestingModule } from '@nestjs/testing';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { Trip } from './entities/trip.entity';

describe('TripsController', () => {
  let controller: TripsController;
  let service: jest.Mocked<TripsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TripsController],
      providers: [
        {
          provide: TripsService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            list: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TripsController>(TripsController);
    service = module.get(TripsService) as jest.Mocked<TripsService>;
  });

  it('should create a trip', async () => {
    const tripDto = {
      boatId: 'boat123',
      captainId: 'captain123',
      ownerId: 'owner123',
      startTime: new Date('2024-12-15T09:00:00.000Z'),
      endTime: new Date('2024-12-15T12:00:00.000Z'),
      status: 'PENDING' as 'PENDING' | 'ONGOING' | 'COMPLETED' | 'CANCELED',
    };

    const createdTrip: Trip = {
      ...tripDto,
      id: 'trip123',
      startTime: new Date(tripDto.startTime),
      endTime: new Date(tripDto.endTime),
      status: 'PENDING', // Ensure status is one of the allowed values
    };

    service.create.mockReturnValue(createdTrip);

    const result = await controller.create(tripDto);
    expect(result.startTime).toBeInstanceOf(Date);
    expect(result.endTime).toBeInstanceOf(Date);
  });

  it('should find a trip by ID', async () => {
    const trip = {
      id: 'trip123',
      boatId: 'boat123',
      captainId: 'captain123',
      ownerId: 'owner123',
      startTime: new Date('2024-12-15T09:00:00.000Z'),
      endTime: new Date('2024-12-15T12:00:00.000Z'),
      status: 'PENDING',
    } as Trip;

    service.findOne.mockReturnValue(trip);

    const result = await controller.findOne('trip123');
    expect(result).toEqual(trip);
    expect(service.findOne).toHaveBeenCalledWith('trip123');
  });

  it('should list all trips', async () => {
    const trips = [
      {
        id: 'trip1',
        boatId: 'boat123',
        captainId: 'captain123',
        status: 'PENDING',
      },
      {
        id: 'trip2',
        boatId: 'boat456',
        captainId: 'captain456',
        status: 'ONGOING',
      },
    ] as Trip[];

    service.list.mockReturnValue(trips);

    const result = await controller.list();
    expect(result).toEqual(trips);
    expect(service.list).toHaveBeenCalled();
  });

  it('should update a trip', async () => {
    const tripUpdateDto: Partial<Trip> = { status: 'ONGOING' };
    const updatedTrip = { id: 'trip123', status: 'ONGOING' } as Trip;

    service.update.mockReturnValue(updatedTrip);

    const result = await controller.update('trip123', tripUpdateDto);
    expect(result).toEqual(updatedTrip);
    expect(service.update).toHaveBeenCalledWith('trip123', tripUpdateDto);
  });
});
