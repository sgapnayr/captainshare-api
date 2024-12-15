import { IsArray, IsString } from 'class-validator';

export class PreferredCaptainsDto {
  @IsArray()
  @IsString({ each: true })
  captains: string[];
}
