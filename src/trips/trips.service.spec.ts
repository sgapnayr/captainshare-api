import { Test, TestingModule } from '@nestjs/testing';
import { TripsService } from './trips.service';
import { Trip } from './entities/trip.entity';

describe('TripsService', () => {
  let service: TripsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TripsService],
    }).compile();

    service = module.get<TripsService>(TripsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a trip', () => {
    const trip: Partial<Trip> = {
      boatId: 'boat123',
      captainId: 'captain123',
      ownerId: 'owner123',
      startTime: new Date('2024-12-15T09:00:00.000Z'),
      endTime: new Date('2024-12-15T12:00:00.000Z'),
      status: 'PENDING' as 'PENDING' | 'ONGOING' | 'COMPLETED' | 'CANCELED',
    };

    const createdTrip = service.create(trip);
    expect(createdTrip.startTime).toBeInstanceOf(Date);
    expect(createdTrip.endTime).toBeInstanceOf(Date);
  });

  it('should find a trip by ID', () => {
    const trip = service.create({
      boatId: 'boat123',
      captainId: 'captain123',
      ownerId: 'owner123',
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000),
      status: 'PENDING' as 'PENDING' | 'ONGOING' | 'COMPLETED' | 'CANCELED',
    });

    const foundTrip = service.findOne(trip.id);
    expect(foundTrip).toEqual(trip);
  });

  it('should list all trips', () => {
    service.create({
      boatId: 'boat123',
      captainId: 'captain123',
      ownerId: 'owner123',
      startTime: new Date(),
      endTime: new Date(),
      status: 'PENDING' as 'PENDING' | 'ONGOING' | 'COMPLETED' | 'CANCELED',
    });

    service.create({
      boatId: 'boat456',
      captainId: 'captain456',
      ownerId: 'owner456',
      startTime: new Date(),
      endTime: new Date(),
      status: 'PENDING' as 'PENDING' | 'ONGOING' | 'COMPLETED' | 'CANCELED',
    });

    const trips = service.list();
    expect(trips.length).toBe(2);
  });

  it('should update a trip status', () => {
    const trip = service.create({
      boatId: 'boat123',
      captainId: 'captain123',
      ownerId: 'owner123',
      startTime: new Date(),
      endTime: new Date(),
      status: 'PENDING' as 'PENDING' | 'ONGOING' | 'COMPLETED' | 'CANCELED',
    });

    const updatedTrip = service.update(trip.id, { status: 'ONGOING' });
    expect(updatedTrip?.status).toBe('ONGOING');
  });

  it.skip('should not allow booking outside captain availability', () => {
    const trip = {
      boatId: 'boat123',
      captainId: 'captain123',
      ownerId: 'owner123',
      startTime: new Date('2024-12-16T07:00:00.000Z'), // Monday, before available hours
      endTime: new Date('2024-12-16T09:00:00.000Z'),
      status: 'PENDING' as 'PENDING' | 'ONGOING' | 'COMPLETED' | 'CANCELED',
    };

    expect(() => service.create(trip)).toThrowError(
      'Captain is not available on Monday.',
    );
  });

  it.skip('should not allow double booking of a captain or boat', () => {
    service.create({
      boatId: 'boat123',
      captainId: 'captain123',
      ownerId: 'owner123',
      startTime: new Date('2024-12-15T09:00:00.000Z'),
      endTime: new Date('2024-12-15T12:00:00.000Z'),
      status: 'PENDING',
    });

    const overlappingTrip: Partial<Trip> = {
      boatId: 'boat123',
      captainId: 'captain123',
      ownerId: 'owner123',
      startTime: new Date('2024-12-15T10:00:00.000Z'),
      endTime: new Date('2024-12-15T13:00:00.000Z'),
      status: 'PENDING',
    };

    expect(() => service.create(overlappingTrip)).toThrowError(
      'Captain or boat is already booked during this time.',
    );
  });
});
