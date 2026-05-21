---
phase: 01-infrastructure
plan: 03
subsystem: upload
tags: [nestjs, multer, uploads, owner-only]
requires:
  - phase: 01-01
    provides: owner JWT auth and admin role guard
  - phase: 01-02
    provides: focused throttling for sensitive routes
provides:
  - owner-only image upload endpoint
  - purpose-scoped upload storage folders
  - typed frontend upload helper
affects: [admin, avatar, article-cover, guestbook]
tech-stack:
  added: []
  patterns:
    - `FileInterceptor('file')` plus ParseFilePipe validation
    - `UploadPurpose` enum for safe folder names
    - public URLs under `/uploads/{purpose}/{filename}`
key-files:
  created:
    - backend/src/config/upload.config.ts
    - backend/src/modules/upload/dto/upload-purpose.dto.ts
    - backend/src/modules/upload/upload.controller.ts
    - backend/src/modules/upload/upload.module.ts
    - backend/src/modules/upload/upload.service.ts
    - backend/src/modules/upload/upload.service.spec.ts
    - frontend/src/api/upload.ts
  modified:
    - backend/src/app.module.ts
    - backend/src/config/index.ts
key-decisions:
  - Reserved `guestbook-image` as a purpose value while keeping all Phase 1 uploads owner-only.
  - Used memory upload parsing and service-owned filesystem writes so filenames and folders are never user-controlled.
patterns-established:
  - Upload services return normalized metadata `{ url, filename, purpose, size, mimeType }`.
  - Upload service tests use a temp directory and do not require external services.
requirements-completed: [INFR-04]
duration: 8 min
completed: 2026-05-21
---

# Phase 01 Plan 03: Owner-Only Upload Summary

**Purpose-scoped image uploads for the owner, validated by MIME/size and served through `/uploads` URLs**

## Performance

- **Duration:** 8 min
- **Started:** 2026-05-21T09:24:00Z
- **Completed:** 2026-05-21T09:32:00Z
- **Tasks:** 3
- **Files modified:** 9

## Accomplishments

- Added `uploadConfig` for `UPLOAD_DIR` and `MAX_FILE_SIZE`.
- Added `UploadPurpose` enum with `avatar`, `article-cover`, and reserved `guestbook-image`.
- Added owner-only `POST /api/v1/uploads/image` protected by JWT + `@Roles('admin')`.
- Added image-only validation and safe generated filenames under purpose folders.
- Added typed frontend `uploadImage(file, purpose)` helper using `FormData`.
- Added upload service unit tests for public URL/path behavior and MIME rejection.

## Task Commits

1. **Task 1: Add upload config and safe storage service** - `85e7b84`
2. **Task 2: Add owner-only image upload endpoint** - `85e7b84`
3. **Task 3: Add upload API helper and verification coverage** - `85e7b84`

## Files Created/Modified

- `backend/src/config/upload.config.ts` - Upload directory and size configuration.
- `backend/src/modules/upload/upload.controller.ts` - Owner-only image endpoint and file validation.
- `backend/src/modules/upload/upload.service.ts` - Safe filename generation, folder creation, and URL response.
- `backend/src/modules/upload/upload.service.spec.ts` - Service-level upload tests.
- `frontend/src/api/upload.ts` - Typed upload helper for future owner UI.

## Decisions Made

- Kept upload UI out of Phase 1 and exposed only the API helper.
- Returned `/uploads/...` URLs to match existing Nginx mapping.
- Deferred file listing, deletion, moderation, and visitor uploads as planned.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Verification Constraint] Deferred live upload HTTP smoke checks**
- **Found during:** Plan verification
- **Issue:** A real upload smoke check requires a running backend with MongoDB and seeded owner credentials. That belongs naturally with the Compose reliability wave.
- **Fix:** Added service tests and static checks for owner-only annotations, file validation, URL generation, and frontend helper behavior.
- **Files modified:** `backend/src/modules/upload/upload.service.spec.ts`.
- **Verification:** Backend build/test and frontend lint/build passed.
- **Committed in:** `85e7b84`

---

**Total deviations:** 1 auto-fixed (verification constraint).
**Impact on plan:** Upload behavior is covered at unit/build level; runtime smoke remains for full-stack verification.

## Issues Encountered

None.

## Verification

- `cd backend && npm run build` - passed.
- `cd backend && npm test -- --runInBand` - passed with 2 suites, 3 tests.
- `cd frontend && npm run lint` - passed.
- `cd frontend && npm run build` - passed.
- Static checks confirmed `@Roles('admin')`, `FileInterceptor`, purpose enum values, `/uploads/` URL generation, and `FormData`.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Ready for Plan 01-04. The Compose and healthcheck wave can now verify `/uploads` volume serving and live API behavior.

---
*Phase: 01-infrastructure*
*Completed: 2026-05-21*
