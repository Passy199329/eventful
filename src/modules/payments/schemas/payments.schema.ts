import {
    Prop,
    Schema,
    SchemaFactory,
  } from '@nestjs/mongoose';
  
  import { HydratedDocument }
  from 'mongoose';
  
  export type PaymentDocument =
    HydratedDocument<Payment>;
  
  @Schema({
    timestamps: true,
  })
  export class Payment {
  
    @Prop({
      required: true,
    })
    userId: string;
  
    @Prop({
      required: true,
    })
    ticketId: string;
  
    @Prop({
      required: true,
    })
    email: string;
  
    @Prop({
      required: true,
    })
    amount: number;
  
    @Prop({
      default: 'pending',
    })
    status: string;
  
    @Prop()
    reference: string;
  }
  
  export const PaymentSchema =
    SchemaFactory.createForClass(
      Payment,
    );