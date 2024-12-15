import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Trip, TripStatus, BookingType } from './entities/trip.entity';
import {
  CAPTAIN_FEE_PERCENTAGE,
  OWNER_FEE_PERCENTAGE,
  DEFAULT_CAPTAIN_RATE,
  DEFAULT_TOTAL_PRICE,
  DEFAULT_CAPTAIN_SHARE,
  DEFAULT_TRIP_TYPE,
  calculateDurationHours,
  calculateFees,
  round,
} from './trips.constants';
import { UpdateTripStatusDto } from './dto/update-trip-status.dto';
import { FilterTripDto } from './dto/filter-trip.dto';
import { AssignCaptainDto } from './dto/assign-captain.dto';

@Injectable()
export class TripsService {
  private trips: Trip[] = [];

  // Calculates revenue for owner trips
  private calculateOwnerTripRevenue(
    captainRate: number,
    durationHours: number,
  ) {
    const rawCost = round(captainRate * durationHours); // Round the raw cost
    const ownerFee = calculateFees(rawCost, OWNER_FEE_PERCENTAGE); // Calculate the owner's fee
    const captainFee = calculateFees(rawCost, CAPTAIN_FEE_PERCENTAGE); // Calculate the captain's fee
    const platformRevenue = round(ownerFee + captainFee); // Round the platform revenue
    const totalCostToOwner = round(rawCost + ownerFee); // Round the total cost to the owner

    return {
      captainEarnings: rawCost,
      ownerRevenue: 0, // No owner revenue in owner trips
      platformRevenue,
      totalCostToOwner,
    };
  }

  // Calculates revenue for leased trips
  private calculateLeasedTripRevenue(
    totalTripPrice: number,
    captainShare: number,
  ) {
    const captainEarnings = totalTripPrice * captainShare;
    const ownerRevenue = totalTripPrice * (1 - captainShare);

    const captainFee = calculateFees(captainEarnings, CAPTAIN_FEE_PERCENTAGE);
    const ownerFee = calculateFees(ownerRevenue, OWNER_FEE_PERCENTAGE);

    const platformRevenue = round(captainFee + ownerFee); // Round the platform revenue

    return {
      captainEarnings,
      ownerRevenue,
      platformRevenue,
      totalCostToOwner: totalTripPrice, // Total cost to owner is just the trip price
    };
  }

  // Create a new trip
  create(trip: Partial<Trip>): Trip {
    if (!trip.boatId || !trip.ownerId) {
      throw new BadRequestException('Boat ID and Owner ID are required.');
    }
    if (!trip.location?.latitude || !trip.location?.longitude) {
      throw new BadRequestException(
        'Valid location with latitude and longitude is required.',
      );
    }
    if (!trip.timing?.startTime || !trip.timing?.endTime) {
      throw new BadRequestException('Start and end times are required.');
    }
    if (new Date(trip.timing.startTime) >= new Date(trip.timing.endTime)) {
      throw new BadRequestException('Start time must be before end time.');
    }

    const durationHours = calculateDurationHours(
      new Date(trip.timing.startTime),
      new Date(trip.timing.endTime),
    );

    if (durationHours < 1) {
      throw new BadRequestException('Trip duration must be at least 1 hour.');
    }

    const overlappingTrip = this.trips.find(
      (existingTrip) =>
        (existingTrip.boatId === trip.boatId ||
          existingTrip.captainId === trip.captainId) &&
        new Date(existingTrip.timing.startTime!) <
          new Date(trip.timing.endTime!) &&
        new Date(existingTrip.timing.endTime!) >
          new Date(trip.timing.startTime!) &&
        existingTrip.location?.latitude === trip.location.latitude &&
        existingTrip.location?.longitude === trip.location.longitude,
    );

    if (overlappingTrip) {
      throw new BadRequestException(
        'Captain or boat is already booked during this time.',
      );
    }

    const captainRate =
      trip.financialDetails?.captainRate || DEFAULT_CAPTAIN_RATE;
    const bookingType = trip.bookingType || DEFAULT_TRIP_TYPE;

    // Use the appropriate revenue calculation based on the booking type
    const revenueDetails =
      bookingType === BookingType.OWNER_TRIP
        ? this.calculateOwnerTripRevenue(captainRate, durationHours)
        : this.calculateLeasedTripRevenue(
            trip.financialDetails?.totalPrice || DEFAULT_TOTAL_PRICE,
            trip.financialDetails?.captainShare || DEFAULT_CAPTAIN_SHARE,
          );

    // Create a new trip with the calculated details
    const newTrip: Trip = {
      ...revenueDetails,
      id: Date.now().toString(),
      status: TripStatus.PROPOSED,
      createdAt: new Date(),
      updatedAt: new Date(),
      boatId: trip.boatId,
      ownerId: trip.ownerId,
      captainId: trip.captainId || null,
      timing: {
        startTime: new Date(trip.timing.startTime),
        endTime: new Date(trip.timing.endTime),
        durationHours,
      },
      bookingType: bookingType as BookingType,
      location: trip.location,
      cancellationReason: trip.cancellationReason,
      notes: trip.notes,
      financialDetails: {
        captainShare: trip.financialDetails?.captainShare,
        captainRate,
        totalPrice: trip.financialDetails?.totalPrice,
        netCaptainEarnings: revenueDetails.captainEarnings,
        netOwnerRevenue: revenueDetails.ownerRevenue,
        platformRevenue: revenueDetails.platformRevenue,
        totalCostToOwner: revenueDetails.totalCostToOwner,
      },
    };

    // Save the new trip and return it
    this.trips.push(newTrip);
    return newTrip;
  }

  // Find a trip by its ID
  findOne(id: string): Trip {
    const trip = this.trips.find((trip) => trip.id === id);
    if (!trip) {
      throw new NotFoundException('Trip not found.');
    }
    return trip;
  }

  // Update the status of a trip
  updateStatus(id: string, updateTripStatusDto: UpdateTripStatusDto): Trip {
    const trip = this.findOne(id);

    const allowedStatuses: TripStatus[] = [
      TripStatus.PROPOSED,
      TripStatus.ACCEPTED,
      TripStatus.GROUP_ON,
      TripStatus.COMPLETED,
      TripStatus.CANCELED,
      TripStatus.REJECTED,
    ];

    if (!allowedStatuses.includes(updateTripStatusDto.status)) {
      throw new BadRequestException(
        `Invalid status: ${updateTripStatusDto.status}.`,
      );
    }

    trip.status = updateTripStatusDto.status;
    trip.updatedAt = new Date();

    return trip;
  }

  // Handle a counteroffer for a trip
  handleCounterOffer(tripId: string, counterRate: number): Trip {
    const trip = this.findOne(tripId);
    if (trip.status !== TripStatus.PROPOSED) {
      throw new BadRequestException(
        'Only proposed trips can have counteroffers.',
      );
    }
    trip.counterRate = counterRate;
    trip.updatedAt = new Date();
    return trip;
  }

  // Delete a trip
  delete(id: string): void {
    const tripIndex = this.trips.findIndex((trip) => trip.id === id);
    if (tripIndex === -1) {
      throw new NotFoundException('Trip not found.');
    }
    this.trips.splice(tripIndex, 1);
  }

  // Filter trips based on various criteria
  filter(filterDto: FilterTripDto): Trip[] {
    let filteredTrips = [...this.trips];

    if (filterDto.status) {
      filteredTrips = filteredTrips.filter(
        (trip) => trip.status === filterDto.status,
      );
    }

    if (filterDto.startDate && filterDto.endDate) {
      filteredTrips = filteredTrips.filter(
        (trip) =>
          new Date(trip.timing.startTime) >= new Date(filterDto.startDate) &&
          new Date(trip.timing.endTime) <= new Date(filterDto.endDate),
      );
    }

    if (filterDto.location) {
      filteredTrips = filteredTrips.filter(
        (trip) =>
          trip.location?.latitude === filterDto.location.latitude &&
          trip.location?.longitude === filterDto.location.longitude,
      );
    }

    return filteredTrips;
  }

  // Assign a captain to a trip
  assignCaptain(id: string, assignCaptainDto: AssignCaptainDto): Trip {
    const trip = this.findOne(id);

    if (trip.captainId) {
      throw new BadRequestException('Captain already assigned to this trip.');
    }

    trip.captainId = assignCaptainDto.captainId;
    trip.status = TripStatus.ACCEPTED;
    trip.updatedAt = new Date();

    return trip;
  }

  // Update trip data
  update(id: string, updateData: Partial<Trip>): Trip {
    const trip = this.findOne(id);

    if (updateData.status && trip.status !== TripStatus.PROPOSED) {
      throw new BadRequestException(
        'Cannot change status after the trip is accepted.',
      );
    }

    if (updateData.timing?.startTime && updateData.timing?.endTime) {
      if (
        new Date(updateData.timing.startTime) >=
        new Date(updateData.timing.endTime)
      ) {
        throw new BadRequestException('Start time must be before end time.');
      }
    }

    const updatedTrip = { ...trip, ...updateData, updatedAt: new Date() };
    this.trips = this.trips.map((t) => (t.id === id ? updatedTrip : t));

    return updatedTrip;
  }
}
