import { Injectable, NotFoundException } from '@nestjs/common';
import { AnalyticsRepository } from './analytics.repository';

@Injectable()
export class AnalyticsService {

  constructor(
    private readonly analyticsRepository: AnalyticsRepository,
  ) {}

  async createAnalytics(data: any) {
    return this.analyticsRepository.create(data);
  }

  async getAllAnalytics() {
    return this.analyticsRepository.findAll();
  }

  async getEventAnalytics(eventId: string) {
    const analytics = await this.analyticsRepository.findByEvent(eventId);

    if (!analytics) {
      throw new NotFoundException('Analytics not found');
    }

    return analytics;
  }

  async updateAnalytics(eventId: string, data: any) {
    const analytics = await this.analyticsRepository.findByEvent(eventId);

    if (!analytics) {
      throw new NotFoundException('Analytics not found');
    }

    return this.analyticsRepository.updateAnalytics(eventId, data);
  }
}