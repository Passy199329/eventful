import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { EventsService }
from './events.service';

import { JwtAuthGuard }
from '../auth/guards/jwt-auth.guard';

import { CurrentUser }
from '../auth/decorators/current-user.decorator';

import { CreateEventDto }
from './dto/create-event.dto';

import { UpdateEventDto }
from './dto/update-event.dto';

@Controller('events')
export class EventsController {

  constructor(
    private readonly eventsService:
      EventsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createEvent(
    @CurrentUser() user: any,
    @Body() dto: CreateEventDto,
  ) {
    return this.eventsService
      .createEvent(user.sub, dto);
  }

  @Get()
  getAllEvents() {
    return this.eventsService
      .getAllEvents();
  }

  @Get(':id')
  getEventById(
    @Param('id') id: string,
  ) {
    return this.eventsService
      .getEventById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateEvent(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateEventDto,
  ) {
    return this.eventsService
      .updateEvent(id, user.sub, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteEvent(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.eventsService
      .deleteEvent(id, user.sub);
  }
}