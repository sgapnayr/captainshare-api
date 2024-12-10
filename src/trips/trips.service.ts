import { Injectable } from '@nestjs/common';
import { Trip } from './entities/trip.entity';

@Injectable()
export class TripsService {
  private trips: Trip[] = []; // In-memory storage

  create(trip: Partial<Trip>): Trip {
    // Check for overlapping trips for the same boat or captain
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

    const durationHours =
      (new Date(trip.endTime!).getTime() -
        new Date(trip.startTime!).getTime()) /
      3600000;

    // Hardcoding captain and owner rates for now
    const captainRate = 55; // Captain's rate per hour
    const totalTripPrice = 795; // Total trip cost
    const ownerRate = totalTripPrice - captainRate * durationHours;

    const captainEarnings = captainRate * durationHours;
    const ownerRevenue = ownerRate * durationHours;

    const captainFee = captainEarnings * 0.08;
    const ownerFee = ownerRevenue * 0.13;

    const netCaptainEarnings = captainEarnings - captainFee;
    const netOwnerRevenue = ownerRevenue - ownerFee;

    const newTrip: Trip = {
      ...trip,
      id: Date.now().toString(),
      durationHours,
      captainEarnings,
      ownerRevenue,
      captainFee,
      ownerFee,
      netCaptainEarnings,
      netOwnerRevenue,
      platformRevenue: captainFee + ownerFee,
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
}
