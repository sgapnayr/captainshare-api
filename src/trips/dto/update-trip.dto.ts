import {
  IsUUID,
  IsOptional,
  IsDate,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class UpdateTripDto {
  @IsUUID()
  @IsNotEmpty()
  tripId: string;

  @IsOptional()
  @IsDate()
  startTime?: Date;

  @IsOptional()
  @IsDate()
  endTime?: Date;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  cancellationReason?: string;
}
