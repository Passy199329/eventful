import {
    Prop,
    Schema,
    SchemaFactory,
  } from '@nestjs/mongoose';
  
  import { HydratedDocument }
  from 'mongoose';
  
  export type AnalyticsDocument =
    HydratedDocument<Analytics>;
  
  @Schema({
    timestamps: true,
  })
  export class Analytics {
  
    @Prop({
      required: true,
    })
    eventId: string;
  
    @Prop({
      default: 0,
    })
    totalTicketsSold: number;
  
    @Prop({
      default: 0,
    })
    totalRevenue: number;
  
    @Prop({
      default: 0,
    })
    totalViews: number;
  
    @Prop({
      default: 0,
    })
    totalAttendees: number;
  }
  
  export const AnalyticsSchema =
    SchemaFactory.createForClass(
      Analytics,
    );