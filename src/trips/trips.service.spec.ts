import { Test, TestingModule } from '@nestjs/testing';
import { TripsService } from './trips.service';
import { Trip } from './entities/trip.entity';
import {
  DEFAULT_CAPTAIN_RATE,
  DEFAULT_TOTAL_PRICE,
  CAPTAIN_FEE_PERCENTAGE,
  OWNER_FEE_PERCENTAGE,
  DEFAULT_CAPTAIN_SHARE,
} from './trips.constants';

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

  describe('Owner Trips', () => {
    it('should calculate revenue for owner trips correctly', () => {
      const trip: Partial<Trip> = {
        boatId: 'boat123',
        captainId: 'captain123',
        ownerId: 'owner123',
        startTime: new Date('2024-12-15T09:00:00.000Z'),
        endTime: new Date('2024-12-15T12:00:00.000Z'),
        status: 'PENDING',
        tripType: 'OWNER_TRIP',
      };

      const createdTrip = service.create(trip);

      expect(createdTrip.durationHours).toBe(3); // 3-hour trip
      expect(createdTrip.captainEarnings).toBe(DEFAULT_CAPTAIN_RATE * 3); // $55/hour * 3
      expect(createdTrip.ownerRevenue).toBe(0); // Owner does not make revenue
      expect(createdTrip.captainFee).toBeCloseTo(
        DEFAULT_CAPTAIN_RATE * 3 * CAPTAIN_FEE_PERCENTAGE, // 8% of captain earnings
      );
      expect(createdTrip.ownerFee).toBeCloseTo(0); // No fee since owner doesn't make revenue
      expect(createdTrip.netCaptainEarnings).toBeCloseTo(
        DEFAULT_CAPTAIN_RATE * 3 -
          DEFAULT_CAPTAIN_RATE * 3 * CAPTAIN_FEE_PERCENTAGE, // Captain earnings after fee
      );
      expect(createdTrip.netOwnerRevenue).toBe(0); // Owner net revenue remains 0
      const durationHours = 3;
      const rawCost = DEFAULT_CAPTAIN_RATE * durationHours;
      const ownerFee = rawCost * OWNER_FEE_PERCENTAGE;
      const captainFee = rawCost * CAPTAIN_FEE_PERCENTAGE;
      const expectedPlatformRevenue = ownerFee + captainFee; // Corrected formula

      expect(createdTrip.platformRevenue).toBeCloseTo(expectedPlatformRevenue);
    });

    it('should throw an error for overlapping trips', () => {
      const trip: Partial<Trip> = {
        boatId: 'boat123',
        captainId: 'captain123',
        ownerId: 'owner123',
        startTime: new Date('2024-12-15T09:00:00.000Z'),
        endTime: new Date('2024-12-15T12:00:00.000Z'),
        status: 'PENDING',
        tripType: 'OWNER_TRIP',
      };

      service.create(trip);

      const overlappingTrip: Partial<Trip> = {
        boatId: 'boat123',
        captainId: 'captain123',
        ownerId: 'owner123',
        startTime: new Date('2024-12-15T10:00:00.000Z'),
        endTime: new Date('2024-12-15T13:00:00.000Z'),
        status: 'PENDING',
        tripType: 'OWNER_TRIP',
      };

      expect(() => service.create(overlappingTrip)).toThrowError(
        'Captain or boat is already booked during this time.',
      );
    });
  });

  describe('Leased Trips', () => {
    it('should calculate revenue for leased trips correctly', () => {
      const durationHours = 3;
      const trip: Partial<Trip> = {
        boatId: 'boat123',
        captainId: 'captain123',
        ownerId: 'owner123',
        startTime: new Date('2024-12-15T09:00:00.000Z'),
        endTime: new Date('2024-12-15T12:00:00.000Z'),
        status: 'PENDING',
        tripType: 'LEASED_TRIP',
        captainShare: DEFAULT_CAPTAIN_SHARE,
      };

      const createdTrip = service.create(trip);

      const captainEarnings = DEFAULT_TOTAL_PRICE * DEFAULT_CAPTAIN_SHARE;
      const ownerRevenue = DEFAULT_TOTAL_PRICE * (1 - DEFAULT_CAPTAIN_SHARE);
      const expectedPlatformRevenue =
        captainEarnings * CAPTAIN_FEE_PERCENTAGE +
        ownerRevenue * OWNER_FEE_PERCENTAGE;

      expect(createdTrip.durationHours).toBe(durationHours);
      expect(createdTrip.captainEarnings).toBeCloseTo(captainEarnings);
      expect(createdTrip.ownerRevenue).toBeCloseTo(ownerRevenue);
      expect(createdTrip.captainFee).toBeCloseTo(
        captainEarnings * CAPTAIN_FEE_PERCENTAGE,
      );
      expect(createdTrip.ownerFee).toBeCloseTo(
        ownerRevenue * OWNER_FEE_PERCENTAGE,
      );
      expect(createdTrip.netCaptainEarnings).toBeCloseTo(
        captainEarnings - captainEarnings * CAPTAIN_FEE_PERCENTAGE,
      );
      expect(createdTrip.netOwnerRevenue).toBeCloseTo(
        ownerRevenue - ownerRevenue * OWNER_FEE_PERCENTAGE,
      );
      expect(createdTrip.platformRevenue).toBeCloseTo(expectedPlatformRevenue);
    });

    it('should throw an error for invalid trip types', () => {
      const trip: Partial<Trip> = {
        boatId: 'boat123',
        captainId: 'captain123',
        ownerId: 'owner123',
        startTime: new Date('2024-12-15T09:00:00.000Z'),
        endTime: new Date('2024-12-15T12:00:00.000Z'),
        status: 'PENDING',
        tripType: 'INVALID_TYPE' as any,
      };

      expect(() => service.create(trip)).toThrowError(
        'Invalid trip type: INVALID_TYPE',
      );
    });
  });
});
