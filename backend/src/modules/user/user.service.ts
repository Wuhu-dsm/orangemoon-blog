import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

export type ProfileUpdate = Partial<
  Pick<User, 'avatar' | 'bio' | 'location' | 'website' | 'socials'>
>;

export type OwnerSeedInput = Pick<User, 'email' | 'username' | 'password'>;

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: Partial<User>): Promise<UserDocument> {
    return new this.userModel(data).save();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).select('-password').exec();
  }

  async findByEmailOrUsername(
    email: string,
    username: string,
  ): Promise<UserDocument | null> {
    return this.userModel.findOne({ $or: [{ email }, { username }] }).exec();
  }

  async updateProfile(
    userId: string,
    data: ProfileUpdate,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(userId, data, { new: true })
      .select('-password')
      .exec();
  }

  async touchLastLogin(userId: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, { lastLoginAt: new Date() })
      .exec();
  }

  async upsertOwner(data: OwnerSeedInput): Promise<UserDocument | null> {
    return this.userModel
      .findOneAndUpdate(
        { $or: [{ email: data.email }, { username: data.username }] },
        {
          $set: {
            ...data,
            role: 'admin',
            status: 'active',
          },
          $setOnInsert: {
            refreshTokenVersion: 0,
            level: 1,
            exp: 0,
          },
        },
        { new: true, upsert: true },
      )
      .select('-password')
      .exec();
  }
}
