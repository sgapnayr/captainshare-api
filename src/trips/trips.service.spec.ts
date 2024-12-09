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
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000), // 1 hour later
      status: 'PENDING',
    };

    const createdTrip = service.create(trip);
    expect(createdTrip).toMatchObject(trip);
    expect(createdTrip.id).toBeDefined();
  });

  it('should find a trip by ID', () => {
    const trip = service.create({
      boatId: 'boat123',
      captainId: 'captain123',
      ownerId: 'owner123',
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000), // 1 hour later
      status: 'PENDING',
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
      status: 'PENDING',
    });

    service.create({
      boatId: 'boat456',
      captainId: 'captain456',
      ownerId: 'owner456',
      startTime: new Date(),
      endTime: new Date(),
      status: 'PENDING',
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
      status: 'PENDING',
    });

    const updatedTrip = service.update(trip.id, { status: 'ONGOING' });
    expect(updatedTrip?.status).toBe('ONGOING');
  });
});
