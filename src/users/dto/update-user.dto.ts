import { IsString, IsArray, IsOptional, IsIn } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsArray()
  @IsIn(['CAPTAIN', 'OWNER', 'ADMIN'], { each: true })
  @IsOptional()
  roles?: ('CAPTAIN' | 'OWNER' | 'ADMIN')[];
}
