import { IsOptional } from 'class-validator';

export interface Availability {
  day: string;
  startTime: string;
  endTime: string;
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
  availability?: Availability[];

  @IsOptional()
  ratePerHour?: number;

  @IsOptional()
  userLocation?: string;

  certifications: string[];
}
