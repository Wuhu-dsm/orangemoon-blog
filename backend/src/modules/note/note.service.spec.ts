import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { NoteService } from './note.service';
import { Note, NoteDocument } from './schemas/note.schema';
import { ContentStatus } from '../content/enums/content-status.enum';
import { NoteType } from './enums/note-type.enum';

function createMockNote(overrides: Partial<Note> = {}): NoteDocument {
  return {
    _id: 'note-id',
    title: 'Test Note',
    slug: 'test-note',
    summary: 'Summary',
    coverImage: 'https://example.com/cover.jpg',
    tags: ['tag1', 'tag2'],
    noteType: NoteType.Short,
    body: { blocks: [] },
    status: ContentStatus.Draft,
    publishedAt: undefined,
    deletedAt: undefined,
    deletedBy: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as unknown as NoteDocument;
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

describe('NoteService', () => {
  let service: NoteService;
  let model: MockModel;

  beforeEach(async () => {
    model = createMockModel();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoteService,
        {
          provide: getModelToken(Note.name),
          useValue: model,
        },
      ],
    }).compile();

    service = module.get<NoteService>(NoteService);
  });

  describe('create', () => {
    it('generates slug from title when no slug is provided', async () => {
      const saved = createMockNote({ slug: 'hello-world' });
      model.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(saved),
      }));
      model.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.create({
        title: 'Hello World',
        noteType: NoteType.Short,
      });

      expect(result.slug).toBe('hello-world');
    });

    it('suffixes slug on collision', async () => {
      const saved = createMockNote({ slug: 'hello-world-1' });
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
        noteType: NoteType.Code,
      });

      expect(result.slug).toBe('hello-world-1');
      expect(model.findOne).toHaveBeenCalledWith({ slug: 'hello-world' });
    });

    it('preserves manual slug and checks collision', async () => {
      const saved = createMockNote({ slug: 'custom-slug' });
      model.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(saved),
      }));
      model.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.create({
        title: 'Hello World',
        noteType: NoteType.Quote,
        slug: 'custom-slug',
      });

      expect(result.slug).toBe('custom-slug');
    });
  });

  describe('noteType persistence', () => {
    it('persists noteType on create', async () => {
      const saved = createMockNote({
        slug: 'code-snippet',
        noteType: NoteType.Code,
      });
      model.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(saved),
      }));
      model.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.create({
        title: 'Code Snippet',
        noteType: NoteType.Code,
      });

      expect(result.noteType).toBe(NoteType.Code);
    });

    it('allows updating noteType', async () => {
      const existing = createMockNote({
        slug: 'original',
        noteType: NoteType.Short,
      });
      model.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(existing),
      });
      const updated = createMockNote({
        slug: 'original',
        noteType: NoteType.Todo,
      });
      model.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      });

      const result = await service.update('note-id', {
        noteType: NoteType.Todo,
      });

      expect(result.noteType).toBe(NoteType.Todo);
    });
  });

  describe('public read filtering', () => {
    it('findAllPublic only returns published, non-deleted notes', async () => {
      const notes = [
        createMockNote({ status: ContentStatus.Published }),
      ];
      model.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(notes),
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

      await expect(service.findBySlugPublic('draft-note')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('findBySlugPublic excludes deleted notes', async () => {
      model.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findBySlugPublic('deleted-note')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('status transitions', () => {
    it('publish sets status to published', async () => {
      const note = createMockNote({
        status: ContentStatus.Draft,
        publishedAt: undefined,
      });
      model.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(note),
      });
      const updated = createMockNote({
        status: ContentStatus.Published,
        publishedAt: new Date(),
      });
      model.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      });

      const result = await service.publish('note-id');

      expect(result.status).toBe(ContentStatus.Published);
    });

    it('unpublish sets status to draft', async () => {
      const updated = createMockNote({ status: ContentStatus.Draft });
      model.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      });

      const result = await service.unpublish('note-id');

      expect(result.status).toBe(ContentStatus.Draft);
    });

    it('archive sets status to archived', async () => {
      const updated = createMockNote({ status: ContentStatus.Archived });
      model.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      });

      const result = await service.archive('note-id');

      expect(result.status).toBe(ContentStatus.Archived);
    });

    it('sets publishedAt on first publish', async () => {
      const note = createMockNote({
        status: ContentStatus.Draft,
        publishedAt: undefined,
      });
      model.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(note),
      });
      const updated = createMockNote({
        status: ContentStatus.Published,
        publishedAt: new Date(),
      });
      model.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      });

      const result = await service.publish('note-id');

      expect(result.publishedAt).toBeDefined();
    });

    it('preserves existing publishedAt on re-publish', async () => {
      const existingDate = new Date('2024-01-01');
      const note = createMockNote({
        status: ContentStatus.Draft,
        publishedAt: existingDate,
      });
      model.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(note),
      });
      const updated = createMockNote({
        status: ContentStatus.Published,
        publishedAt: existingDate,
      });
      model.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      });

      const result = await service.publish('note-id');

      expect(result.publishedAt).toEqual(existingDate);
    });
  });

  describe('soft-delete behavior', () => {
    it('sets deletedAt and deletedBy', async () => {
      const updated = createMockNote({
        deletedAt: new Date(),
        deletedBy: 'admin-id',
      });
      model.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      });

      const result = await service.softDelete('note-id', 'admin-id');

      expect(result.deletedAt).toBeInstanceOf(Date);
      expect(result.deletedBy).toBe('admin-id');
    });

    it('excludes soft-deleted notes from public list', async () => {
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
      const existing = createMockNote({ slug: 'original-slug' });
      model.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(existing),
      });
      const updated = createMockNote({
        slug: 'original-slug',
        title: 'New Title',
      });
      model.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      });

      const result = await service.update('note-id', { title: 'New Title' });

      expect(result.slug).toBe('original-slug');
    });

    it('allows manual slug update with collision handling', async () => {
      const existing = createMockNote({ slug: 'original-slug' });
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
      const updated = createMockNote({ slug: 'new-slug-1' });
      model.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      });

      const result = await service.update('note-id', {
        slug: 'new-slug',
      });

      expect(result.slug).toBe('new-slug-1');
    });
  });
});
