import { IsString, IsEmail, IsArray, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  phoneNumber: string;

  @IsArray()
  @IsIn(['CAPTAIN', 'OWNER', 'ADMIN'], { each: true })
  @IsOptional()
  roles?: ('CAPTAIN' | 'OWNER' | 'ADMIN')[];
}
