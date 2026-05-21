import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from './schemas/article.schema';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleQueryDto } from './dto/article-query.dto';
import { ContentStatus } from '../content/enums/content-status.enum';
import { createSlugBase } from '../content/utils/slug.util';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  // ─── Admin ───

  async findAllAdmin(
    query: ArticleQueryDto,
  ): Promise<{ items: ArticleDocument[]; total: number }> {
    const filter = this.buildAdminFilter(query);
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;

    const [items, total] = await Promise.all([
      this.articleModel
        .find(filter)
        .sort({ updatedAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec(),
      this.articleModel.countDocuments(filter).exec(),
    ]);

    return { items, total };
  }

  async findOneAdmin(id: string): Promise<ArticleDocument> {
    const article = await this.articleModel.findById(id).exec();
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  async create(dto: CreateArticleDto): Promise<ArticleDocument> {
    const baseSlug = dto.slug
      ? createSlugBase(dto.slug)
      : createSlugBase(dto.title);
    const slug = await this.ensureUniqueSlug(baseSlug);

    const article = new this.articleModel({
      ...dto,
      slug,
      status: dto.status ?? ContentStatus.Draft,
    });

    return article.save();
  }

  async update(id: string, dto: UpdateArticleDto): Promise<ArticleDocument> {
    const existing = await this.articleModel.findById(id).exec();
    if (!existing) {
      throw new NotFoundException('Article not found');
    }

    let slug = existing.slug;
    if (dto.slug !== undefined) {
      const baseSlug = createSlugBase(dto.slug);
      slug = await this.ensureUniqueSlug(baseSlug, id);
    }

    const updates: Partial<Article> = {
      ...dto,
      slug,
    };

    const updated = await this.articleModel
      .findByIdAndUpdate(id, updates, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('Article not found');
    }

    return updated;
  }

  async publish(id: string): Promise<ArticleDocument> {
    const article = await this.articleModel.findById(id).exec();
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    const updates: Partial<Article> = {
      status: ContentStatus.Published,
    };

    if (!article.publishedAt) {
      updates.publishedAt = new Date();
    }

    const updated = await this.articleModel
      .findByIdAndUpdate(id, updates, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('Article not found');
    }

    return updated;
  }

  async unpublish(id: string): Promise<ArticleDocument> {
    const updated = await this.articleModel
      .findByIdAndUpdate(id, { status: ContentStatus.Draft }, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('Article not found');
    }

    return updated;
  }

  async archive(id: string): Promise<ArticleDocument> {
    const updated = await this.articleModel
      .findByIdAndUpdate(id, { status: ContentStatus.Archived }, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('Article not found');
    }

    return updated;
  }

  async softDelete(id: string, deletedBy: string): Promise<ArticleDocument> {
    const updated = await this.articleModel
      .findByIdAndUpdate(
        id,
        { deletedAt: new Date(), deletedBy },
        { new: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException('Article not found');
    }

    return updated;
  }

  // ─── Public ───

  async findAllPublic(
    query: ArticleQueryDto,
  ): Promise<{ items: ArticleDocument[]; total: number }> {
    const filter = this.buildPublicFilter(query);
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;

    const [items, total] = await Promise.all([
      this.articleModel
        .find(filter)
        .sort({ updatedAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec(),
      this.articleModel.countDocuments(filter).exec(),
    ]);

    return { items, total };
  }

  async findBySlugPublic(slug: string): Promise<ArticleDocument> {
    const article = await this.articleModel
      .findOne({
        slug,
        status: ContentStatus.Published,
        deletedAt: null,
      })
      .exec();

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return article;
  }

  // ─── Helpers ───

  private buildAdminFilter(query: ArticleQueryDto): Record<string, unknown> {
    const filter: Record<string, unknown> = {};

    if (query.status) {
      filter.status = query.status;
    }

    if (query.tag) {
      filter.tags = query.tag;
    }

    if (query.category) {
      filter.category = query.category;
    }

    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { summary: { $regex: query.search, $options: 'i' } },
      ];
    }

    return filter;
  }

  private buildPublicFilter(
    query: ArticleQueryDto,
  ): Record<string, unknown> {
    const filter: Record<string, unknown> = {
      status: ContentStatus.Published,
      deletedAt: null,
    };

    if (query.tag) {
      filter.tags = query.tag;
    }

    if (query.category) {
      filter.category = query.category;
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

      const existing = await this.articleModel.findOne(query).exec();
      if (!existing) {
        return slug;
      }

      slug = `${baseSlug}-${suffix}`;
      suffix++;
    }
  }
}
