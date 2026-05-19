import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

export type ProfileUpdate = Partial<
  Pick<User, 'avatar' | 'bio' | 'location' | 'website' | 'socials'>
>;

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
}
