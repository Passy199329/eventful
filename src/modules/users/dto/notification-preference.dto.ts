import {
    IsBoolean,
    IsOptional,
  } from 'class-validator';
  
  export class NotificationPreferenceDto {
  
    @IsOptional()
    @IsBoolean()
    emailNotifications?: boolean;
  
    @IsOptional()
    @IsBoolean()
    smsNotifications?: boolean;
  
    @IsOptional()
    @IsBoolean()
    pushNotifications?: boolean;
  }