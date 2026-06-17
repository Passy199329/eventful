import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

import { ConfigModule } from './shared/config/config.module';
import { DatabaseModule } from './shared/database/database.module';
import { CacheModule } from './shared/cache/cache.module';
import { QueueModule } from './shared/queue/queue.module';
import { StorageModule } from './shared/storage/storage.module';
import { EventBusModule } from './shared/event-bus/event-bus.module';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EventsModule } from './modules/events/events.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { QrcodeModule } from './modules/qrcode/qrcode.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { SharingModule } from './modules/sharing/sharing.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'global',
        ttl: 60000,
        limit: 100,
      },
    ]),

    ConfigModule,
    DatabaseModule,
    CacheModule,
    QueueModule,
    StorageModule,
    EventBusModule,

    AuthModule,
    UsersModule,
    EventsModule,
    TicketsModule,
    QrcodeModule,
    PaymentsModule,
    NotificationsModule,
    AnalyticsModule,
    SharingModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}