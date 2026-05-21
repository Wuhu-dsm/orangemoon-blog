import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { ProjectService } from './project.service';
import { Project, ProjectDocument } from './schemas/project.schema';
import { ContentStatus } from '../content/enums/content-status.enum';
import { ProjectStatus } from './enums/project-status.enum';

function createMockProject(overrides: Partial<Project> = {}): ProjectDocument {
  return {
    _id: 'project-id',
    title: 'Test Project',
    slug: 'test-project',
    summary: 'Summary',
    coverImage: 'https://example.com/cover.jpg',
    screenshots: ['https://example.com/screen1.jpg'],
    tags: ['tag1', 'tag2'],
    techStack: ['react', 'nestjs'],
    projectStatus: ProjectStatus.InProgress,
    repositoryUrl: 'https://github.com/test/project',
    demoUrl: 'https://demo.example.com',
    body: { blocks: [] },
    status: ContentStatus.Draft,
    publishedAt: undefined,
    deletedAt: undefined,
    deletedBy: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as unknown as ProjectDocument;
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

describe('ProjectService', () => {
  let service: ProjectService;
  let model: MockModel;

  beforeEach(async () => {
    model = createMockModel();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: getModelToken(Project.name),
          useValue: model,
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
  });

  describe('create', () => {
    it('generates slug from title when no slug is provided', async () => {
      const saved = createMockProject({ slug: 'hello-world' });
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
      const saved = createMockProject({ slug: 'hello-world-1' });
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
      const saved = createMockProject({ slug: 'custom-slug' });
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

  describe('projectStatus persistence', () => {
    it('persists projectStatus on create', async () => {
      const saved = createMockProject({
        slug: 'my-project',
        projectStatus: ProjectStatus.Completed,
      });
      model.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(saved),
      }));
      model.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.create({
        title: 'My Project',
        projectStatus: ProjectStatus.Completed,
      });

      expect(result.projectStatus).toBe(ProjectStatus.Completed);
    });

    it('allows updating projectStatus', async () => {
      const existing = createMockProject({
        slug: 'original',
        projectStatus: ProjectStatus.Planning,
      });
      model.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(existing),
      });
      const updated = createMockProject({
        slug: 'original',
        projectStatus: ProjectStatus.Maintenance,
      });
      model.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      });

      const result = await service.update('project-id', {
        projectStatus: ProjectStatus.Maintenance,
      });

      expect(result.projectStatus).toBe(ProjectStatus.Maintenance);
    });
  });

  describe('public read filtering', () => {
    it('findAllPublic only returns published, non-deleted projects', async () => {
      const projects = [
        createMockProject({ status: ContentStatus.Published }),
      ];
      model.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(projects),
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

    it('findAllPublic filters by projectStatus', async () => {
      const projects = [
        createMockProject({
          status: ContentStatus.Published,
          projectStatus: ProjectStatus.Completed,
        }),
      ];
      model.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(projects),
      });
      model.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      });

      const result = await service.findAllPublic({
        projectStatus: ProjectStatus.Completed,
      });

      expect(model.find).toHaveBeenCalledWith(
        expect.objectContaining({
          status: ContentStatus.Published,
          deletedAt: null,
          projectStatus: ProjectStatus.Completed,
        }),
      );
      expect(result.items).toHaveLength(1);
    });

    it('findBySlugPublic excludes drafts', async () => {
      model.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findBySlugPublic('draft-project')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('findBySlugPublic excludes deleted projects', async () => {
      model.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.findBySlugPublic('deleted-project'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('publish timestamp behavior', () => {
    it('sets publishedAt on first publish', async () => {
      const project = createMockProject({
        status: ContentStatus.Draft,
        publishedAt: undefined,
      });
      model.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(project),
      });
      const updated = createMockProject({
        status: ContentStatus.Published,
        publishedAt: new Date(),
      });
      model.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      });

      const result = await service.publish('project-id');

      expect(result.status).toBe(ContentStatus.Published);
      expect(result.publishedAt).toBeDefined();
    });

    it('preserves existing publishedAt on re-publish', async () => {
      const existingDate = new Date('2024-01-01');
      const project = createMockProject({
        status: ContentStatus.Draft,
        publishedAt: existingDate,
      });
      model.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(project),
      });
      const updated = createMockProject({
        status: ContentStatus.Published,
        publishedAt: existingDate,
      });
      model.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      });

      const result = await service.publish('project-id');

      expect(result.publishedAt).toEqual(existingDate);
    });
  });

  describe('soft-delete behavior', () => {
    it('sets deletedAt and deletedBy', async () => {
      const updated = createMockProject({
        deletedAt: new Date(),
        deletedBy: 'admin-id',
      });
      model.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      });

      const result = await service.softDelete('project-id', 'admin-id');

      expect(result.deletedAt).toBeInstanceOf(Date);
      expect(result.deletedBy).toBe('admin-id');
    });

    it('excludes soft-deleted projects from public list', async () => {
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

    it('preserves document on soft delete', async () => {
      const original = createMockProject({
        title: 'Preserved Project',
        slug: 'preserved-project',
        body: { blocks: [{ type: 'paragraph', text: 'hello' }] },
      });
      const updated = createMockProject({
        ...original,
        deletedAt: new Date(),
        deletedBy: 'admin-id',
      });
      model.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      });

      const result = await service.softDelete('project-id', 'admin-id');

      expect(result.title).toBe('Preserved Project');
      expect(result.slug).toBe('preserved-project');
      expect(result.body).toEqual(original.body);
    });
  });

  describe('update', () => {
    it('preserves existing slug when no slug provided', async () => {
      const existing = createMockProject({ slug: 'original-slug' });
      model.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(existing),
      });
      const updated = createMockProject({
        slug: 'original-slug',
        title: 'New Title',
      });
      model.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      });

      const result = await service.update('project-id', { title: 'New Title' });

      expect(result.slug).toBe('original-slug');
    });

    it('allows manual slug update with collision handling', async () => {
      const existing = createMockProject({ slug: 'original-slug' });
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
      const updated = createMockProject({ slug: 'new-slug-1' });
      model.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      });

      const result = await service.update('project-id', {
        slug: 'new-slug',
      });

      expect(result.slug).toBe('new-slug-1');
    });
  });
});
