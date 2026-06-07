import { Injectable }
from '@nestjs/common';

import { InjectModel }
from '@nestjs/mongoose';

import { Model }
from 'mongoose';

import {
  User,
  UserDocument,
} from './schemas/user.schema';

@Injectable()
export class AuthRepository {

  constructor(
    @InjectModel(User.name)
    private readonly userModel:
      Model<UserDocument>,
  ) {}

  async create(data: Partial<User>) {
    return this.userModel.create(
      data,
    );
  }

  async findByEmail(
    email: string,
  ) {
    return this.userModel.findOne({
      email,
    });
  }

  async findById(id: string) {
    return this.userModel.findById(
      id,
    );
  }
}