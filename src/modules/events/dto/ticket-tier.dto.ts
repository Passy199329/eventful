import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class TicketTierDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  capacity: number;
}