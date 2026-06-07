import {
    Prop,
    Schema,
    SchemaFactory,
  } from '@nestjs/mongoose';
  
  import { HydratedDocument }
  from 'mongoose';
  
  export type NotificationDocument =
    HydratedDocument<Notification>;
  
  @Schema({
    timestamps: true,
  })
  export class Notification {
  
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
    reminderDate: Date;
  
    @Prop({
      required: true,
    })
    channel: string;
  
    @Prop({
      default: false,
    })
    sent: boolean;
  }
  
  export const NotificationSchema =
    SchemaFactory.createForClass(
      Notification,
    );