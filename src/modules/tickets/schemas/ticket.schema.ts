import {
    Prop,
    Schema,
    SchemaFactory,
  } from '@nestjs/mongoose';
  
  import { HydratedDocument }
  from 'mongoose';
  
  export type TicketDocument =
    HydratedDocument<Ticket>;
  
  @Schema({
    timestamps: true,
  })
  export class Ticket {
  
    @Prop({
      required: true,
    })
    userId: string;
  
    @Prop({
      required: true,
    })
    eventId: string;
  
    @Prop({
      required: true,
    })
    ticketType: string;
  
    @Prop({
      required: true,
    })
    quantity: number;
  
    @Prop({
      required: true,
    })
    totalPrice: number;
  
    @Prop({
      default: false,
    })
    isScanned: boolean;
  
    @Prop()
    qrCode: string;
  }
  
  export const TicketSchema =
    SchemaFactory.createForClass(
      Ticket,
    );