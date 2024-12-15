import { IsUUID, IsNotEmpty, IsEnum } from 'class-validator';
import { TripStatus } from '../entities/trip.entity';

export class UpdateTripStatusDto {
  @IsUUID()
  @IsNotEmpty()
  tripId: string;

  @IsEnum(TripStatus)
  @IsNotEmpty()
  status: TripStatus;

  @IsNotEmpty()
  @IsUUID()
  updatedBy: string;
}
