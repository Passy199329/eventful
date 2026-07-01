import {
    IsDateString,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsArray,
    ArrayMinSize,
    ValidateNested,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { TicketTierDto } from './ticket-tier.dto';
  
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
  
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => TicketTierDto)
    ticketTiers: TicketTierDto[];
  
    @IsOptional()
    @IsString()
    bannerImage?: string;
  }