# Plan 02-02 Summary: Content Management Core — Article Backend Slice

## What was built

Replaced the existing article public controller stub with a complete article backend slice, establishing the model/service/controller pattern for notes and projects.

### Task 1: Define article schema and DTOs

Created the Article Mongoose schema and validation DTOs:

- **`schemas/article.schema.ts`** — `Article` schema with:
  - `title`, `slug` (unique), `summary`, `coverImage`, `tags` (string array), `category`
  - `body` stored as JSON `Object` using `BlockContentDto` (no markdown/html/plainText fields)
  - `status` enum (`draft`, `published`, `archived`) with `publishedAt` tracking
  - Soft-delete metadata: `deletedAt`, `deletedBy`
  - Automatic `createdAt` and `updatedAt` via `@Schema({ timestamps: true })`
  - Indexes: `slug`, `status` + `deletedAt`, `tags`, `updatedAt` (descending)
- **`dto/create-article.dto.ts`** — `CreateArticleDto` with class-validator decorators for all article fields. Slug is optional (auto-generated from title if omitted).
- **`dto/update-article.dto.ts`** — `UpdateArticleDto` with all optional fields; explicitly allows manual slug edits.
- **`dto/article-query.dto.ts`** — `ArticleQueryDto` extending `ContentQueryDto` with an additional optional `category` filter.

### Task 2: Implement article service behavior and tests

Created `ArticleService` with full admin and public method suites:

- **Admin methods:** `findAllAdmin`, `findOneAdmin`, `create`, `update`, `publish`, `unpublish`, `archive`, `softDelete`
- **Public methods:** `findAllPublic`, `findBySlugPublic`
- **Slug behavior:** `createSlugBase(title)` generates the base slug; `ensureUniqueSlug()` suffixes collisions (`-1`, `-2`, …) within articles. Manual slug updates are preserved when provided in the DTO.
- **Public filtering:** Public methods strictly query `status: published` AND `deletedAt: null`.
- **Publish timestamp:** `publishedAt` is set on first publish and preserved on re-publish.
- **Soft delete:** Sets `deletedAt` and `deletedBy` without removing the document.

Tests (`article.service.spec.ts`) with a fully mocked Mongoose model cover:
- Slug generation from title and collision suffixing
- Manual slug preservation and collision handling
- Public read filtering (drafts and deleted articles excluded)
- Publish timestamp behavior (first publish vs. re-publish)
- Soft-delete behavior (deletedAt/deletedBy set, excluded from public queries)
- Update slug preservation when no slug provided

### Task 3: Add public and admin article controllers

- **`article.controller.ts`** — Public read-only controller under `articles`:
  - `GET /articles` — list published articles (paginated, filterable by tag/category/search)
  - `GET /articles/:slug` — detail by slug
  - Both endpoints marked `@Public()`
- **`admin-article.controller.ts`** — Admin controller under `admin/articles`, guarded by `@Roles('admin')`:
  - `GET /admin/articles` — list all articles (admin filterable)
  - `GET /admin/articles/:id` — detail by ID
  - `POST /admin/articles` — create
  - `PATCH /admin/articles/:id` — update
  - `PATCH /admin/articles/:id/publish` — publish
  - `PATCH /admin/articles/:id/unpublish` — unpublish (to draft)
  - `PATCH /admin/articles/:id/archive` — archive
  - `DELETE /admin/articles/:id` — soft delete (records `deletedBy` from `@CurrentUser()`)
- **`article.module.ts`** — Wired `MongooseModule.forFeature([Article])`, `ArticleService`, and both controllers.

## Key files created/modified

| File | Action |
|------|--------|
| `backend/src/modules/article/schemas/article.schema.ts` | Created |
| `backend/src/modules/article/dto/create-article.dto.ts` | Created |
| `backend/src/modules/article/dto/update-article.dto.ts` | Created |
| `backend/src/modules/article/dto/article-query.dto.ts` | Created |
| `backend/src/modules/article/article.service.ts` | Created |
| `backend/src/modules/article/article.service.spec.ts` | Created |
| `backend/src/modules/article/article.controller.ts` | Replaced |
| `backend/src/modules/article/admin-article.controller.ts` | Created |
| `backend/src/modules/article/article.module.ts` | Modified |

## Verification results

| Task | Command | Result |
|------|---------|--------|
| Task 1 | `cd backend; npm run build` | ✅ Build succeeded with zero errors |
| Task 2 | `cd backend; npm test -- --runInBand article.service.spec.ts` | ✅ 12 tests passed |
| Task 3 | `cd backend; npm run build` | ✅ Build succeeded with zero errors |

## Commits

1. `d042634` — `feat(article): define article schema and DTOs`
2. `a0f2d31` — `feat(article): implement article service with tests`
3. `512ca3b` — `feat(article): add public and admin article controllers`

## Decisions made

- **No Markdown/HTML/PlainText body fields.** The `body` field stores editor-native JSON (`BlockContentDto`) only, per D-02/D-03. Future render layers will consume this JSON directly.
- **Slug uniqueness enforced at both service and schema levels.** The service handles collision suffixing dynamically, while the schema adds a unique index as a backstop.
- **Manual slug updates are preserved but still slugified.** When a user explicitly provides a slug in create/update, `createSlugBase()` sanitizes it (lowercase, hyphenate, strip unsafe chars) before collision checks. This prevents invalid slugs while respecting user intent.
- **Public and admin routes are completely separate controllers.** This separation (D-28) makes it impossible to accidentally expose an admin write endpoint publicly, and keeps the public controller surface minimal.
- **Soft delete only sets `deletedAt`/`deletedBy`.** No hard delete endpoint exists for articles. Deleted articles remain visible in admin lists (future filtering can be added) but are invisible to public reads.
- **`FilterQuery` type compatibility.** Mongoose v9 in this project does not export `FilterQuery` from the main package, so `Record<string, unknown>` was used for filter object typings as a pragmatic alternative.
