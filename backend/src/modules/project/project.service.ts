import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import { ContentStatus } from '../content/enums/content-status.enum';
import { createSlugBase } from '../content/utils/slug.util';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  // ─── Admin ───

  async findAllAdmin(
    query: ProjectQueryDto,
  ): Promise<{ items: ProjectDocument[]; total: number }> {
    const filter = this.buildAdminFilter(query);
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;

    const [items, total] = await Promise.all([
      this.projectModel
        .find(filter)
        .sort({ updatedAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec(),
      this.projectModel.countDocuments(filter).exec(),
    ]);

    return { items, total };
  }

  async findOneAdmin(id: string): Promise<ProjectDocument> {
    const project = await this.projectModel.findById(id).exec();
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async create(dto: CreateProjectDto): Promise<ProjectDocument> {
    const baseSlug = dto.slug
      ? createSlugBase(dto.slug)
      : createSlugBase(dto.title);
    const slug = await this.ensureUniqueSlug(baseSlug);

    const project = new this.projectModel({
      ...dto,
      slug,
      status: dto.status ?? ContentStatus.Draft,
    });

    return project.save();
  }

  async update(id: string, dto: UpdateProjectDto): Promise<ProjectDocument> {
    const existing = await this.projectModel.findById(id).exec();
    if (!existing) {
      throw new NotFoundException('Project not found');
    }

    let slug = existing.slug;
    if (dto.slug !== undefined) {
      const baseSlug = createSlugBase(dto.slug);
      slug = await this.ensureUniqueSlug(baseSlug, id);
    }

    const updates: Partial<Project> = {
      ...dto,
      slug,
    };

    const updated = await this.projectModel
      .findByIdAndUpdate(id, updates, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('Project not found');
    }

    return updated;
  }

  async publish(id: string): Promise<ProjectDocument> {
    const project = await this.projectModel.findById(id).exec();
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const updates: Partial<Project> = {
      status: ContentStatus.Published,
    };

    if (!project.publishedAt) {
      updates.publishedAt = new Date();
    }

    const updated = await this.projectModel
      .findByIdAndUpdate(id, updates, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('Project not found');
    }

    return updated;
  }

  async archive(id: string): Promise<ProjectDocument> {
    const updated = await this.projectModel
      .findByIdAndUpdate(id, { status: ContentStatus.Archived }, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('Project not found');
    }

    return updated;
  }

  async softDelete(id: string, deletedBy: string): Promise<ProjectDocument> {
    const updated = await this.projectModel
      .findByIdAndUpdate(
        id,
        { deletedAt: new Date(), deletedBy },
        { new: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException('Project not found');
    }

    return updated;
  }

  // ─── Public ───

  async findAllPublic(
    query: ProjectQueryDto,
  ): Promise<{ items: ProjectDocument[]; total: number }> {
    const filter = this.buildPublicFilter(query);
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;

    const [items, total] = await Promise.all([
      this.projectModel
        .find(filter)
        .sort({ updatedAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec(),
      this.projectModel.countDocuments(filter).exec(),
    ]);

    return { items, total };
  }

  async findBySlugPublic(slug: string): Promise<ProjectDocument> {
    const project = await this.projectModel
      .findOne({
        slug,
        status: ContentStatus.Published,
        deletedAt: null,
      })
      .exec();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  // ─── Helpers ───

  private buildAdminFilter(query: ProjectQueryDto): Record<string, unknown> {
    const filter: Record<string, unknown> = {};

    if (query.status) {
      filter.status = query.status;
    }

    if (query.projectStatus) {
      filter.projectStatus = query.projectStatus;
    }

    if (query.tag) {
      filter.tags = query.tag;
    }

    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { summary: { $regex: query.search, $options: 'i' } },
      ];
    }

    return filter;
  }

  private buildPublicFilter(query: ProjectQueryDto): Record<string, unknown> {
    const filter: Record<string, unknown> = {
      status: ContentStatus.Published,
      deletedAt: null,
    };

    if (query.projectStatus) {
      filter.projectStatus = query.projectStatus;
    }

    if (query.tag) {
      filter.tags = query.tag;
    }

    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { summary: { $regex: query.search, $options: 'i' } },
      ];
    }

    return filter;
  }

  private async ensureUniqueSlug(
    baseSlug: string,
    excludeId?: string,
  ): Promise<string> {
    let slug = baseSlug;
    let suffix = 1;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const query: Record<string, unknown> = { slug };
      if (excludeId) {
        query._id = { $ne: excludeId };
      }

      const existing = await this.projectModel.findOne(query).exec();
      if (!existing) {
        return slug;
      }

      slug = `${baseSlug}-${suffix}`;
      suffix++;
    }
  }
}
