import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ContentStatus } from '../../content/enums/content-status.enum';
import { BlockContentDto } from '../../content/dto/block-content.dto';

export type ArticleDocument = HydratedDocument<Article>;

@Schema({ timestamps: true })
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  summary?: string;

  @Prop()
  coverImage?: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  category?: string;

  @Prop({ type: Object })
  body?: BlockContentDto;

  @Prop({
    required: true,
    enum: ContentStatus,
    default: ContentStatus.Draft,
  })
  status: ContentStatus;

  @Prop()
  publishedAt?: Date;

  @Prop()
  deletedAt?: Date;

  @Prop()
  deletedBy?: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

ArticleSchema.index({ slug: 1 });
ArticleSchema.index({ status: 1, deletedAt: 1 });
ArticleSchema.index({ tags: 1 });
ArticleSchema.index({ updatedAt: -1 });
