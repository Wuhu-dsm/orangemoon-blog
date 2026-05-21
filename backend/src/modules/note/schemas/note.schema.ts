import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ContentStatus } from '../../content/enums/content-status.enum';
import { BlockContentDto } from '../../content/dto/block-content.dto';
import { NoteType } from '../enums/note-type.enum';

export type NoteDocument = HydratedDocument<Note>;

@Schema({ timestamps: true })
export class Note {
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

  @Prop({
    type: String,
    required: true,
    enum: NoteType,
  })
  noteType: NoteType;

  @Prop({ type: Object })
  body?: BlockContentDto;

  @Prop({
    type: String,
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

export const NoteSchema = SchemaFactory.createForClass(Note);

NoteSchema.index({ slug: 1 });
NoteSchema.index({ status: 1, deletedAt: 1 });
NoteSchema.index({ tags: 1 });
NoteSchema.index({ updatedAt: -1 });
