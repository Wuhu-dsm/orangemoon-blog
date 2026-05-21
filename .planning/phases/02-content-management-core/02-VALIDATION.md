---
phase: 2
slug: content-management-core
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-05-21
---

# Phase 2 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Backend framework** | Jest 30 + ts-jest + Nest testing utilities |
| **Backend config file** | `backend/package.json` and `backend/test/jest-e2e.json` |
| **Frontend framework** | ESLint + TypeScript build via Vite |
| **Quick run command** | `cd backend; npm test -- --runInBand` |
| **Full suite command** | `cd backend; npm test -- --runInBand; npm run test:e2e -- --runInBand; cd ../frontend; npm run lint; npm run build` |
| **Estimated runtime** | ~60-120 seconds |

## Sampling Rate

- **After every task commit:** Run the task's `<automated>` command.
- **After every plan wave:** Run the full suite command if the wave touched both backend and frontend; otherwise run the affected workspace test/build command.
- **Before `$gsd-verify-work`:** Full suite must be green.
- **Max feedback latency:** 120 seconds for full phase checks, 60 seconds for per-task checks.

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | INFR-04 / ADMN-03 | T01-01 | Shared content values reject invalid status/body shape at DTO/service boundaries | unit | `cd backend; npm test -- --runInBand slug.util.spec.ts` | existing Jest infra | pending |
| 02-01-02 | 01 | 1 | INFR-04 | T01-02 | Upload purpose allowlist remains enum-validated and admin-only at controller level | unit | `cd backend; npm test -- --runInBand upload.service.spec.ts` | existing Jest infra | pending |
| 02-01-03 | 01 | 1 | ARTC-07 / NOTE-05 / PROJ-05 | T01-03 | Note/project modules are wired without exposing public writes | build | `cd backend; npm run build` | existing build infra | pending |
| 02-05-01 | 05 | 1 | ADMN-01 | T05-01 | Non-admin users cannot reach admin routes through the UI gate | lint/build | `cd frontend; npm run lint` | existing ESLint infra | pending |
| 02-05-02 | 05 | 1 | ADMN-01 | T05-02 | Admin shell follows approved layout contract without route crashes | build | `cd frontend; npm run build` | existing build infra | pending |
| 02-05-03 | 05 | 1 | ADMN-01 | T05-03 | Public sidebar only shows admin entry to admin users | build | `cd frontend; npm run build` | existing build infra | pending |
| 02-02-01 | 02 | 2 | ARTC-07 | T02-01 | Article schema preserves JSON body and soft-delete metadata | unit | `cd backend; npm test -- --runInBand article.service.spec.ts` | existing Jest infra | pending |
| 02-02-02 | 02 | 2 | ARTC-07 / ADMN-03 | T02-02 | Article service filters public reads to published non-deleted documents | unit | `cd backend; npm test -- --runInBand article.service.spec.ts` | existing Jest infra | pending |
| 02-02-03 | 02 | 2 | ARTC-07 / ADMN-03 | T02-03 | Article admin writes require admin role and public reads stay read-only | build | `cd backend; npm run build` | existing build infra | pending |
| 02-03-01 | 03 | 2 | NOTE-05 | T03-01 | Note schema preserves JSON body, note type, status, and soft delete | unit | `cd backend; npm test -- --runInBand note.service.spec.ts` | existing Jest infra | pending |
| 02-03-02 | 03 | 2 | NOTE-05 / ADMN-03 | T03-02 | Note public reads expose only published non-deleted notes | unit | `cd backend; npm test -- --runInBand note.service.spec.ts` | existing Jest infra | pending |
| 02-03-03 | 03 | 2 | NOTE-05 / ADMN-03 | T03-03 | Note admin routes are role-protected | build | `cd backend; npm run build` | existing build infra | pending |
| 02-04-01 | 04 | 2 | PROJ-05 | T04-01 | Project schema supports project-specific metadata and soft delete | unit | `cd backend; npm test -- --runInBand project.service.spec.ts` | existing Jest infra | pending |
| 02-04-02 | 04 | 2 | PROJ-05 / ADMN-03 | T04-02 | Project service supports CRUD/status transitions and public filters | unit | `cd backend; npm test -- --runInBand project.service.spec.ts` | existing Jest infra | pending |
| 02-04-03 | 04 | 2 | PROJ-05 / ADMN-03 | T04-03 | Project admin/public route split is compiled into the app | build | `cd backend; npm run build` | existing build infra | pending |
| 02-06-01 | 06 | 2 | ADMN-03 | T06-01 | Editor content remains JSON-only and vendor imports stay behind adapter | build | `cd frontend; npm run build` | existing build infra | pending |
| 02-06-02 | 06 | 2 | INFR-04 / ADMN-03 | T06-02 | Frontend upload purposes match backend enum and reject local video assumptions | lint/build | `cd frontend; npm run lint; npm run build` | existing build infra | pending |
| 02-06-03 | 06 | 2 | ADMN-03 | T06-03 | Preview renders editor JSON without public preview URLs | build | `cd frontend; npm run build` | existing build infra | pending |
| 02-07-01 | 07 | 3 | ADMN-03 | T07-01 | Admin content API clients use `apiClient` and admin route prefixes | lint/build | `cd frontend; npm run lint` | existing ESLint infra | pending |
| 02-07-02 | 07 | 3 | ADMN-03 | T07-02 | Article/note/project tables expose edit/preview/publish/delete actions | build | `cd frontend; npm run build` | existing build infra | pending |
| 02-07-03 | 07 | 3 | ADMN-03 / INFR-04 | T07-03 | Editor pages save draft, publish, upload, and preview through admin APIs | build | `cd frontend; npm run build` | existing build infra | pending |
| 02-08-01 | 08 | 4 | ADMN-06 | T08-01 | User management writes are admin-only and avoid password leakage | unit/build | `cd backend; npm test -- --runInBand user.service.spec.ts; npm run build` | existing Jest infra | pending |
| 02-08-02 | 08 | 4 | ADMN-04 / ADMN-05 / ADMN-06 | T08-02 | Management pages render clear empty states and safe action affordances | lint/build | `cd frontend; npm run lint; npm run build` | existing build infra | pending |
| 02-08-03 | 08 | 4 | ADMN-01 / ADMN-03 | T08-03 | Full admin workspace passes combined backend/frontend checks | full | `cd backend; npm test -- --runInBand; npm run test:e2e -- --runInBand; cd ../frontend; npm run lint; npm run build` | existing infra | pending |

## Wave 0 Requirements

Existing infrastructure covers all phase requirements.

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Admin visual fidelity | ADMN-01 | Screenshot-level polish needs human judgment against the provided reference | Open `/admin` after execution and compare sidebar, top bar, cards, tables, spacing, teal accent usage, and responsive behavior against `02-UI-SPEC.md`. |

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or existing infrastructure coverage
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all missing references
- [x] No watch-mode flags
- [x] Feedback latency target < 120s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-05-21
