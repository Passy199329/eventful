import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UseGuards,
  } from '@nestjs/common';
  
  import { TicketsService }
  from './tickets.service';
  
  import { JwtAuthGuard }
  from '../auth/guards/jwt-auth.guard';
  
  import { CurrentUser }
  from '../auth/decorators/current-user.decorator';
  
  import { PurchaseTicketDto }
  from './dto/purchase-ticket.dto';
  
  @Controller('tickets')
  export class TicketsController {
  
    constructor(
      private readonly ticketsService:
        TicketsService,
    ) {}
  
    @Post('purchase')
    @UseGuards(JwtAuthGuard)
    purchaseTicket(
  
      @CurrentUser() user: any,
  
      @Body()
      dto: PurchaseTicketDto,
    ) {
  
      return this.ticketsService
        .purchaseTicket(
          user.sub,
          dto,
        );
    }
  
    @Get('my-tickets')
    @UseGuards(JwtAuthGuard)
    getMyTickets(
      @CurrentUser() user: any,
    ) {
  
      return this.ticketsService
        .getUserTickets(
          user.sub,
        );
    }
  
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    getTicketById(
      @Param('id') id: string,
    ) {
  
      return this.ticketsService
        .getTicketById(id);
    }
  }