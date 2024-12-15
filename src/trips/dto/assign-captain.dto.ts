import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class AssignCaptainDto {
  @IsUUID()
  @IsNotEmpty()
  tripId: string;

  @IsUUID()
  @IsNotEmpty()
  captainId: string;

  @IsString()
  @IsNotEmpty()
  assignedBy: string;
}
