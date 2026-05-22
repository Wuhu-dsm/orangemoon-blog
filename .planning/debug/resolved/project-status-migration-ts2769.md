---
slug: project-status-migration-ts2769
status: resolved
created_at: 2026-05-22T23:08:00+08:00
phase: debug
---

# Project Status Migration TS2769

## Symptom

`npm run build` in `backend` fails with TS2769 in `src/modules/project/migrations/update-project-status-values.ts`.

The failing filter is:

```ts
{ projectStatus: oldStatus }
```

## Reproduction

Command:

```powershell
npm run build
```

Result:

```text
Type 'string' is not assignable to type ProjectStatus query condition.
```

## Current Hypothesis

The migration intentionally queries legacy values (`planning`, `in-progress`, `completed`, `maintenance`) that are no longer valid members of the typed `ProjectStatus` enum. Mongoose's strict `Model<Project>` update typing rejects those legacy strings even though they are valid historical database values for this migration.

## Investigation Notes

- `migrateProjectStatuses` is only referenced inside the standalone migration file.
- `projectStatus` is typed as `ProjectStatus` in `project.schema.ts`.
- `OLD_TO_NEW` was declared as `Record<string, string>`, which widened both old and new statuses to plain `string`.
- `getModelToken` was imported but unused.

## Planned Fix

Keep the public migration function accepting `Model<Project>`, but cast to a small migration-only model surface inside the function. Explicitly type legacy statuses and map them to current `ProjectStatus` enum values.

## Resolution

Implemented a migration-only type boundary:

- `LegacyProjectStatus` captures the historical persisted status strings.
- `OLD_TO_NEW` maps legacy values to current `ProjectStatus` enum values.
- The public function still accepts `Model<Project>`.
- Inside the migration, the model is cast to a minimal `updateMany` surface that permits legacy filter values.
- The standalone runner now uses static Mongoose imports instead of `require('mongoose')`.

## Verification

```powershell
cd backend
npm run build
npm test -- project.service.spec.ts
npx eslint src/modules/project/migrations/update-project-status-values.ts
```

All three checks passed after the fix.

Full `npm run lint` still has unrelated pre-existing errors in other backend files, including enum comparison, async-without-await, unused imports in service specs, and mock type safety issues.
