// src/trips/entities/trip.entity.ts
export class Trip {
  id: string; // Unique ID
  boatId: string; // Reference to a Boat
  captainId: string; // Reference to a Captain
  ownerId: string; // Reference to an Owner
  startTime: Date; // Always use Date for time-related fields
  endTime: Date; // Always use Date for time-related fields
  status: 'PENDING' | 'ONGOING' | 'COMPLETED' | 'CANCELED'; // Enum for trip status
}
