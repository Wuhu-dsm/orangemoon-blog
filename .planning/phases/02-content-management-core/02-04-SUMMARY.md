# 02-04 Summary: Project Backend Slice

## Objective
Implement the project backend slice using the shared Phase 2 content contracts, providing content CRUD plus project-specific metadata for later public project pages.

## What Was Built

### Task 1: Project Schema and DTOs
- **`backend/src/modules/project/enums/project-status.enum.ts`** — `ProjectStatus` enum with `planning`, `in-progress`, `completed`, `maintenance` values, kept separate from shared `ContentStatus` per D-04.
- **`backend/src/modules/project/schemas/project.schema.ts`** — `Project` Mongoose schema with:
  - Shared content fields: `title`, `slug` (unique), `summary`, `coverImage`, `tags`, `body` (JSON BlockContentDto), `status` (ContentStatus), `publishedAt`, `deletedAt`, `deletedBy`, `createdAt`, `updatedAt`
  - Project-specific fields: `screenshots` (string array), `techStack` (string array), `projectStatus` (ProjectStatus), `repositoryUrl`, `demoUrl`
  - Indexes on `slug`, `status+deletedAt`, `projectStatus`, `tags`, `updatedAt`
- **`backend/src/modules/project/dto/create-project.dto.ts`** — DTO with `IsUrl()` validation for `repositoryUrl` and `demoUrl`, `IsEnum` for `projectStatus`, array validation for `screenshots`, `tags`, and `techStack`.
- **`backend/src/modules/project/dto/update-project.dto.ts`** — Optional variant of create DTO.
- **`backend/src/modules/project/dto/project-query.dto.ts`** — Extends `ContentQueryDto` with optional `projectStatus` filter.

### Task 2: Project Service and Tests
- **`backend/src/modules/project/project.service.ts`** — `ProjectService` implementing:
  - Admin: `findAllAdmin`, `findOneAdmin`, `create`, `update`, `publish`, `archive`, `softDelete`
  - Public: `findAllPublic`, `findBySlugPublic` (only published, non-deleted)
  - Unique slug generation with collision handling within the projects collection
  - Filters support both shared `status` and project-specific `projectStatus`
- **`backend/src/modules/project/project.service.spec.ts`** — 16 Jest tests covering:
  - Slug generation from title, collision suffixing, manual slug preservation
  - `projectStatus` persistence on create and update
  - Public filtering (published + non-deleted only, plus `projectStatus` filter)
  - Publish timestamp behavior (sets `publishedAt` on first publish, preserves on re-publish)
  - Soft delete sets `deletedAt`/`deletedBy`, excludes from public list, preserves document fields

### Task 3: Public and Admin Controllers
- **`backend/src/modules/project/project.controller.ts`** — Public read-only controller at `/projects` with `@Public()` `GET /projects` (list) and `GET /projects/:slug` (detail by slug).
- **`backend/src/modules/project/admin-project.controller.ts`** — Admin controller at `/admin/projects` guarded by `@Roles('admin')` with list, detail, create, update, publish, archive, and soft-delete endpoints.
- **`backend/src/modules/project/project.module.ts`** — Wired with `MongooseModule.forFeature`, both controllers, and `ProjectService`.

## Verification Results

| Check | Command | Result |
|-------|---------|--------|
| Task 1 build | `cd backend; npm run build` | Pass |
| Task 2 tests | `cd backend; npm test -- --runInBand project.service.spec.ts` | 16/16 passed |
| Task 3 build | `cd backend; npm run build` | Pass |

## Key Files

```
backend/src/modules/project/
├── enums/project-status.enum.ts
├── schemas/project.schema.ts
├── dto/create-project.dto.ts
├── dto/update-project.dto.ts
├── dto/project-query.dto.ts
├── project.service.ts
├── project.service.spec.ts
├── project.controller.ts
├── admin-project.controller.ts
└── project.module.ts
```

## Decisions

- **D-04 compliance**: `projectStatus` (planning/in-progress/completed/maintenance) is modeled separately from the shared `ContentStatus` (draft/published/archived). Public filtering supports both.
- **URL validation**: `repositoryUrl` and `demoUrl` use `class-validator`'s `IsUrl()` decorator.
- **Slug uniqueness scoped to projects**: Collision handling checks only within the `Project` collection, consistent with article and note slices.
- **No unpublish endpoint**: Following the article/note pattern, the admin controller provides `publish` and `archive` but no explicit `unpublish` — archiving serves as the withdrawal mechanism.
- **Soft delete preserves document**: `softDelete` sets `deletedAt`/`deletedBy` without removing the document, matching the shared content pattern.
