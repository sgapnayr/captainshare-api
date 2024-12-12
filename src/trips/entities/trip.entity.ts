export interface Trip {
  id: string;
  boatId: string;
  captainId: string;
  ownerId: string;
  startTime: Date;
  endTime: Date;
  status: 'PENDING' | 'ONGOING' | 'COMPLETED' | 'CANCELED';
  tripType: 'OWNER_TRIP' | 'LEASED_TRIP';

  // Applicable for LEASED_TRIP only
  totalPrice?: number; // Total trip price paid by customers (leased trips)
  captainShare?: number; // Percentage of total price for the captain
  ownerShare?: number; // Percentage of total price for the owner

  // Applicable for OWNER_TRIP only
  totalCostToOwner?: number; // Total cost paid by the owner (captainRate * durationHours + platform fee)
  captainRate?: number; // Hourly rate for captains

  // Common fields
  durationHours: number; // Total duration of the trip
  captainEarnings: number; // Earnings for the captain
  ownerRevenue: number; // Earnings for the owner (leased trips only)
  captainFee: number; // Platform fee taken from captain earnings
  ownerFee: number; // Platform fee taken from owner revenue (leased trips only)
  netCaptainEarnings: number; // Final earnings for the captain after fees
  netOwnerRevenue: number; // Final earnings for the owner after fees (leased trips only)
  platformRevenue: number; // Total revenue earned by the platform
}
