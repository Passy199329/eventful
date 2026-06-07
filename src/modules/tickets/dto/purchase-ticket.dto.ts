import {
    IsNotEmpty,
    IsNumber,
    IsString,
  } from 'class-validator';
  
  export class PurchaseTicketDto {
  
    @IsString()
    @IsNotEmpty()
    eventId: string;
  
    @IsString()
    @IsNotEmpty()
    ticketType: string;
  
    @IsNumber()
    quantity: number;
  }