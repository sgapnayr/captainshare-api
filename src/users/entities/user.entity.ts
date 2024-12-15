import { IsArray, IsIn, IsBoolean, IsEmail } from 'class-validator';

export interface Availability {
  day: string;
  startTime: string;
  endTime: string;
  isRecurring?: boolean;
  timezone?: string;
}

export class User {
  id: string;
  firstName: string;
  lastName: string;

  @IsEmail()
  email: string;

  phoneNumber: string;

  @IsArray()
  @IsIn(['CAPTAIN', 'OWNER', 'ADMIN'], { each: true })
  roles: ('CAPTAIN' | 'OWNER' | 'ADMIN')[];

  isGovernmentIdVerified: boolean;

  @IsBoolean()
  isEmailVerified: boolean;

  onboardingComplete: boolean;

  availability?: Availability[];
  ratePerHour?: number;
  userLocation?: string;
  certifications?: string[];
  preferredBoatTypes?: string[];
  preferredCaptains?: string[];

  averageRating?: number;
  totalReviews?: number;

  referredBy?: string;
  referralCode?: string;

  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;
  lastLogin?: Date;

  isCaptain(): boolean {
    return this.roles.includes('CAPTAIN');
  }

  isOwner(): boolean {
    return this.roles.includes('OWNER');
  }

  isAdmin(): boolean {
    return this.roles.includes('ADMIN');
  }
}
