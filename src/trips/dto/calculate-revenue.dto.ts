import { IsUUID, IsNotEmpty } from 'class-validator';

export class CalculateRevenueDto {
  @IsUUID()
  @IsNotEmpty()
  tripId: string;
}
