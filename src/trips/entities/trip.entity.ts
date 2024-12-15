export enum TripStatus {
  PROPOSED = 'PROPOSED',
  ACCEPTED = 'ACCEPTED',
  GROUP_ON = 'GROUP_ON',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  REJECTED = 'REJECTED',
}

export enum BookingType {
  OWNER_TRIP = 'OWNER_TRIP',
  LEASED_TRIP = 'LEASED_TRIP',
}

export interface FinancialDetails {
  totalPrice?: number;
  captainRate?: number;
  ownerShare?: number;
  captainShare?: number;
  totalCostToOwner?: number;

  captainFee?: number;
  ownerFee?: number;
  netCaptainEarnings?: number;
  netOwnerRevenue?: number;
  platformRevenue?: number;
}

export interface Timing {
  startTime?: Date;
  endTime?: Date;
  durationHours?: number;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Trip {
  id: string;
  boatId: string;
  captainId?: string;
  ownerId: string;

  status: TripStatus;
  bookingType: BookingType;

  financialDetails?: FinancialDetails;
  timing?: Timing;

  counterRate?: number;
  cancellationReason?: string;
  notes?: string;

  location?: Location;

  createdAt: Date;
  updatedAt: Date;
}
