// src/trips/trip.constants.ts

// Constants for fees and shares
export const CAPTAIN_FEE_PERCENTAGE = 0.08; // 8%
export const OWNER_FEE_PERCENTAGE = 0.13; // 13%
export const DEFAULT_CAPTAIN_RATE = 55; // $55/hour
export const DEFAULT_TOTAL_PRICE = 795; // $795
export const DEFAULT_CAPTAIN_SHARE = 0.3; // 30% for leased trips
export const DEFAULT_TRIP_TYPE = 'OWNER_TRIP'; // Default to owner trips

// Utility function to calculate duration in hours
export const calculateDurationHours = (
  startTime: Date,
  endTime: Date,
): number => {
  return (endTime.getTime() - startTime.getTime()) / 3600000;
};

export function calculateFees(amount: number, percentage: number): number {
  return round(amount * percentage, 4); // Keep intermediate precision higher
}

export function round(value: number, precision: number = 2): number {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
}

export function calculateOwnerTripRevenue(
  captainRate: number,
  durationHours: number,
) {
  const rawCost = round(captainRate * durationHours);
  const ownerFee = calculateFees(rawCost, OWNER_FEE_PERCENTAGE);
  const platformRevenue = round(
    ownerFee + calculateFees(rawCost, CAPTAIN_FEE_PERCENTAGE),
  );
  const totalCostToOwner = round(rawCost + ownerFee);

  return {
    captainEarnings: rawCost,
    ownerRevenue: 0,
    platformRevenue,
    totalCostToOwner,
  };
}

export function calculateLeasedTripRevenue(
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
