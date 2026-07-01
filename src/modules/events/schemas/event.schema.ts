import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

@Schema({ _id: false })
export class TicketTier {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  capacity: number;

  @Prop({ default: 0 })
  sold: number;
}

export const TicketTierSchema = SchemaFactory.createForClass(TicketTier);

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  creatorId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ type: [TicketTierSchema], required: true })
  ticketTiers: TicketTier[];

  @Prop()
  bannerImage: string;

  @Prop({ default: 'DRAFT' })
  status: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const EventSchema = SchemaFactory.createForClass(Event);