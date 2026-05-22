---
phase: 02-content-management-core
plan: "07"
subsystem: frontend-admin-content
tags:
  - react
  - react-query
  - admin
  - content-management
requires:
  - phase: 02-02
    provides: Article admin API
  - phase: 02-03
    provides: Note admin API
  - phase: 02-04
    provides: Project admin API
  - phase: 02-05
    provides: Admin route shell
  - phase: 02-06
    provides: Block editor and upload adapter
provides:
  - Typed admin content client and React Query hooks
  - Table-first admin pages for articles, notes, and projects
  - Full-page create/edit flows with draft, publish, preview, and soft-delete actions
affects:
  - phase-03-article-frontend
  - phase-04-note-frontend
  - phase-06-project-system
tech-stack:
  added: []
  patterns:
    - React Query admin list/detail/mutation invalidation
    - Shared admin content table, toolbar, and editor composition components
key-files:
  created:
    - frontend/src/components/admin/content/AdminContentToolbar.tsx
    - frontend/src/components/admin/content/AdminContentTable.tsx
    - frontend/src/components/admin/content/AdminContentEditor.tsx
  modified:
    - frontend/src/api/adminContent.ts
    - frontend/src/hooks/useAdminContent.ts
    - frontend/src/router/index.tsx
    - frontend/src/pages/Admin/AdminArticles.tsx
    - frontend/src/pages/Admin/AdminNotes.tsx
    - frontend/src/pages/Admin/AdminProjects.tsx
key-decisions:
  - "Admin content writes use only /admin/articles, /admin/notes, and /admin/projects."
  - "Admin preview renders current block JSON in-route instead of linking to public unpublished content."
  - "Project unpublish is implemented through the existing admin project update endpoint because the backend exposes publish/archive but no dedicated unpublish route."
patterns-established:
  - "Content pages remain thin route composition layers; shared UI lives under components/admin/content."
  - "Editor form state keeps body as BlockContent and only wraps it as { blocks } at API boundary."
requirements-completed:
  - ADMN-03
  - ARTC-07
  - NOTE-05
  - PROJ-05
  - INFR-04
duration: "recovered across sessions"
completed: 2026-05-22
---

# Phase 02 Plan 07: Admin Content Workspace Summary

**Admin article, note, and project workspaces with typed admin API access, React Query invalidation, table management, and full-page block-editor flows.**

## Performance

- **Duration:** recovered across sessions
- **Started:** 2026-05-21T22:56:04+08:00
- **Completed:** 2026-05-22T13:56:51+08:00
- **Tasks:** 3
- **Files modified:** 9

## Accomplishments

- Reconciled the partially completed admin content API client with React Query hooks and the current `{ blocks: BlockContent }` backend contract.
- Added reusable admin content toolbar, table, and editor components for articles, notes, and projects.
- Wired `/admin/articles`, `/admin/notes`, and `/admin/projects` to list, create, edit, preview, publish/unpublish, archive, and soft-delete flows.
- Added nested admin routes for `/new` and `/:id/edit` editor screens.

## Task Commits

1. **Task 1: Create typed admin content API client and hooks** - `9e87c88`
2. **Task 2/3: Build reusable content table, toolbar, and editor pages** - `b3c6eda`

## Files Created/Modified

- `frontend/src/api/adminContent.ts` - Typed admin content client for articles, notes, and projects.
- `frontend/src/hooks/useAdminContent.ts` - React Query list/detail/mutation hooks with list/detail invalidation.
- `frontend/src/components/admin/content/AdminContentToolbar.tsx` - Status tabs, search, and create CTA.
- `frontend/src/components/admin/content/AdminContentTable.tsx` - Reusable table-first content management UI with row actions and soft-delete confirmation.
- `frontend/src/components/admin/content/AdminContentEditor.tsx` - Full-page editor composition with cover upload, block editor, preview, and per-kind fields.
- `frontend/src/pages/Admin/AdminArticles.tsx` - Article table and editor route composition.
- `frontend/src/pages/Admin/AdminNotes.tsx` - Note table and editor route composition.
- `frontend/src/pages/Admin/AdminProjects.tsx` - Project table and editor route composition.
- `frontend/src/router/index.tsx` - Admin create/edit child routes.

## Decisions Made

- Project unpublish uses `PATCH /admin/projects/:id` with `status: draft` because the current backend does not expose `/admin/projects/:id/unpublish`.
- Admin preview is local and renders the current editor JSON through `ContentBlockPreview`, preserving the decision that drafts are not exposed publicly.
- The editor component owns only UI form state; API DTO wrapping happens in each page so kind-specific DTO rules remain explicit.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Reconciled API/hook naming drift**
- **Found during:** Task 1 recovery
- **Issue:** `adminContent.ts` had been updated to `findAll*`/`find*ById`/`softDelete*` naming while `useAdminContent.ts` still imported the earlier `list*`/`get*`/`delete*` names.
- **Fix:** Rewrote `useAdminContent.ts` to match the current API client and added project unpublish support via admin update.
- **Files modified:** `frontend/src/api/adminContent.ts`, `frontend/src/hooks/useAdminContent.ts`
- **Verification:** `cd frontend; npm run lint`; `cd frontend; npm run build`
- **Committed in:** `b3c6eda`

---

**Total deviations:** 1 auto-fixed blocking issue.
**Impact on plan:** The fix was required to make the planned content workspace compile and did not expand scope beyond admin content management.

## Issues Encountered

- React lint flagged synchronous state hydration in `AdminContentEditor`; this was resolved by making editor routes remount the editor when async detail data arrives.

## User Setup Required

None - no external service configuration required.

## Verification Results

- `cd frontend; npm run lint` - passed
- `cd frontend; npm run build` - passed; Vite reported an existing large chunk warning from bundled editor/admin dependencies.

## Next Phase Readiness

The core content workspace is ready for `02-08` to add user/friend-link/guestbook management shells and run combined Phase 2 verification.

---
*Phase: 02-content-management-core*
*Completed: 2026-05-22*
