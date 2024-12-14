import {
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredBoatTypes?: string[];

  @IsOptional()
  @IsNumber()
  ratePerHour?: number;

  @IsOptional()
  @IsString()
  userLocation?: string;

  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  onboardingComplete?: boolean;

  @IsOptional()
  @IsString()
  referredBy?: string;

  @IsOptional()
  @IsString()
  referralCode?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: ('CAPTAIN' | 'OWNER' | 'ADMIN')[];
}
