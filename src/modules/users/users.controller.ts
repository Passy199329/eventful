import {
    Body,
    Controller,
    Get,
    Patch,
    UseGuards,
  } from '@nestjs/common';
  
  import { UsersService }
  from './users.service';
  
  import { JwtAuthGuard }
  from '../auth/guards/jwt-auth.guard';
  
  import { CurrentUser }
  from '../auth/decorators/current-user.decorator';
  
  import { UpdateProfileDto }
  from './dto/update-profile.dto';
  
  import { NotificationPreferenceDto }
  from './dto/notification-preference.dto';
  
  @Controller('users')
  export class UsersController {
  
    constructor(
      private readonly usersService:
        UsersService,
    ) {}
  
    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(
      @CurrentUser() user: any,
    ) {
  
      return this.usersService
        .getProfile(user.sub);
    }
  
    @Patch('profile')
    @UseGuards(JwtAuthGuard)
    updateProfile(
  
      @CurrentUser() user: any,
  
      @Body()
      dto: UpdateProfileDto,
    ) {
  
      return this.usersService
        .updateProfile(
          user.sub,
          dto,
        );
    }
  
    @Patch('notifications')
    @UseGuards(JwtAuthGuard)
    updateNotifications(
  
      @CurrentUser() user: any,
  
      @Body()
      dto: NotificationPreferenceDto,
    ) {
  
      return this.usersService
        .updateNotificationPreferences(
          user.sub,
          dto,
        );
    }
  }