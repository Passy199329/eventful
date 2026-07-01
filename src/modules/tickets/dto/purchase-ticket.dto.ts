import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class PurchaseTicketDto {

  @IsString()
  @IsNotEmpty()
  eventId: string;

  @IsString()
  @IsNotEmpty()
  ticketType: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}