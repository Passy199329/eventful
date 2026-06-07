import {
    IsDateString,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class UpdateEventDto {
  
    @IsOptional()
    @IsString()
    title?: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsOptional()
    @IsString()
    location?: string;
  
    @IsOptional()
    @IsDateString()
    startDate?: Date;
  
    @IsOptional()
    @IsDateString()
    endDate?: Date;
  
    @IsOptional()
    @IsNumber()
    price?: number;
  
    @IsOptional()
    @IsString()
    bannerImage?: string;
  }