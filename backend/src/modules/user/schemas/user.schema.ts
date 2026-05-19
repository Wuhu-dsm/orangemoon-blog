import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  avatar?: string;

  @Prop({ default: 'user', enum: ['admin', 'user'] })
  role: string;

  @Prop({ default: 1 })
  level: number;

  @Prop({ default: 0 })
  exp: number;

  @Prop()
  bio?: string;

  @Prop()
  location?: string;

  @Prop()
  website?: string;

  @Prop({ type: Object })
  socials?: {
    github?: string;
    juejin?: string;
    bilibili?: string;
    weibo?: string;
  };

  @Prop({ default: 'active', enum: ['active', 'banned'] })
  status: string;

  @Prop()
  lastLoginAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
