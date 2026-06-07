import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
  } from '@nestjs/common';
  
  import { NotificationsService }
  from './notifications.service';
  
  import { JwtAuthGuard }
  from '../auth/guards/jwt-auth.guard';
  
  import { CurrentUser }
  from '../auth/decorators/current-user.decorator';
  
  import { SetReminderDto }
  from './dto/set-reminder.dto';
  
  @Controller('notifications')
  export class NotificationsController {
  
    constructor(
      private readonly notificationsService:
        NotificationsService,
    ) {}
  
    @Post('reminder')
    @UseGuards(JwtAuthGuard)
    setReminder(
  
      @CurrentUser()
      user: any,
  
      @Body()
      dto: SetReminderDto,
    ) {
  
      return this.notificationsService
        .setReminder(
          user.sub,
          dto,
        );
    }
  
    @Get()
    @UseGuards(JwtAuthGuard)
    getMyNotifications(
      @CurrentUser()
      user: any,
    ) {
  
      return this.notificationsService
        .getMyNotifications(
          user.sub,
        );
    }
  }