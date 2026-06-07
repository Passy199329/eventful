import { Module }
from '@nestjs/common';

import { MongooseModule }
from '@nestjs/mongoose';

import {
  Analytics,
  AnalyticsSchema,
} from './schemas/analytics.schema';

import { AnalyticsController }
from './analytics.controller';

import { AnalyticsService }
from './analytics.service';

import { AnalyticsRepository }
from './analytics.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name:
          Analytics.name,

        schema:
          AnalyticsSchema,
      },
    ]),
  ],

  controllers: [
    AnalyticsController,
  ],

  providers: [
    AnalyticsService,
    AnalyticsRepository,
  ],

  exports: [
    AnalyticsService,
  ],
})
export class AnalyticsModule {}