import { IsString, IsObject } from 'class-validator';

export class WebhookPayloadDto {

  @IsString()
  event: string;

  @IsObject()
  data: any;
}