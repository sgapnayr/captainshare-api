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
}
