import {
    Controller,
    Get,
    Param,
    Query,
  } from '@nestjs/common';
  
  import { SharingService }
  from './sharing.service';
  
  @Controller('sharing')
  export class SharingController {
  
    constructor(
      private readonly sharingService:
        SharingService,
    ) {}
  
    @Get(':eventId/link')
    generateLink(
  
      @Param('eventId')
      eventId: string,
    ) {
  
      return this.sharingService
        .generateEventShareLink(
          eventId,
        );
    }
  
    @Get(':eventId/social')
    shareToSocialMedia(
  
      @Param('eventId')
      eventId: string,
  
      @Query('platform')
      platform: string,
    ) {
  
      return this.sharingService
        .shareToSocialMedia(
          platform,
          eventId,
        );
    }
  }