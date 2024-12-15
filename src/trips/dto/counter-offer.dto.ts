import { IsUUID, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CounterOfferDto {
  @IsUUID()
  @IsNotEmpty()
  tripId: string;

  @IsNumber()
  @Min(0)
  counterRate: number;

  @IsUUID()
  @IsNotEmpty()
  offeredBy: string;
}
