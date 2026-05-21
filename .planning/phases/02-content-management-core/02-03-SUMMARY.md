# 02-03 Summary: Note Backend Slice

## Objective
Implement the note backend slice using the shared Phase 2 content contracts. Notes need the same production lifecycle as articles while preserving note-specific type metadata for later note frontend phases.

## What Was Built

### Task 1: Note Schema and DTOs
Created the note persistence model and validation contracts following the article slice pattern.

- **`backend/src/modules/note/schemas/note.schema.ts`**
  - `Note` Mongoose schema with: `title`, `slug`, `summary`, `coverImage`, `tags`, `noteType`, `body` (JSON), `status`, `publishedAt`, `deletedAt`, `deletedBy`, `createdAt`, `updatedAt`
  - Uses shared `ContentStatus` enum and `BlockContentDto` for body storage
  - `noteType` is required and note-specific per D-04
  - Indexes: `slug`, `status+deletedAt`, `tags`, `updatedAt`

- **`backend/src/modules/note/dto/create-note.dto.ts`**
  - class-validator DTO with `title`, optional `slug`, `summary`, `coverImage`, `tags`, `noteType`, `body`, `status`

- **`backend/src/modules/note/dto/update-note.dto.ts`**
  - All fields optional for PATCH updates, same validators as create

- **`backend/src/modules/note/dto/note-query.dto.ts`**
  - Extends shared `ContentQueryDto` with optional `noteType` filter

- **`backend/src/modules/note/enums/note-type.enum.ts`**
  - `NoteType` enum: `Short`, `Code`, `Quote`, `Todo`

### Task 2: Note Service and Tests
Implemented `NoteService` with full admin and public lifecycle behavior plus comprehensive unit tests.

- **`backend/src/modules/note/note.service.ts`**
  - Admin: `findAllAdmin`, `findOneAdmin`, `create`, `update`, `publish`, `unpublish`, `archive`, `softDelete`
  - Public: `findAllPublic`, `findBySlugPublic`
  - Reuses shared `createSlugBase()` with uniqueness enforced within notes collection
  - Public methods filter to `status: Published` and `deletedAt: null`
  - `publish` sets `publishedAt` on first publish and preserves it on re-publish
  - `softDelete` sets `deletedAt` and `deletedBy`

- **`backend/src/modules/note/note.service.spec.ts`**
  - 17 Jest tests covering:
    - Slug generation from title, collision suffixing, manual slug preservation
    - `noteType` persistence on create and update
    - Public read filtering (drafts and deleted notes excluded)
    - Status transitions (publish → published, unpublish → draft, archive → archived)
    - `publishedAt` behavior on first publish vs re-publish
    - Soft delete sets `deletedAt`/`deletedBy` and excludes from public list
    - Update preserves existing slug when not provided

### Task 3: Public and Admin Controllers
Created route boundaries and wired the module.

- **`backend/src/modules/note/note.controller.ts`**
  - Public read-only controller at `/notes`
  - `@Public()` decorated `GET /notes` and `GET /notes/:slug`

- **`backend/src/modules/note/admin-note.controller.ts`**
  - Admin controller at `/admin/notes` with `@Roles('admin')`
  - Endpoints: list, detail, create, update, publish, unpublish, archive, soft-delete
  - Soft delete receives `deletedBy` from `@CurrentUser()`

- **`backend/src/modules/note/note.module.ts`**
  - Wired `MongooseModule.forFeature([Note])`, both controllers, and `NoteService`

## Verification Results

| Verification | Command | Result |
|---|---|---|
| Build | `cd backend; npm run build` | ✅ Pass (no errors) |
| Unit Tests | `cd backend; npm test -- --runInBand note.service.spec.ts` | ✅ 17/17 passed |

## Key Files

```
backend/src/modules/note/
├── schemas/note.schema.ts
├── dto/create-note.dto.ts
├── dto/update-note.dto.ts
├── dto/note-query.dto.ts
├── enums/note-type.enum.ts
├── note.service.ts
├── note.service.spec.ts
├── note.controller.ts
├── admin-note.controller.ts
└── note.module.ts
```

## Decisions

- **Followed article slice pattern (02-02)**: Same service structure, controller split, and module wiring to keep the codebase consistent.
- **Reused shared contracts**: `ContentStatus`, `BlockContentDto`, `createSlugBase()`, and `ContentQueryDto` — no duplication.
- **Note-specific `noteType` preserved separately from tags**: Per D-04, `noteType` is a required enum field distinct from the shared tags array, enabling future note frontend phases to filter and render by type.
- **Separate public/admin route boundaries**: Public endpoints are `@Public()` read-only; admin endpoints are under `admin/notes` with `@Roles('admin')`. This mirrors the article security model.
- **Soft delete over hard delete**: `deletedAt`/`deletedBy` fields allow recovery and audit trails, consistent with article behavior per D-23.
- **Slug uniqueness scoped to notes collection**: Collision handling only checks against other notes, not articles or projects.

## Requirement Coverage

- **NOTE-05**: Note creation, editing, publishing, and public reads implemented.
- **ADMN-03**: Admin note management endpoints (CRUD + status transitions + soft delete) implemented.
- **D-01 through D-07, D-22 through D-28**: Decision coverage verified via service tests and controller structure.
