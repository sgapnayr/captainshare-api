import {
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AvailabilityDto } from './availability.dto';

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

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredCaptains?: string[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AvailabilityDto)
  availability?: AvailabilityDto[];
}
