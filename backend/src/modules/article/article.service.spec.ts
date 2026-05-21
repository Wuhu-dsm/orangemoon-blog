import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { ArticleService } from './article.service';
import { Article, ArticleDocument } from './schemas/article.schema';
import { ContentStatus } from '../content/enums/content-status.enum';

function createMockArticle(overrides: Partial<Article> = {}): ArticleDocument {
  return {
    _id: 'article-id',
    title: 'Test Article',
    slug: 'test-article',
    summary: 'Summary',
    coverImage: 'https://example.com/cover.jpg',
    tags: ['tag1', 'tag2'],
    category: 'tech',
    body: { blocks: [] },
    status: ContentStatus.Draft,
    publishedAt: undefined,
    deletedAt: undefined,
    deletedBy: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as unknown as ArticleDocument;
}

interface MockModelStatics {
  find: jest.Mock;
  findById: jest.Mock;
  findOne: jest.Mock;
  countDocuments: jest.Mock;
  findByIdAndUpdate: jest.Mock;
  create: jest.Mock;
}

type MockModel = jest.Mock & MockModelStatics;

function createMockModel(): MockModel {
  const findResult = {
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([]),
  };

  const findByIdResult = {
    exec: jest.fn().mockResolvedValue(null),
  };

  const findOneResult = {
    exec: jest.fn().mockResolvedValue(null),
  };

  const countDocumentsResult = {
    exec: jest.fn().mockResolvedValue(0),
  };

  const findByIdAndUpdateResult = {
    exec: jest.fn().mockResolvedValue(null),
  };

  const statics: MockModelStatics = {
    find: jest.fn().mockReturnValue(findResult),
    findById: jest.fn().mockReturnValue(findByIdResult),
    findOne: jest.fn().mockReturnValue(findOneResult),
    countDocuments: jest.fn().mockReturnValue(countDocumentsResult),
    findByIdAndUpdate: jest.fn().mockReturnValue(findByIdAndUpdateResult),
    create: jest.fn(),
  };

  const constructor = jest.fn();
  Object.assign(constructor, statics);

  return constructor as MockModel;
}

describe('ArticleService', () => {
  let service: ArticleService;
  let model: MockModel;

  beforeEach(async () => {
    model = createMockModel();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: getModelToken(Article.name),
          useValue: model,
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
  });

  describe('create', () => {
    it('generates slug from title when no slug is provided', async () => {
      const saved = createMockArticle({ slug: 'hello-world' });
      model.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(saved),
      }));
      model.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.create({
        title: 'Hello World',
      });

      expect(result.slug).toBe('hello-world');
    });

    it('suffixes slug on collision', async () => {
      const saved = createMockArticle({ slug: 'hello-world-1' });
      model.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(saved),
      }));

      let callCount = 0;
      model.findOne.mockImplementation(() => {
        callCount++;
        return {
          exec: jest.fn().mockResolvedValue(callCount === 1 ? saved : null),
        };
      });

      const result = await service.create({
        title: 'Hello World',
      });

      expect(result.slug).toBe('hello-world-1');
      expect(model.findOne).toHaveBeenCalledWith({ slug: 'hello-world' });
    });

    it('preserves manual slug and checks collision', async () => {
      const saved = createMockArticle({ slug: 'custom-slug' });
      model.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(saved),
      }));
      model.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.create({
        title: 'Hello World',
        slug: 'custom-slug',
      });

      expect(result.slug).toBe('custom-slug');
    });
  });

  describe('public read filtering', () => {
    it('findAllPublic only returns published, non-deleted articles', async () => {
      const articles = [
        createMockArticle({ status: ContentStatus.Published }),
      ];
      model.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(articles),
      });
      model.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      });

      const result = await service.findAllPublic({});

      expect(model.find).toHaveBeenCalledWith(
        expect.objectContaining({
          status: ContentStatus.Published,
          deletedAt: null,
        }),
      );
      expect(result.items).toHaveLength(1);
    });

    it('findBySlugPublic excludes drafts', async () => {
      model.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findBySlugPublic('draft-article')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('findBySlugPublic excludes deleted articles', async () => {
      model.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findBySlugPublic('deleted-article')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('publish timestamp behavior', () => {
    it('sets publishedAt on first publish', async () => {
      const article = createMockArticle({
        status: ContentStatus.Draft,
        publishedAt: undefined,
      });
      model.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(article),
      });
      const updated = createMockArticle({
        status: ContentStatus.Published,
        publishedAt: new Date(),
      });
      model.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      });

      const result = await service.publish('article-id');

      expect(result.status).toBe(ContentStatus.Published);
      expect(result.publishedAt).toBeDefined();
    });

    it('preserves existing publishedAt on re-publish', async () => {
      const existingDate = new Date('2024-01-01');
      const article = createMockArticle({
        status: ContentStatus.Draft,
        publishedAt: existingDate,
      });
      model.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(article),
      });
      const updated = createMockArticle({
        status: ContentStatus.Published,
        publishedAt: existingDate,
      });
      model.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      });

      const result = await service.publish('article-id');

      expect(result.publishedAt).toEqual(existingDate);
    });
  });

  describe('soft-delete behavior', () => {
    it('sets deletedAt and deletedBy', async () => {
      const updated = createMockArticle({
        deletedAt: new Date(),
        deletedBy: 'admin-id',
      });
      model.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      });

      const result = await service.softDelete('article-id', 'admin-id');

      expect(result.deletedAt).toBeInstanceOf(Date);
      expect(result.deletedBy).toBe('admin-id');
    });

    it('excludes soft-deleted articles from public list', async () => {
      model.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      });
      model.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(0),
      });

      await service.findAllPublic({});

      expect(model.find).toHaveBeenCalledWith(
        expect.objectContaining({ deletedAt: null }),
      );
    });
  });

  describe('update', () => {
    it('preserves existing slug when no slug provided', async () => {
      const existing = createMockArticle({ slug: 'original-slug' });
      model.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(existing),
      });
      const updated = createMockArticle({
        slug: 'original-slug',
        title: 'New Title',
      });
      model.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      });

      const result = await service.update('article-id', { title: 'New Title' });

      expect(result.slug).toBe('original-slug');
    });

    it('allows manual slug update with collision handling', async () => {
      const existing = createMockArticle({ slug: 'original-slug' });
      let callCount = 0;
      model.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(existing),
      });
      model.findOne.mockImplementation(() => {
        callCount++;
        return {
          exec: jest.fn().mockResolvedValue(callCount === 1 ? existing : null),
        };
      });
      const updated = createMockArticle({ slug: 'new-slug-1' });
      model.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      });

      const result = await service.update('article-id', {
        slug: 'new-slug',
      });

      expect(result.slug).toBe('new-slug-1');
    });
  });
});
