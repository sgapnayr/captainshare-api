import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  IsNumber,
  ArrayUnique,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsArray()
  @ArrayUnique()
  roles: ('CAPTAIN' | 'OWNER' | 'ADMIN')[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  preferredBoatTypes?: string[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  certifications?: string[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  preferredCaptains?: string[];

  @IsOptional()
  @IsNumber()
  ratePerHour?: number;
}
