import { IsString } from 'class-validator';

export class AvailabilityDto {
  @IsString()
  day: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;
}
