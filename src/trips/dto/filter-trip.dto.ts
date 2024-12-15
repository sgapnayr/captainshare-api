import { IsOptional, IsEnum, IsUUID, IsDateString } from 'class-validator';
import { TripStatus, BookingType } from '../entities/trip.entity';

export class FilterTripDto {
  @IsOptional()
  @IsUUID()
  ownerId?: string;

  @IsOptional()
  @IsUUID()
  captainId?: string;

  @IsOptional()
  @IsEnum(TripStatus)
  status?: TripStatus;

  @IsOptional()
  @IsEnum(BookingType)
  bookingType?: BookingType;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  location?: {
    latitude: number;
    longitude: number;
  };
}
