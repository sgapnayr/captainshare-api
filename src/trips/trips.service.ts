// src/trips/trips.service.ts
import { Injectable } from '@nestjs/common';
import { Trip } from './entities/trip.entity';

@Injectable()
export class TripsService {
  private trips: Trip[] = []; // In-memory storage

  create(trip: Partial<Trip>): Trip {
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
    if (tripIndex === -1) return undefined;

    const updatedTrip = { ...this.trips[tripIndex], ...updateData };
    this.trips[tripIndex] = updatedTrip;
    return updatedTrip;
  }
}
