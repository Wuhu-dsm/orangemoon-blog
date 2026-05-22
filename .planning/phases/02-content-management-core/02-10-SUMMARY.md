---
phase: 02-content-management-core
plan: "10"
subsystem: project-management
tags: [project-status, admin-editor, public-api, home-page, data-migration]
requires: []
provides: [project-status-enum, project-form, public-project-api, home-featured-projects]
affects: [backend/project, frontend/admin, frontend/home]
tech-stack:
  added: []
  patterns: [react-query-public-hooks, conditional-form-rendering, status-migration-script]
key-files:
  created:
    - backend/src/modules/project/migrations/update-project-status-values.ts
    - frontend/src/components/admin/content/ProjectForm.tsx
    - frontend/src/api/publicContent.ts
    - frontend/src/hooks/usePublicContent.ts
  modified:
    - backend/src/modules/project/enums/project-status.enum.ts
    - backend/src/modules/project/project.service.spec.ts
    - frontend/src/api/adminContent.ts
    - frontend/src/components/admin/content/AdminContentEditor.tsx
    - frontend/src/components/admin/content/AdminContentTable.tsx
    - frontend/src/components/home/FeaturedProjects.tsx
    - frontend/src/pages/admin/AdminProjects.tsx
decisions:
  - "Status enum migration uses per-value updateMany calls (not wildcard) for explicit audit trail"
  - "ProjectForm replaces entire two-column grid when kind === 'project' (no block editor at all)"
  - "FeaturedProjects uses React Query with 5-minute staleTime for public data caching"
  - "Empty state for FeaturedProjects returns null (section hides gracefully, no UX noise)"
  - "Public API client reuses existing apiClient (auth interceptor adds token only when logged in)"
metrics:
  duration: "2026-05-22T21:44:46+08:00 to 2026-05-22T22:14:51+08:00 (~30 min)"
  completed_date: "2026-05-22"
---

# Phase 02 Plan 10: Close Project Management UAT Gaps Summary

**One-liner:** Replace project status enum values across full stack, create purpose-built ProjectForm replacing block editor for projects, and wire home page FeaturedProjects to live API data.

## Tasks Completed

### Task 1: Update ProjectStatus enum across full stack and write data migration

**Commit:** `d2aefc3`

Changes:
- Backend enum renamed: `Planning→Pending`, `InProgress→Developing`, `Completed→Updating`, `Maintenance→Archived`
- Backend tests updated: all 16/16 project service tests pass with new enum values
- MongoDB migration script created with `updateMany` per-value mapping (planning→pending, in-progress→developing, completed→updating, maintenance→archived)
- Frontend type union updated in `adminContent.ts`: `'planning' | 'in-progress' | 'completed' | 'maintenance'` → `'pending' | 'developing' | 'updating' | 'archived'`
- Frontend labels updated in AdminContentEditor (select options) and AdminContentTable (statusLabel record)
- Default projectStatus changed from `'planning'` to `'pending'` in AdminContentEditor

### Task 2: Create purpose-built ProjectForm component and integrate into admin editor

**Commit:** `32c5488`

Changes:
- Created `ProjectForm.tsx` (258 lines): single-column form with sections for cover image upload, basic info (title/slug/summary), project details (status select, techStack, repo/demo URLs), screenshots, and tags
- Integrated into `AdminContentEditor.tsx`: when `kind === 'project'`, renders ProjectForm instead of the two-column ContentBlockEditor + sidebar layout
- Article and note kinds continue using the existing block editor layout unchanged
- Fixed `AdminProjects.tsx`: `toProjectDto` only includes body when blocks array is non-empty (projects using ProjectForm have no blocks)

### Task 3: Create public projects API client and refactor FeaturedProjects to use real data

**Commit:** `4e8d360`

Changes:
- Created `publicContent.ts`: PublicProject interface, fetchPublicProjects() calling GET /api/v1/projects via shared apiClient
- Created `usePublicContent.ts`: React Query hook with query key factory and 5-minute staleTime
- Refactored `FeaturedProjects.tsx`: replaced 5 hardcoded mock projects with API-driven rendering
- Added loading state: 3 skeleton cards with animate-pulse
- Added empty state: returns null when no published projects exist
- Added error-graceful rendering: `data?.items ?? []` silently handles API errors
- Status badge colors computed via `getStatusBadgeClass()` for all 4 status values
- Cover image fallback: gradient placeholder when coverImage is empty

## Verification Results

| Check | Status | Details |
|-------|--------|---------|
| Backend tests (project.service.spec) | PASS | 16/16 tests pass with updated enum references |
| Frontend type-check (tsc --noEmit -p tsconfig.app.json) | PASS | Zero errors in plan files (3 pre-existing TS1261 router errors out of scope) |
| ProjectStatus enum values | PASS | pending/developing/updating/archived across backend enum, DTOs, frontend type, editor select, table labels |
| Migration script exists | PASS | Per-value updateMany with explicit old→new mapping |
| ProjectForm renders for projects | PASS | Single-column form with cover image, title, summary, status, techStack, URLs, screenshots, tags |
| No block editor for projects | PASS | Conditional rendering: kind === 'project' shows ProjectForm, else shows block editor |
| Article/Note editor unchanged | PASS | Non-project kinds continue using existing two-column block editor layout |
| FeaturedProjects uses real API | PASS | usePublicProjects hook calls GET /api/v1/projects, maps to DisplayProject |
| Loading/empty/error states | PASS | Skeleton cards during load, null return when empty, graceful fallback on error |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] JSX structure broken when removing dead project sidebar code**

- **Found during:** Task 2
- **Issue:** Deleting lines 410-477 (dead project sidebar Card) also removed the `</div>` that closes the grid div from line 294, causing TS17014 "JSX fragment has no corresponding closing tag"
- **Fix:** Inserted the missing `</div>` between the sidebar close `</div>` and the ternary close `)}` — restored proper nesting: sidebar → grid → ternary → main wrapper
- **Files modified:** `frontend/src/components/admin/content/AdminContentEditor.tsx`
- **Commit:** `32c5488`

**2. [Rule 3 - Blocking] File writes and commits targeted main repo instead of worktree**

- **Found during:** Task 3
- **Issue:** Used absolute paths like `/Users/mac/Desktop/orangemoon-blog/frontend/...` which resolved to main repo. The worktree is at `.claude/worktrees/agent-a978b4d541fb5e578/`. Task 3 files initially written to main repo.
- **Fix:** Merged `feat/home-ui-refresh` into `worktree-agent-a978b4d541fb5e578` (fast-forward) to recover Tasks 1-2 commits. Recreated Task 3 files using correct worktree absolute paths derived from `git rev-parse --show-toplevel`.
- **Files modified:** All Task 3 files, package-lock.json
- **Commit:** `4e8d360`

**3. [Rule 3 - Blocking] Missing node_modules in worktree frontend prevented type checking**

- **Found during:** Task 3 verification
- **Issue:** Worktree is a sparse checkout without node_modules. `npx tsc` could not run.
- **Fix:** Ran `npm install` in the worktree frontend directory before type checking.
- **Impact:** `package-lock.json` updated (committed with Task 3)

### Pre-existing Issues (Out of Scope)

- **TS1261 case-sensitivity errors** in `router/index.tsx`: imports `../pages/Admin/AdminProjects` but directory on disk is `pages/admin/` (lowercase). These pre-date all plan changes and were not fixed per scope boundary rule.

## Known Stubs

None. All data flows are wired end-to-end:
- ProjectForm passes all state to parent AdminContentEditor via props
- FeaturedProjects fetches real data from GET /api/v1/projects via React Query hook
- Loading states rendered with skeleton cards (not placeholder text)
- Empty state returns null (intentional - section hides gracefully)
- No "TODO", "FIXME", "placeholder", "coming soon", or hardcoded empty values in created/modified files

## Threat Flags

None. All threat surface is already captured in the plan's threat model:
- T-02.10-01 (Information Disclosure): Backend findAllPublic() already filters by status=Published + deletedAt=null — verified correct
- T-02.10-02 (Tampering): Migration uses strict per-value mapping, not wildcard updates
- T-02.10-03 (Elevation of Privilege): Backend @Roles('admin') gates all data operations regardless of frontend rendering

## Decisions Made

1. **Per-value updateMany for migration** (not single aggregation pipeline): Provides explicit audit trail — each old→new mapping is a discrete database operation with its own matchedCount. Safer for manual verification after deployment.

2. **ProjectForm replaces entire grid when kind='project'**: No block editor at all for projects — the body field is set to `[]`. This is cleaner than hiding the block editor and resizing the sidebar, and avoids confusing users with an unused editor pane.

3. **5-minute staleTime for public project data**: Public data changes infrequently (only when owner publishes/updates a project). 5-minute cache avoids unnecessary API calls while keeping data reasonably fresh.

4. **Null return for empty FeaturedProjects**: Hiding the section entirely when no published projects exist is better UX than showing an "empty state" message that draws attention to missing content.

## Self-Check: PASSED

All 11 files verified present in worktree. All 3 commits (`d2aefc3`, `32c5488`, `4e8d360`) confirmed in git history.

