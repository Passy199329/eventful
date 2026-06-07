import {
    IsNotEmpty,
    IsNumber,
    IsString,
  } from 'class-validator';
  
  export class CreateTicketTypeDto {
  
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsNumber()
    price: number;
  
    @IsNumber()
    quantity: number;
  
    @IsString()
    @IsNotEmpty()
    eventId: string;
  }