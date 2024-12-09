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
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000),
      status: 'PENDING' as 'PENDING' | 'ONGOING' | 'COMPLETED' | 'CANCELED',
    };

    const createdTrip = { ...tripDto, id: 'trip123' } as Trip;

    service.create.mockReturnValue(createdTrip); // Use mockReturnValue for synchronous methods

    const result = await controller.create(tripDto);
    expect(result).toEqual(createdTrip);
    expect(service.create).toHaveBeenCalledWith(tripDto);
  });

  it('should find a trip by ID', async () => {
    const trip = {
      id: 'trip123',
      boatId: 'boat123',
      captainId: 'captain123',
      ownerId: 'owner123',
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000),
      status: 'PENDING',
    } as Trip;

    service.findOne.mockReturnValue(trip);

    const result = await controller.findOne('trip123');
    expect(result).toEqual(trip);
    expect(service.findOne).toHaveBeenCalledWith('trip123');
  });
});
