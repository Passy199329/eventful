import { Injectable }
from '@nestjs/common';

import { UpdateProfileDto }
from './dto/update-profile.dto';

import { NotificationPreferenceDto }
from './dto/notification-preference.dto';

import { UsersRepository }
from './users.repository';

@Injectable()
export class UsersService {

  constructor(
    private readonly usersRepository:
      UsersRepository,
  ) {}

  async getProfile(
    userId: string,
  ) {

    return this.usersRepository
      .findByUserId(userId);
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ) {

    return this.usersRepository
      .updateProfile(
        userId,
        dto,
      );
  }

  async updateNotificationPreferences(
    userId: string,

    dto: NotificationPreferenceDto,
  ) {

    return this.usersRepository
      .updateProfile(
        userId,
        dto,
      );
  }
}