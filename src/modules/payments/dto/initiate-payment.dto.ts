import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
  } from 'class-validator';
  
  export class InitiatePaymentDto {
  
    @IsString()
    @IsNotEmpty()
    ticketId: string;
  
    @IsEmail()
    email: string;
  
    @IsNumber()
    amount: number;
  }