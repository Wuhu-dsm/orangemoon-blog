import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ContentStatus } from '../../content/enums/content-status.enum';
import { BlockContentDto } from '../../content/dto/block-content.dto';
import { ProjectStatus } from '../enums/project-status.enum';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  summary?: string;

  @Prop()
  coverImage?: string;

  @Prop({ type: [String], default: [] })
  screenshots: string[];

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: [String], default: [] })
  techStack: string[];

  @Prop({
    type: String,
    enum: ProjectStatus,
  })
  projectStatus?: ProjectStatus;

  @Prop()
  repositoryUrl?: string;

  @Prop()
  demoUrl?: string;

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

export const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.index({ slug: 1 });
ProjectSchema.index({ status: 1, deletedAt: 1 });
ProjectSchema.index({ projectStatus: 1 });
ProjectSchema.index({ tags: 1 });
ProjectSchema.index({ updatedAt: -1 });
