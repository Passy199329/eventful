import {
    Body,
    Controller,
    Param,
    Patch,
    Post,
    UseGuards,
  } from '@nestjs/common';
  
  import { QrcodeService }
  from './qrcode.service';
  
  import { JwtAuthGuard }
  from '../auth/guards/jwt-auth.guard';
  
  import { VerifyQrDto }
  from './dto/verify-qr.dto';
  
  @Controller('qrcode')
  export class QrcodeController {
  
    constructor(
      private readonly qrcodeService:
        QrcodeService,
    ) {}
  
    @Post(':ticketId')
    @UseGuards(JwtAuthGuard)
    generateQrCode(
      @Param('ticketId')
      ticketId: string,
    ) {
  
      return this.qrcodeService
        .generateQrCode(
          ticketId,
        );
    }
  
    @Patch('verify')
    @UseGuards(JwtAuthGuard)
    verifyQrCode(
      @Body()
      dto: VerifyQrDto,
    ) {
  
      return this.qrcodeService
        .verifyQrCode(
          dto.ticketId,
        );
    }
  }