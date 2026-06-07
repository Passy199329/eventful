import {
    IsDateString,
    IsEnum,
    IsNotEmpty,
    IsString,
  } from 'class-validator';
  
  export class SetReminderDto {
  
    @IsString()
    @IsNotEmpty()
    eventId: string;
  
    @IsDateString()
    reminderDate: Date;
  
    @IsEnum([
      'email',
      'sms',
      'push',
    ])
    channel: string;
  
    @IsString()
    @IsNotEmpty()
    message: string;
  }