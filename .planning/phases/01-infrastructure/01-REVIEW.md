---
status: clean
phase: "01"
phase_name: "Infrastructure"
review_depth: standard
files_reviewed: 51
findings:
  critical: 0
  warning: 0
  info: 0
  total: 0
reviewed_at: "2026-05-21T17:38:45+08:00"
---

# Phase 01 Code Review

## Scope

Reviewed Phase 01 implementation changes from `e767cae..HEAD`, excluding planning-only files. The review focused on:

- owner-only authentication and hidden login flow
- visitor identity creation and IP/route throttling
- owner-only image upload path and static upload serving
- Docker Compose health checks and production JWT secret handling
- frontend API/store integration for owner and visitor identity

The optional fallow structural pre-pass was skipped because `code_quality.fallow.enabled` is `false`.

## Open Findings

None.

## Resolved During Review

### [P1] Access tokens trusted stale role/status/version claims

- File: `backend/src/modules/auth/strategies/jwt.strategy.ts`
- Fixed in commit: `5e3d207 fix(01): validate active owner access tokens`

Before the review fix, `JwtStrategy.validate` returned the role and identity directly from the token payload. A deleted, banned, downgraded, or token-version-revoked owner could keep using a still-unexpired access token until expiry. The strategy now reloads the user, requires `status === "active"`, compares `refreshTokenVersion`, and returns the current database role.

### [P1] Owner seed password could be echoed by npm CLI arguments

- File: `backend/src/scripts/seed-owner.ts`
- Fixed in commit: `18b7177 fix(01): keep owner seed password out of npm echo`

The seed script did not print secrets itself, but invoking it through `npm run seed:owner -- --password ...` caused npm to echo the full command, including the password. The seed command now rejects `--password`, requires `OWNER_PASSWORD`, supports `npm run --silent seed:owner`, and the README examples were updated to avoid CLI password arguments.

## Verification

- `backend`: `npm run build`
- `backend`: `npm test -- --runInBand`
- `frontend`: `npm run lint`
- `frontend`: `npm run build`
- `backend`: `npm run --silent seed:owner` with `OWNER_PASSWORD`
- `backend`: `npm run --silent seed:owner -- --password ...` rejects CLI password input

All commands passed after the review fixes.
