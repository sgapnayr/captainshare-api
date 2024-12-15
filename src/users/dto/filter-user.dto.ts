import { IsOptional, IsBoolean, IsIn, IsNumber } from 'class-validator';

export class FilterUsersDto {
  @IsOptional()
  @IsIn(['CAPTAIN', 'OWNER', 'ADMIN'], { each: true })
  roles?: ('CAPTAIN' | 'OWNER' | 'ADMIN')[];

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
