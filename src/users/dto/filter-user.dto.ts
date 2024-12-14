import { IsOptional, IsBoolean, IsIn } from 'class-validator';

export class FilterUsersDto {
  @IsOptional()
  @IsIn(['CAPTAIN', 'OWNER', 'ADMIN'], { each: true })
  roles?: ('CAPTAIN' | 'OWNER' | 'ADMIN')[];

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}
