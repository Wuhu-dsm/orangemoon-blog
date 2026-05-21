# Plan 02-01 Summary: Content Management Core — Shared Contracts

## What was built

This plan established the shared backend content contracts and module entrypoints required by articles, notes, and projects before independent content slices are implemented in later plans.

### Task 1: Shared content contracts

Created a new `content` module under `backend/src/modules/content/` containing reusable types, DTOs, and utilities:

- **`enums/content-status.enum.ts`** — `ContentStatus` enum with `draft`, `published`, `archived`. Used across all content types for consistent lifecycle semantics.
- **`dto/block-content.dto.ts`** — `BlockContentDto` with a single `blocks: unknown[]` field. Designed for editor-native JSON payloads; no markdown/html/plainText fields are included, keeping the contract aligned with the block-editor architecture.
- **`dto/content-query.dto.ts`** — `ContentQueryDto` with optional `page`, `pageSize`, `status`, `search`, and `tag` fields, validated with `class-validator` and coerced via `class-transformer`.
- **`utils/slug.util.ts`** — `createSlugBase(title)` that:
  - Lowercases ASCII characters
  - Preserves CJK characters
  - Replaces whitespace with hyphens
  - Strips unsafe punctuation
  - Collapses multiple hyphens
  - Falls back to `untitled` for empty/whitespace-only input
- **`utils/slug.util.spec.ts`** — Jest tests covering English, Chinese, mixed punctuation, repeated whitespace, empty title, and mixed English/CJK inputs.

### Task 2: Expanded upload purposes

Updated the upload module to support content-production image types:

- **`dto/upload-purpose.dto.ts`** — Added four new purposes while preserving existing values:
  - `ArticleImage = 'article-image'`
  - `NoteImage = 'note-image'`
  - `ProjectCover = 'project-cover'`
  - `ProjectScreenshot = 'project-screenshot'`
- **`upload.service.spec.ts`** — Added tests proving:
  - `NoteImage` is stored in its own `note-image/` folder
  - `ProjectScreenshot` is stored in its own `project-screenshot/` folder
  - Non-image MIME rejection still works as before

### Task 3: Note and Project module entrypoints

Created empty Nest module entrypoints and wired them into the application:

- **`modules/note/note.module.ts`** — Empty `NoteModule`
- **`modules/project/project.module.ts`** — Empty `ProjectModule`
- **`app.module.ts`** — Imported `NoteModule` and `ProjectModule` alongside `ArticleModule`

## Key files created/modified

| File | Action |
|------|--------|
| `backend/src/modules/content/enums/content-status.enum.ts` | Created |
| `backend/src/modules/content/dto/block-content.dto.ts` | Created |
| `backend/src/modules/content/dto/content-query.dto.ts` | Created |
| `backend/src/modules/content/utils/slug.util.ts` | Created |
| `backend/src/modules/content/utils/slug.util.spec.ts` | Created |
| `backend/src/modules/upload/dto/upload-purpose.dto.ts` | Modified |
| `backend/src/modules/upload/upload.service.spec.ts` | Modified |
| `backend/src/modules/note/note.module.ts` | Created |
| `backend/src/modules/project/project.module.ts` | Created |
| `backend/src/app.module.ts` | Modified |

## Verification results

| Task | Command | Result |
|------|---------|--------|
| Task 1 | `npx jest slug.util.spec.ts --runInBand` | ✅ 9 tests passed |
| Task 2 | `npx jest upload.service.spec.ts --runInBand` | ✅ 4 tests passed |
| Task 3 | `npm run build` | ✅ Build succeeded with zero errors |

## Commits

1. `fa7b3d5` — `feat(content): add shared content contracts — status enum, block-content DTO, content-query DTO, slug util with tests`
2. `23629c3` — `feat(upload): expand upload purposes for content production (article-image, note-image, project-cover, project-screenshot) with tests`
3. `5d737c2` — `feat(modules): register NoteModule and ProjectModule entrypoints in AppModule`

## Decisions made

- **No `content.module.ts` was created.** The `content` directory is intentionally a shared contract/library folder (enums, DTOs, utils) rather than a NestJS module, so it can be imported by article, note, and project modules without introducing unnecessary module coupling.
- **BlockContentDto keeps `blocks: unknown[]`.** Using `unknown[]` instead of a strongly typed block interface avoids premature design lock-in before the editor block schema is finalized.
- **Default values in `ContentQueryDto`.** `page` defaults to `1` and `pageSize` defaults to `10` via property initializers, which aligns with typical REST pagination conventions.
