import {
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsString,
  IsDateString,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BookingType } from '../entities/trip.entity';

class LocationDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsOptional()
  @IsString()
  address?: string;
}

export class CreateTripDto {
  @IsUUID()
  @IsNotEmpty()
  boatId: string;

  @IsUUID()
  @IsNotEmpty()
  ownerId: string;

  @IsEnum(BookingType)
  @IsNotEmpty()
  bookingType: BookingType;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  counterRate?: number;
}
