import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from './schemas/note.schema';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteQueryDto } from './dto/note-query.dto';
import { ContentStatus } from '../content/enums/content-status.enum';
import { createSlugBase } from '../content/utils/slug.util';

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
  ) {}

  // ─── Admin ───

  async findAllAdmin(
    query: NoteQueryDto,
  ): Promise<{ items: NoteDocument[]; total: number }> {
    const filter = this.buildAdminFilter(query);
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;

    const [items, total] = await Promise.all([
      this.noteModel
        .find(filter)
        .sort({ updatedAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec(),
      this.noteModel.countDocuments(filter).exec(),
    ]);

    return { items, total };
  }

  async findOneAdmin(id: string): Promise<NoteDocument> {
    const note = await this.noteModel.findById(id).exec();
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return note;
  }

  async create(dto: CreateNoteDto): Promise<NoteDocument> {
    const baseSlug = dto.slug
      ? createSlugBase(dto.slug)
      : createSlugBase(dto.title);
    const slug = await this.ensureUniqueSlug(baseSlug);

    const note = new this.noteModel({
      ...dto,
      slug,
      status: dto.status ?? ContentStatus.Draft,
    });

    return note.save();
  }

  async update(id: string, dto: UpdateNoteDto): Promise<NoteDocument> {
    const existing = await this.noteModel.findById(id).exec();
    if (!existing) {
      throw new NotFoundException('Note not found');
    }

    let slug = existing.slug;
    if (dto.slug !== undefined) {
      const baseSlug = createSlugBase(dto.slug);
      slug = await this.ensureUniqueSlug(baseSlug, id);
    }

    const updates: Partial<Note> = {
      ...dto,
      slug,
    };

    const updated = await this.noteModel
      .findByIdAndUpdate(id, updates, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('Note not found');
    }

    return updated;
  }

  async publish(id: string): Promise<NoteDocument> {
    const note = await this.noteModel.findById(id).exec();
    if (!note) {
      throw new NotFoundException('Note not found');
    }

    const updates: Partial<Note> = {
      status: ContentStatus.Published,
    };

    if (!note.publishedAt) {
      updates.publishedAt = new Date();
    }

    const updated = await this.noteModel
      .findByIdAndUpdate(id, updates, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('Note not found');
    }

    return updated;
  }

  async unpublish(id: string): Promise<NoteDocument> {
    const updated = await this.noteModel
      .findByIdAndUpdate(id, { status: ContentStatus.Draft }, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('Note not found');
    }

    return updated;
  }

  async archive(id: string): Promise<NoteDocument> {
    const updated = await this.noteModel
      .findByIdAndUpdate(id, { status: ContentStatus.Archived }, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('Note not found');
    }

    return updated;
  }

  async softDelete(id: string, deletedBy: string): Promise<NoteDocument> {
    const updated = await this.noteModel
      .findByIdAndUpdate(
        id,
        { deletedAt: new Date(), deletedBy },
        { new: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException('Note not found');
    }

    return updated;
  }

  // ─── Public ───

  async findAllPublic(
    query: NoteQueryDto,
  ): Promise<{ items: NoteDocument[]; total: number }> {
    const filter = this.buildPublicFilter(query);
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;

    const [items, total] = await Promise.all([
      this.noteModel
        .find(filter)
        .sort({ updatedAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec(),
      this.noteModel.countDocuments(filter).exec(),
    ]);

    return { items, total };
  }

  async findBySlugPublic(slug: string): Promise<NoteDocument> {
    const note = await this.noteModel
      .findOne({
        slug,
        status: ContentStatus.Published,
        deletedAt: null,
      })
      .exec();

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  // ─── Helpers ───

  private buildAdminFilter(query: NoteQueryDto): Record<string, unknown> {
    const filter: Record<string, unknown> = {};

    if (query.status) {
      filter.status = query.status;
    }

    if (query.tag) {
      filter.tags = query.tag;
    }

    if (query.noteType) {
      filter.noteType = query.noteType;
    }

    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { summary: { $regex: query.search, $options: 'i' } },
      ];
    }

    return filter;
  }

  private buildPublicFilter(query: NoteQueryDto): Record<string, unknown> {
    const filter: Record<string, unknown> = {
      status: ContentStatus.Published,
      deletedAt: null,
    };

    if (query.tag) {
      filter.tags = query.tag;
    }

    if (query.noteType) {
      filter.noteType = query.noteType;
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

      const existing = await this.noteModel.findOne(query).exec();
      if (!existing) {
        return slug;
      }

      slug = `${baseSlug}-${suffix}`;
      suffix++;
    }
  }
}
