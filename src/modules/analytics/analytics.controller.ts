import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
  } from '@nestjs/common';
  
  import { AnalyticsService }
  from './analytics.service';
  
  @Controller('analytics')
  export class AnalyticsController {
  
    constructor(
      private readonly analyticsService:
        AnalyticsService,
    ) {}
  
    @Post()
    createAnalytics(
      @Body()
      body: any,
    ) {
  
      return this.analyticsService
        .createAnalytics(body);
    }
  
    @Get()
    getAllAnalytics() {
  
      return this.analyticsService
        .getAllAnalytics();
    }
  
    @Get(':eventId')
    getEventAnalytics(
      @Param('eventId')
      eventId: string,
    ) {
  
      return this.analyticsService
        .getEventAnalytics(
          eventId,
        );
    }
  
    @Patch(':eventId')
    updateAnalytics(
  
      @Param('eventId')
      eventId: string,
  
      @Body()
      body: any,
    ) {
  
      return this.analyticsService
        .updateAnalytics(
          eventId,
          body,
        );
    }
  }