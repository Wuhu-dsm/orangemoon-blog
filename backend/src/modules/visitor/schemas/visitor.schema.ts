import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VisitorDocument = HydratedDocument<Visitor>;

@Schema({ timestamps: true })
export class Visitor {
  @Prop({ required: true, unique: true, index: true })
  visitorId: string;

  @Prop({ required: true })
  nickname: string;

  @Prop()
  userAgentHash?: string;

  @Prop()
  lastIpHash?: string;

  @Prop({ default: Date.now })
  firstSeenAt: Date;

  @Prop({ default: Date.now })
  lastSeenAt: Date;
}

export const VisitorSchema = SchemaFactory.createForClass(Visitor);
