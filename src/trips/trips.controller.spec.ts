import { Test, TestingModule } from '@nestjs/testing';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { Trip } from './entities/trip.entity';
import {
  DEFAULT_CAPTAIN_RATE,
  DEFAULT_TOTAL_PRICE,
  CAPTAIN_FEE_PERCENTAGE,
  OWNER_FEE_PERCENTAGE,
  DEFAULT_CAPTAIN_SHARE,
} from './trips.constants';

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

  it('should create an owner trip correctly', async () => {
    const tripDto = {
      boatId: 'boat123',
      captainId: 'captain123',
      ownerId: 'owner123',
      startTime: new Date('2024-12-15T09:00:00.000Z'),
      endTime: new Date('2024-12-15T12:00:00.000Z'),
      status: 'PENDING' as const,
      tripType: 'OWNER_TRIP' as const,
    };

    const durationHours = 3;
    const rawCost = DEFAULT_CAPTAIN_RATE * durationHours;
    const ownerFee = rawCost * OWNER_FEE_PERCENTAGE;
    const captainFee = rawCost * CAPTAIN_FEE_PERCENTAGE;

    const createdTrip: Trip = {
      ...tripDto,
      id: 'trip123',
      startTime: new Date(tripDto.startTime),
      endTime: new Date(tripDto.endTime),
      durationHours,
      captainRate: DEFAULT_CAPTAIN_RATE,
      captainEarnings: rawCost, // $55/hour * 3 hours
      ownerRevenue: 0, // Owners don't earn in OWNER_TRIP
      captainFee,
      ownerFee,
      netCaptainEarnings: rawCost - captainFee,
      netOwnerRevenue: 0,
      platformRevenue: ownerFee + captainFee,
      totalCostToOwner: rawCost + ownerFee,
      tripType: 'OWNER_TRIP',
    };

    service.create.mockReturnValue(createdTrip);

    const result = await controller.create(tripDto);
    expect(result.startTime).toBeInstanceOf(Date);
    expect(result.endTime).toBeInstanceOf(Date);
    expect(result.durationHours).toBe(durationHours);
    expect(result.captainEarnings).toBeCloseTo(rawCost);
    expect(result.ownerRevenue).toBe(0);
    expect(result.captainFee).toBeCloseTo(captainFee);
    expect(result.ownerFee).toBeCloseTo(ownerFee);
    expect(result.netCaptainEarnings).toBeCloseTo(rawCost - captainFee);
    expect(result.netOwnerRevenue).toBe(0);
    expect(result.platformRevenue).toBeCloseTo(ownerFee + captainFee);
    expect(result.totalCostToOwner).toBeCloseTo(rawCost + ownerFee);
  });

  it('should create a leased trip correctly', async () => {
    const tripDto = {
      boatId: 'boat123',
      captainId: 'captain123',
      ownerId: 'owner123',
      startTime: new Date('2024-12-15T09:00:00.000Z'),
      endTime: new Date('2024-12-15T12:00:00.000Z'),
      status: 'PENDING' as const,
      tripType: 'LEASED_TRIP' as const,
      captainShare: DEFAULT_CAPTAIN_SHARE,
    };

    const createdTrip: Trip = {
      ...tripDto,
      id: 'trip124',
      startTime: new Date(tripDto.startTime),
      endTime: new Date(tripDto.endTime),
      durationHours: 3,
      captainRate: DEFAULT_CAPTAIN_RATE,
      totalPrice: DEFAULT_TOTAL_PRICE,
      captainEarnings: DEFAULT_TOTAL_PRICE * DEFAULT_CAPTAIN_SHARE,
      ownerRevenue: DEFAULT_TOTAL_PRICE * (1 - DEFAULT_CAPTAIN_SHARE),
      captainFee:
        DEFAULT_TOTAL_PRICE * DEFAULT_CAPTAIN_SHARE * CAPTAIN_FEE_PERCENTAGE,
      ownerFee:
        DEFAULT_TOTAL_PRICE *
        (1 - DEFAULT_CAPTAIN_SHARE) *
        OWNER_FEE_PERCENTAGE,
      netCaptainEarnings:
        DEFAULT_TOTAL_PRICE * DEFAULT_CAPTAIN_SHARE -
        DEFAULT_TOTAL_PRICE * DEFAULT_CAPTAIN_SHARE * CAPTAIN_FEE_PERCENTAGE,
      netOwnerRevenue:
        DEFAULT_TOTAL_PRICE * (1 - DEFAULT_CAPTAIN_SHARE) -
        DEFAULT_TOTAL_PRICE *
          (1 - DEFAULT_CAPTAIN_SHARE) *
          OWNER_FEE_PERCENTAGE,
      platformRevenue:
        DEFAULT_TOTAL_PRICE * DEFAULT_CAPTAIN_SHARE * CAPTAIN_FEE_PERCENTAGE +
        DEFAULT_TOTAL_PRICE *
          (1 - DEFAULT_CAPTAIN_SHARE) *
          OWNER_FEE_PERCENTAGE,
      tripType: 'LEASED_TRIP',
    };

    service.create.mockReturnValue(createdTrip);

    const result = await controller.create(tripDto);
    expect(result.startTime).toBeInstanceOf(Date);
    expect(result.endTime).toBeInstanceOf(Date);
    expect(result.durationHours).toBe(3);
    expect(result.captainEarnings).toBeCloseTo(
      DEFAULT_TOTAL_PRICE * DEFAULT_CAPTAIN_SHARE,
    );
    expect(result.ownerRevenue).toBeCloseTo(
      DEFAULT_TOTAL_PRICE * (1 - DEFAULT_CAPTAIN_SHARE),
    );
    expect(result.captainFee).toBeCloseTo(
      DEFAULT_TOTAL_PRICE * DEFAULT_CAPTAIN_SHARE * CAPTAIN_FEE_PERCENTAGE,
    );
    expect(result.ownerFee).toBeCloseTo(
      DEFAULT_TOTAL_PRICE * (1 - DEFAULT_CAPTAIN_SHARE) * OWNER_FEE_PERCENTAGE,
    );
    expect(result.netCaptainEarnings).toBeCloseTo(
      DEFAULT_TOTAL_PRICE * DEFAULT_CAPTAIN_SHARE -
        DEFAULT_TOTAL_PRICE * DEFAULT_CAPTAIN_SHARE * CAPTAIN_FEE_PERCENTAGE,
    );
    expect(result.netOwnerRevenue).toBeCloseTo(
      DEFAULT_TOTAL_PRICE * (1 - DEFAULT_CAPTAIN_SHARE) -
        DEFAULT_TOTAL_PRICE *
          (1 - DEFAULT_CAPTAIN_SHARE) *
          OWNER_FEE_PERCENTAGE,
    );
    expect(result.platformRevenue).toBeCloseTo(
      DEFAULT_TOTAL_PRICE * DEFAULT_CAPTAIN_SHARE * CAPTAIN_FEE_PERCENTAGE +
        DEFAULT_TOTAL_PRICE *
          (1 - DEFAULT_CAPTAIN_SHARE) *
          OWNER_FEE_PERCENTAGE,
    );
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
        durationHours: 3,
      },
      {
        id: 'trip2',
        boatId: 'boat456',
        captainId: 'captain456',
        status: 'ONGOING',
        durationHours: 2,
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
