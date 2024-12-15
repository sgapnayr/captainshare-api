import {
  IsString,
  IsIn,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  Matches,
} from 'class-validator';

export class CreateBoatDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsNumber()
  capacity: number;

  @IsString()
  location: string;

  @IsArray()
  @IsString({ each: true })
  licenseRequired: string[];

  @IsArray()
  @IsString({ each: true })
  captainShareCertificationsRequired: string[];

  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  year: number;

  @IsString()
  color: string;

  @IsNumber()
  rateWillingToPay: number;

  @IsString()
  @IsIn(['OWNER', 'ADMIN'])
  userRole: string;

  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Z0-9]{12}$/, {
    message: 'HIN must be 12 alphanumeric characters.',
  })
  hin?: string;

  @IsOptional()
  @IsString()
  motorDetails?: string;

  @IsOptional()
  @IsBoolean()
  commercialUse?: boolean;
}
