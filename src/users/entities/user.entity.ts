import { IsOptional } from 'class-validator';

export interface Availability {
  day: string; // e.g., 'Monday'
  startTime: string; // e.g., '08:00'
  endTime: string; // e.g., '18:00'
}

export class User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: 'CAPTAIN' | 'OWNER';
  isGovernmentIdVerified: boolean;
  @IsOptional()
  availability?: Availability[]; // Optional for owners, required for captains
  @IsOptional()
  ratePerHour?: number; // Optional for owners, required for captains
  certifications: string[]; // e.g., ['USCG', 'SailingCert']
}
