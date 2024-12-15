import { Test, TestingModule } from '@nestjs/testing';
import { TripsService } from './trips.service';
import { Trip, BookingType, TripStatus } from './entities/trip.entity';
import {
  DEFAULT_TOTAL_PRICE,
  CAPTAIN_FEE_PERCENTAGE,
  OWNER_FEE_PERCENTAGE,
  DEFAULT_CAPTAIN_SHARE,
  round,
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
    it('should calculate the revenue correctly for owner trips', () => {
      const captainRate = 100;
      const durationHours = 5;

      const rawCost = captainRate * durationHours;
      const ownerFee = rawCost * OWNER_FEE_PERCENTAGE;
      const captainFee = rawCost * CAPTAIN_FEE_PERCENTAGE;
      const platformRevenue = ownerFee + captainFee;
      const totalCostToOwner = rawCost + ownerFee;

      const result = service['calculateOwnerTripRevenue'](
        captainRate,
        durationHours,
      );

      expect(result.captainEarnings).toBe(rawCost);
      expect(result.ownerRevenue).toBe(0);
      expect(result.platformRevenue).toBe(platformRevenue);
      expect(result.totalCostToOwner).toBe(totalCostToOwner);
    });

    it('should return 0 owner revenue and correct platform revenue for a different captain rate', () => {
      const captainRate = 200;
      const durationHours = 3;

      const rawCost = captainRate * durationHours;
      const ownerFee = rawCost * OWNER_FEE_PERCENTAGE;
      const captainFee = rawCost * CAPTAIN_FEE_PERCENTAGE;
      const platformRevenue = ownerFee + captainFee;
      const totalCostToOwner = rawCost + ownerFee;

      const result = service['calculateOwnerTripRevenue'](
        captainRate,
        durationHours,
      );

      expect(result.captainEarnings).toBe(rawCost);
      expect(result.ownerRevenue).toBe(0);
      expect(result.platformRevenue).toBe(platformRevenue);
      expect(result.totalCostToOwner).toBe(totalCostToOwner);
    });
  });

  describe('Leased Trips', () => {
    it('should calculate revenue for leased trips correctly', () => {
      const trip: Partial<Trip> = {
        boatId: 'boat123',
        ownerId: 'owner123',
        timing: {
          startTime: new Date('2024-12-15T09:00:00.000Z'),
          endTime: new Date('2024-12-15T12:00:00.000Z'),
        },
        bookingType: BookingType.LEASED_TRIP,
        financialDetails: {
          captainShare: DEFAULT_CAPTAIN_SHARE,
          totalPrice: DEFAULT_TOTAL_PRICE,
        },
        location: {
          latitude: 25.7617,
          longitude: -80.1918,
        },
      };

      const createdTrip = service.create(trip);

      const captainEarnings = DEFAULT_TOTAL_PRICE * DEFAULT_CAPTAIN_SHARE;
      const ownerRevenue = DEFAULT_TOTAL_PRICE * (1 - DEFAULT_CAPTAIN_SHARE);

      const expectedPlatformRevenue =
        captainEarnings * CAPTAIN_FEE_PERCENTAGE +
        ownerRevenue * OWNER_FEE_PERCENTAGE;

      expect(createdTrip.timing.durationHours).toBe(3);

      expect(
        round(createdTrip.financialDetails.netCaptainEarnings),
      ).toBeCloseTo(round(captainEarnings), 2);

      expect(round(createdTrip.financialDetails.netOwnerRevenue)).toBeCloseTo(
        round(ownerRevenue),
        2,
      );

      expect(round(createdTrip.financialDetails.platformRevenue)).toBeCloseTo(
        round(expectedPlatformRevenue),
        2,
      );
    });
  });

  describe('Finding Trips', () => {
    it('should return a trip by ID', () => {
      const trip: Trip = {
        id: 'trip123',
        boatId: 'boat123',
        ownerId: 'owner123',
        status: TripStatus.PROPOSED,
        timing: {
          startTime: new Date('2024-12-15T09:00:00.000Z'),
          endTime: new Date('2024-12-15T12:00:00.000Z'),
        },
        bookingType: BookingType.OWNER_TRIP,
        location: {
          latitude: 25.7617,
          longitude: -80.1918,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service['trips'].push(trip);

      const result = service.findOne('trip123');
      expect(result).toEqual(trip);
    });

    it('should throw an error if trip ID is not found', () => {
      expect(() => service.findOne('invalid-id')).toThrowError(
        'Trip not found.',
      );
    });
  });

  describe('Update Status', () => {
    it('should update trip status correctly', () => {
      const trip: Trip = {
        id: 'trip123',
        boatId: 'boat123',
        ownerId: 'owner123',
        timing: {
          startTime: new Date('2024-12-15T09:00:00.000Z'),
          endTime: new Date('2024-12-15T12:00:00.000Z'),
        },
        status: TripStatus.PROPOSED,
        bookingType: BookingType.OWNER_TRIP,
        location: {
          latitude: 25.7617,
          longitude: -80.1918,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service['trips'].push(trip);

      const updatedTrip = service.updateStatus('trip123', {
        status: TripStatus.ACCEPTED,
        tripId: '',
        updatedBy: '',
      });

      expect(updatedTrip.status).toBe(TripStatus.ACCEPTED);
    });

    it('should throw an error if trip status is invalid', () => {
      const trip: Trip = {
        id: 'trip123',
        boatId: 'boat123',
        ownerId: 'owner123',
        timing: {
          startTime: new Date('2024-12-15T09:00:00.000Z'),
          endTime: new Date('2024-12-15T12:00:00.000Z'),
        },
        status: TripStatus.PROPOSED,
        bookingType: BookingType.OWNER_TRIP,
        location: {
          latitude: 25.7617,
          longitude: -80.1918,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service['trips'].push(trip);

      expect(() =>
        service.updateStatus('trip123', {
          status: 'INVALID_STATUS' as any,
          tripId: '',
          updatedBy: '',
        }),
      ).toThrowError('Invalid status: INVALID_STATUS.');
    });
  });
});
