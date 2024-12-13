export interface Trip {
  id: string;
  boatId: string;
  captainId: string;
  ownerId: string;
  startTime: Date;
  endTime: Date;
  status: 'PENDING' | 'ONGOING' | 'COMPLETED' | 'CANCELED';
  tripType: 'OWNER_TRIP' | 'LEASED_TRIP';

  totalPrice?: number;
  captainShare?: number;
  ownerShare?: number;

  totalCostToOwner?: number;
  captainRate?: number;

  durationHours: number;
  captainEarnings: number;
  ownerRevenue: number;
  captainFee: number;
  ownerFee: number;
  netCaptainEarnings: number;
  netOwnerRevenue: number;
  platformRevenue: number;
}
