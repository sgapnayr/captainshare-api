// src/trips/trips.service.ts
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
        new Date(existingTrip.startTime) < new Date(trip.endTime) &&
        new Date(existingTrip.endTime) > new Date(trip.startTime),
    );

    if (overlappingTrip) {
      throw new Error('Captain or boat is already booked during this time.');
    }

    const newTrip: Trip = { ...trip, id: Date.now().toString() } as Trip;
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
    const tripIndex = this.trips.findIndex((trip) => trip.id === id);
    if (tripIndex === -1) {
      throw new Error('Trip not found.');
    }

    const updatedTrip = { ...this.trips[tripIndex], ...updateData };
    this.trips[tripIndex] = updatedTrip;
    return updatedTrip;
  }
}
