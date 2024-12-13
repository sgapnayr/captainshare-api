import { Injectable } from '@nestjs/common';
import { Trip } from './entities/trip.entity';
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

@Injectable()
export class TripsService {
  private trips: Trip[] = [];

  private calculateOwnerTripRevenue(
    captainRate: number,
    durationHours: number,
  ) {
    const rawCost = round(captainRate * durationHours);
    const ownerFee = calculateFees(rawCost, OWNER_FEE_PERCENTAGE);
    const captainFee = calculateFees(rawCost, CAPTAIN_FEE_PERCENTAGE);
    const platformRevenue = round(ownerFee + captainFee);
    const totalCostToOwner = round(rawCost + ownerFee);

    return {
      captainEarnings: rawCost,
      ownerRevenue: 0,
      platformRevenue,
      totalCostToOwner,
    };
  }

  private calculateLeasedTripRevenue(
    totalTripPrice: number,
    captainShare: number,
  ) {
    const captainEarnings = totalTripPrice * captainShare;
    const ownerRevenue = totalTripPrice * (1 - captainShare);

    const captainFee = calculateFees(captainEarnings, CAPTAIN_FEE_PERCENTAGE);
    const ownerFee = calculateFees(ownerRevenue, OWNER_FEE_PERCENTAGE);

    const platformRevenue = captainFee + ownerFee;

    return {
      captainEarnings,
      ownerRevenue,
      platformRevenue,
      totalCostToOwner: totalTripPrice,
    };
  }

  create(trip: Partial<Trip>): Trip {
    const overlappingTrip = this.trips.find(
      (existingTrip) =>
        (existingTrip.boatId === trip.boatId ||
          existingTrip.captainId === trip.captainId) &&
        new Date(existingTrip.startTime!) < new Date(trip.endTime!) &&
        new Date(existingTrip.endTime!) > new Date(trip.startTime!),
    );

    if (overlappingTrip) {
      throw new Error('Captain or boat is already booked during this time.');
    }

    const durationHours = calculateDurationHours(
      new Date(trip.startTime!),
      new Date(trip.endTime!),
    );

    const captainRate = trip.captainRate || DEFAULT_CAPTAIN_RATE;
    const tripType = trip.tripType || DEFAULT_TRIP_TYPE;

    let captainEarnings = 0;
    let ownerRevenue = 0;
    let platformRevenue = 0;
    let totalCostToOwner = 0;

    if (tripType === 'OWNER_TRIP') {
      ({ captainEarnings, ownerRevenue, platformRevenue, totalCostToOwner } =
        this.calculateOwnerTripRevenue(captainRate, durationHours));
    } else if (tripType === 'LEASED_TRIP') {
      ({ captainEarnings, ownerRevenue, platformRevenue, totalCostToOwner } =
        this.calculateLeasedTripRevenue(
          trip.totalPrice || DEFAULT_TOTAL_PRICE,
          trip.captainShare || DEFAULT_CAPTAIN_SHARE,
        ));
    } else {
      throw new Error(`Invalid trip type: ${tripType}.`);
    }

    const netCaptainEarnings =
      captainEarnings - calculateFees(captainEarnings, CAPTAIN_FEE_PERCENTAGE);
    const netOwnerRevenue =
      ownerRevenue > 0
        ? ownerRevenue - calculateFees(ownerRevenue, OWNER_FEE_PERCENTAGE)
        : 0;

    const newTrip: Trip = {
      ...trip,
      id: Date.now().toString(),
      durationHours,
      captainEarnings,
      ownerRevenue,
      captainFee: calculateFees(captainEarnings, CAPTAIN_FEE_PERCENTAGE),
      ownerFee: calculateFees(ownerRevenue, OWNER_FEE_PERCENTAGE),
      netCaptainEarnings,
      netOwnerRevenue,
      platformRevenue,
      totalCostToOwner,
    } as Trip;

    this.trips.push(newTrip);
    return newTrip;
  }

  findOne(id: string): Trip | undefined {
    return this.trips.find((trip) => trip.id === id);
  }

  list(): Trip[] {
    return this.trips;
  }

  update(id: string, updateData: Partial<Trip>): Trip | undefined {
    const allowedStatuses: Trip['status'][] = [
      'PENDING',
      'ONGOING',
      'COMPLETED',
      'CANCELED',
    ];

    if (updateData.status && !allowedStatuses.includes(updateData.status)) {
      throw new Error(`Invalid status: ${updateData.status}.`);
    }

    const tripIndex = this.trips.findIndex((trip) => trip.id === id);
    if (tripIndex === -1) {
      throw new Error('Trip not found.');
    }

    const updatedTrip = { ...this.trips[tripIndex], ...updateData };
    this.trips[tripIndex] = updatedTrip;
    return updatedTrip;
  }

  delete(id: string): void {
    const tripIndex = this.trips.findIndex((trip) => trip.id === id);
    if (tripIndex === -1) {
      throw new Error('Trip not found.');
    }
    this.trips.splice(tripIndex, 1);
  }
}
