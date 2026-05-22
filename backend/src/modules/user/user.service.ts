import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AdminUpdateUserDto,
  AdminUserQueryDto,
} from './dto/admin-update-user.dto';
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

  async findAllAdmin(
    query: AdminUserQueryDto,
  ): Promise<{ items: UserDocument[]; total: number }> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const filter = this.buildAdminFilter(query);

    const [items, total] = await Promise.all([
      this.userModel
        .find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec(),
      this.userModel.countDocuments(filter).exec(),
    ]);

    return { items, total };
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

  async updateAdmin(
    userId: string,
    data: AdminUpdateUserDto,
  ): Promise<UserDocument> {
    const update: Pick<Partial<User>, 'role' | 'status'> = {};

    if (data.role !== undefined) {
      update.role = data.role;
    }

    if (data.status !== undefined) {
      update.status = data.status;
    }

    const user = await this.userModel
      .findByIdAndUpdate(userId, update, { new: true, runValidators: true })
      .select('-password')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
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

  private buildAdminFilter(query: AdminUserQueryDto): Record<string, unknown> {
    const filter: Record<string, unknown> = {};

    if (query.status) {
      filter.status = query.status;
    }

    if (query.role) {
      filter.role = query.role;
    }

    if (query.search) {
      filter.$or = [
        { email: { $regex: query.search, $options: 'i' } },
        { username: { $regex: query.search, $options: 'i' } },
      ];
    }

    return filter;
  }
}
