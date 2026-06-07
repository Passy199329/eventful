import {
    Prop,
    Schema,
    SchemaFactory,
  } from '@nestjs/mongoose';
  
  import { HydratedDocument }
  from 'mongoose';
  
  export type UserProfileDocument =
    HydratedDocument<UserProfile>;
  
  @Schema({
    timestamps: true,
  })
  export class UserProfile {
  
    @Prop({
      required: true,
    })
    userId: string;
  
    @Prop()
    firstName: string;
  
    @Prop()
    lastName: string;
  
    @Prop()
    phone: string;
  
    @Prop()
    bio: string;
  
    @Prop({
      default: true,
    })
    emailNotifications: boolean;
  
    @Prop({
      default: false,
    })
    smsNotifications: boolean;
  
    @Prop({
      default: true,
    })
    pushNotifications: boolean;
  }
  
  export const UserProfileSchema =
    SchemaFactory.createForClass(
      UserProfile,
    );