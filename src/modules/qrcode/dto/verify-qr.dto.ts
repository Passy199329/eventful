import {
    IsNotEmpty,
    IsString,
  } from 'class-validator';
  
  export class VerifyQrDto {
  
    @IsString()
    @IsNotEmpty()
    ticketId: string;
  }