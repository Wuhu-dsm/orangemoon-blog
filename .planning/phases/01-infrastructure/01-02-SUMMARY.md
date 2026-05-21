---
phase: 01-infrastructure
plan: 02
subsystem: infra
tags: [nestjs, throttler, visitor-identity, react, zustand]
requires:
  - phase: 01-01
    provides: owner auth guard stack and hidden auth client behavior
provides:
  - backend-issued anonymous visitor sessions
  - IP + route based throttling guard
  - normalized 429 response message
  - persisted frontend visitor identity display
affects: [visitor, auth, upload, public-ui]
tech-stack:
  added: []
  patterns:
    - public visitor session endpoint under `/visitors/session`
    - global `IpRouteThrottlerGuard`
    - visitor identity kept separate from owner auth
key-files:
  created:
    - backend/src/common/guards/ip-route-throttler.guard.ts
    - backend/src/config/rate-limit.config.ts
    - backend/src/modules/visitor/visitor.controller.ts
    - backend/src/modules/visitor/visitor.module.ts
    - backend/src/modules/visitor/visitor.service.ts
    - backend/src/modules/visitor/schemas/visitor.schema.ts
    - frontend/src/api/visitor.ts
    - frontend/src/hooks/useVisitorIdentity.ts
    - frontend/src/stores/visitorStore.ts
  modified:
    - backend/src/app.module.ts
    - backend/src/common/filters/all-exceptions.filter.ts
    - backend/src/modules/auth/auth.controller.ts
    - frontend/src/components/layout/Header.tsx
    - frontend/src/pages/Layout.tsx
key-decisions:
  - Visitor display uses generated nicknames only; IP is hashed for internal metadata and never returned.
  - Throttle storage remains the Nest default for Phase 1 local reliability, with IP + route key generation.
  - Visitor state is persisted in `visitorStore`, not `authStore`.
patterns-established:
  - Public app mount hooks can initialize non-auth visitor state.
  - Sensitive endpoints declare stricter `@Throttle` limits than global browsing defaults.
requirements-completed: [INFR-02, INFR-03, AUTH-04]
duration: 10 min
completed: 2026-05-21
---

# Phase 01 Plan 02: Visitor Identity And Throttling Summary

**Anonymous visitor sessions with friendly nicknames plus route-aware throttling and normalized 429 errors**

## Performance

- **Duration:** 10 min
- **Started:** 2026-05-21T09:13:00Z
- **Completed:** 2026-05-21T09:23:00Z
- **Tasks:** 3
- **Files modified:** 16

## Accomplishments

- Added `VisitorModule` with a public `POST /api/v1/visitors/session` endpoint returning only `{ visitorId, nickname }`.
- Added visitor schema fields for friendly nickname, user-agent hash, IP hash, and first/last seen timestamps.
- Added global throttler configuration and `IpRouteThrottlerGuard` keys shaped as `throttle:{ip}:{route}`.
- Added stricter throttles to owner login, refresh, and visitor session endpoints.
- Added `visitorStore`, `useVisitorIdentity`, and header visitor nickname display for non-owner visitors.

## Task Commits

1. **Task 1: Add backend visitor identity module** - `faacd49`
2. **Task 2: Configure focused throttling with normalized 429** - `faacd49`
3. **Task 3: Initialize visitor identity in the frontend** - `faacd49`

## Files Created/Modified

- `backend/src/modules/visitor/visitor.controller.ts` - Public visitor session endpoint.
- `backend/src/modules/visitor/visitor.service.ts` - Upserts visitor sessions and generates nicknames.
- `backend/src/common/guards/ip-route-throttler.guard.ts` - IP + route throttle key generation.
- `backend/src/config/rate-limit.config.ts` - Central throttling defaults and friendly 429 message.
- `backend/src/common/filters/all-exceptions.filter.ts` - Guarantees normalized rate-limit message.
- `frontend/src/hooks/useVisitorIdentity.ts` - Initializes visitor identity on public app load.
- `frontend/src/stores/visitorStore.ts` - Persists visitor id and nickname.
- `frontend/src/components/layout/Header.tsx` - Displays visitor nickname when owner is not authenticated.

## Decisions Made

- Used hashed IP/user-agent metadata for abuse context without exposing either to the frontend.
- Mounted visitor initialization in `Layout`, alongside the owner-login easter egg.
- Kept a loose global throttle and stricter route annotations for sensitive public endpoints.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Verification Constraint] Used code-level throttle verification instead of live repeated requests**
- **Found during:** Task 2 verification
- **Issue:** The phase is not running against a live MongoDB-backed backend yet, so repeatedly triggering real 429 responses would require starting runtime services before the Compose plan.
- **Fix:** Verified build/tests and static enforcement points: throttler module registration, `IpRouteThrottlerGuard`, route `@Throttle` annotations, and the exception filter 429 message.
- **Files modified:** None beyond planned files.
- **Verification:** Backend build/test, frontend lint/build, and targeted `Select-String` checks passed.
- **Committed in:** `faacd49`

---

**Total deviations:** 1 auto-fixed (verification constraint).
**Impact on plan:** Runtime 429 smoke testing is deferred to the Compose/full-stack verification once services are running.

## Issues Encountered

None.

## Verification

- `cd backend && npm run build` - passed.
- `cd backend && npm test -- --runInBand` - passed.
- `cd frontend && npm run lint` - passed.
- `cd frontend && npm run build` - passed.
- Static checks confirmed public visitor endpoint, route throttle annotations, `generateKey`, normalized 429 message, and visitor UI display.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Ready for Plan 01-03. Upload endpoints can now use the existing owner auth guard and inherit the stricter throttling model.

---
*Phase: 01-infrastructure*
*Completed: 2026-05-21*
