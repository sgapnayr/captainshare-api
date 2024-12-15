import {
  IsString,
  IsOptional,
  IsArray,
  IsObject,
  IsBoolean,
  Matches,
  ValidateIf,
} from 'class-validator';

export class AvailabilityDto {
  @IsString()
  @Matches(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/, {
    message: 'day must be a valid day of the week.',
  })
  day: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in HH:mm format.',
  })
  startTime: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'endTime must be in HH:mm format.',
  })
  endTime: string;

  @ValidateIf((o) => o.startTime && o.endTime)
  validateTimeRange() {
    const start = parseInt(this.startTime.replace(':', ''), 10);
    const end = parseInt(this.endTime.replace(':', ''), 10);
    return start < end || 'endTime must be greater than startTime.';
  }

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsArray()
  certifications?: string[];

  @IsOptional()
  @IsObject()
  rateRange?: { min: number; max: number };
}
