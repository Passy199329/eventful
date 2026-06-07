import { Injectable }
from '@nestjs/common';

import { InjectModel }
from '@nestjs/mongoose';

import { Model }
from 'mongoose';

import {
  UserProfile,
  UserProfileDocument,
} from './schemas/user-profile.schema';

@Injectable()
export class UsersRepository {

  constructor(
    @InjectModel(
      UserProfile.name,
    )
    private readonly userProfileModel:
      Model<UserProfileDocument>,
  ) {}

  async create(
    data: Partial<UserProfile>,
  ) {
    return this.userProfileModel
      .create(data);
  }

  async findByUserId(
    userId: string,
  ) {
    return this.userProfileModel
      .findOne({ userId });
  }

  async updateProfile(
    userId: string,
    data: Partial<UserProfile>,
  ) {
    return this.userProfileModel
      .findOneAndUpdate(
        { userId },
        { $set: data },
        { returnDocument: 'after', upsert: true },
      );
  }
}