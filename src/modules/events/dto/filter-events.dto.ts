import {
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class FilterEventsDto {
  
    @IsOptional()
    @IsString()
    search?: string;
  
    @IsOptional()
    @IsString()
    location?: string;
  }