import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb+srv://evenful1234:event1234@eventfulcloud0.k4jew3i.mongodb.net/evenfultest',
    ),
  ],
})
export class DatabaseModule {}