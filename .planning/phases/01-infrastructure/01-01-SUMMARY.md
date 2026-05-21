---
phase: 01-infrastructure
plan: 01
subsystem: auth
tags: [nestjs, jwt, react, zustand, owner-auth]
requires: []
provides:
  - owner-only login and refresh-token API
  - admin role guard wired into global request guards
  - explicit owner seed CLI command
  - hidden frontend owner login route and keyboard easter egg
affects: [auth, upload, admin, visitor]
tech-stack:
  added: []
  patterns:
    - APP_GUARD-based JWT + roles enforcement
    - persisted owner access/refresh token store
    - hidden owner route opened by keyboard sequence
key-files:
  created:
    - backend/src/common/guards/roles.guard.ts
    - backend/src/modules/auth/dto/owner-login.dto.ts
    - backend/src/modules/auth/dto/refresh-token.dto.ts
    - backend/src/scripts/seed-owner.ts
    - frontend/src/api/auth.ts
    - frontend/src/hooks/useOwnerLoginEasterEgg.ts
    - frontend/src/pages/Auth/OwnerLogin.tsx
  modified:
    - backend/src/modules/auth/auth.controller.ts
    - backend/src/modules/auth/auth.service.ts
    - backend/src/modules/user/schemas/user.schema.ts
    - backend/src/modules/user/user.service.ts
    - frontend/src/api/client.ts
    - frontend/src/stores/authStore.ts
    - frontend/src/router/index.tsx
    - frontend/src/components/layout/Header.tsx
key-decisions:
  - Public visitor registration remains absent in Phase 1.
  - Owner accounts are created only through the explicit seed CLI.
  - The visible header login link was removed; owner login is reached by typing `sorablog`.
patterns-established:
  - Owner-only auth responses return `{ user, accessToken, refreshToken }`.
  - Frontend 401 handling refreshes once, then logs out and redirects to `/owner-login`.
requirements-completed: [AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05]
duration: 12 min
completed: 2026-05-21
---

# Phase 01 Plan 01: Owner Auth Walking Skeleton Summary

**Blogger-only JWT login with refresh retry, explicit admin seeding, and a hidden SoraBlog owner login screen**

## Performance

- **Duration:** 12 min
- **Started:** 2026-05-21T09:00:00Z
- **Completed:** 2026-05-21T09:12:43Z
- **Tasks:** 3
- **Files modified:** 20

## Accomplishments

- Replaced public registration exposure with owner-only login and refresh endpoints.
- Added `RolesGuard` using `ROLES_KEY`, registered after the global JWT guard.
- Added `seed:owner` so the blogger/admin account is created explicitly.
- Added a hidden `/owner-login` route, SoraBlog-styled login page, persisted auth store, refresh retry, and `sorablog` keyboard easter egg.
- Removed the visible public login link from the header.

## Task Commits

1. **Task 1: Convert backend auth to owner-only login and refresh** - `dade30a`
2. **Task 2: Add explicit owner seed CLI command** - `dade30a`
3. **Task 3: Build hidden owner login frontend slice** - `dade30a`

## Files Created/Modified

- `backend/src/common/guards/roles.guard.ts` - Role metadata enforcement for protected owner/admin APIs.
- `backend/src/modules/auth/auth.controller.ts` - Public registration route removed; owner login and refresh remain public.
- `backend/src/modules/auth/auth.service.ts` - Admin-only credential validation, token generation, refresh verification, and safe user response.
- `backend/src/modules/user/schemas/user.schema.ts` - Added `refreshTokenVersion`.
- `backend/src/scripts/seed-owner.ts` - CLI owner seed script with bcrypt hashing and required credentials.
- `frontend/src/api/client.ts` - Access token attachment and one-shot refresh retry on 401.
- `frontend/src/stores/authStore.ts` - Persisted owner auth state with access and refresh tokens.
- `frontend/src/pages/Auth/OwnerLogin.tsx` - Hidden owner login UI following the supplied soft SoraBlog reference.
- `frontend/src/hooks/useOwnerLoginEasterEgg.ts` - Keyboard sequence listener for opening the hidden route.
- `frontend/src/components/layout/Header.tsx` - Removed visible login link and shows owner state only after auth.

## Decisions Made

- Kept `AUTH-01` covered by the owner seed path instead of reintroducing public visitor registration.
- Used refresh-token versioning in the JWT payload so future logout-all or revocation work has a server-side hook.
- Kept the owner login route addressable for redirects, but removed all normal navigation links to it.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Execution Coupling] Combined Wave 1 task commits**
- **Found during:** Tasks 1-3
- **Issue:** Backend auth, frontend client refresh behavior, and hidden login UI share one auth response contract; committing them separately would leave intermediate commits with mismatched contracts.
- **Fix:** Implemented and verified the full owner-auth contract, then committed the tightly coupled changes together.
- **Files modified:** backend and frontend auth files listed above.
- **Verification:** `backend npm run build`, `backend npm test -- --runInBand`, `frontend npm run lint`, and `frontend npm run build` all passed.
- **Committed in:** `dade30a`

---

**Total deviations:** 1 auto-fixed (execution coupling).
**Impact on plan:** No scope expansion; the combined commit keeps the vertical auth slice buildable.

## Issues Encountered

- Frontend TypeScript required `FormEvent` to be imported as a type-only import under `verbatimModuleSyntax`; fixed before build.

## Verification

- `cd backend && npm run build` - passed.
- `cd backend && npm test -- --runInBand` - passed.
- `cd frontend && npm run lint` - passed.
- `cd frontend && npm run build` - passed.
- `backend/src/modules/auth/auth.controller.ts` contains no `Post('register')`.
- `frontend/src/components/layout/Header.tsx` contains no visible `/login` link.

## User Setup Required

None - no external service configuration required beyond the owner seed command documented in the plan.

## Next Phase Readiness

Ready for Plan 01-02. Visitor identity can now remain separate from owner auth, and upload/admin routes can depend on the new admin role guard.

---
*Phase: 01-infrastructure*
*Completed: 2026-05-21*
