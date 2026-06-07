import {
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class CreateEventDto {
  
    @IsString()
    @IsNotEmpty()
    title: string;
  
    @IsString()
    @IsNotEmpty()
    description: string;
  
    @IsString()
    @IsNotEmpty()
    location: string;
  
    @IsDateString()
    startDate: Date;
  
    @IsDateString()
    endDate: Date;
  
    @IsNumber()
    price: number;
  
    @IsOptional()
    @IsString()
    bannerImage?: string;
  }