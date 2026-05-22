import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Setting, SettingDocument } from './schemas/setting.schema';

@Injectable()
export class SettingService {
  constructor(
    @InjectModel(Setting.name) private settingModel: Model<SettingDocument>,
  ) {}

  async find(): Promise<SettingDocument | null> {
    return this.settingModel.findOne().exec();
  }

  async update(dto: UpdateSettingDto): Promise<SettingDocument> {
    const existing = await this.settingModel.findOne().exec();

    if (existing) {
      if (dto.banners !== undefined) {
        existing.banners = dto.banners;
      }
      if (dto.profile !== undefined) {
        existing.profile = dto.profile;
      }
      return existing.save();
    }

    return new this.settingModel({
      banners: dto.banners ?? [],
      profile: dto.profile,
    }).save();
  }
}
