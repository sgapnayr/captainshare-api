// src/trips/entities/trip.entity.ts
export class Trip {
  id: string;
  boatId: string;
  captainId: string;
  ownerId: string;
  startTime: Date;
  endTime: Date;
  status: 'PENDING' | 'ONGOING' | 'COMPLETED' | 'CANCELED';
  durationHours?: number;
  captainEarnings?: number;
  ownerRevenue?: number;
  captainFee?: number;
  ownerFee?: number;
  netCaptainEarnings?: number;
  netOwnerRevenue?: number;
  platformRevenue?: number;
  captainRate?: number; // Rate per hour for captain
  ownerRate?: number; // Rate owner is willing to pay per hour
}
