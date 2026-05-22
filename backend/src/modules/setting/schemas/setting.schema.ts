import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SettingDocument = HydratedDocument<Setting>;

@Schema({ timestamps: true })
export class Setting {
  @Prop({ type: [String], default: [] })
  banners: string[];

  @Prop({ type: Object })
  profile?: {
    nickname: string;
    avatar: string;
    title: string;
    bio: string;
    level: number;
    stats: { label: string; value: string }[];
    socials: { icon: string; label: string; href: string }[];
  };
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
