# Phase 1: Infrastructure - Research

**Researched:** 2026-05-21
**Status:** Complete
**Scope:** Plan Phase 1 from `01-CONTEXT.md`, current codebase maps, local source, and official framework documentation.

## RESEARCH COMPLETE

## Phase Goal

Phase 1 must turn the existing scaffold into a reliable full-stack skeleton: Docker Compose starts the app and dependencies, the backend keeps a consistent API envelope, the blogger can authenticate through a hidden owner flow, anonymous visitors receive backend-issued identities, protected routes return 401, owner-only uploads work, and abuse-sensitive routes return structured 429 responses.

## Key Findings

### Auth Should Be Owner-Centric, Not Public Registration

- The existing `backend/src/modules/auth` already has register/login/token signing primitives, but Phase 1 context supersedes public visitor registration. Planning should refactor toward owner login plus CLI owner seed instead of expanding public account creation.
- `backend/src/common/decorators/roles.decorator.ts` exists, but there is no `RolesGuard`; owner-only upload and future `/admin` work need role enforcement before trusting `@Roles('admin')`.
- Nest's JWT documentation uses `sub` for user id and warns not to hard-code secrets in source. The current code already uses `sub`, but `jwt.config.ts` and `docker-compose.yml` need fail-fast placeholder secret handling in production/compose mode.
- Refresh token support is incomplete: tokens are issued but no `/auth/refresh`, rotation/revocation, or frontend retry flow exists. Phase 1 should implement refresh enough for `AUTH-03`/`AUTH-05`, with server-side token version or persisted refresh token hash if practical.

### Visitor Identity Is A Small Backend Module

- Context requires backend-issued anonymous visitor identity with a friendly nickname and no public IP display.
- Best fit for current architecture: add a `visitor` module with a schema containing `visitorId`, `nickname`, hashed or raw request metadata only as needed for anti-abuse, and timestamps.
- The frontend should use a small persisted visitor store/hook and initialize identity once, not overload `authStore` with non-owner state.

### Rate Limiting Needs NestJS v6 Syntax And A Unified Error Shape

- Official NestJS throttler docs show `ThrottlerModule.forRoot({ throttlers: [...] })` or multiple definitions, with `ttl` in milliseconds and `@Throttle({ default: { limit, ttl } })` style overrides in v5+.
- The docs allow custom `getTracker` and `generateKey`, which maps cleanly to the Phase 1 decision `throttle:{ip}:{route}`. Behind Nginx, trust proxy / forwarded IP behavior should be configured or explicitly documented.
- The built-in storage is memory-backed. Redis-backed storage is better for scaled/distributed deployments, but Phase 1 is local single-node reliability, so in-memory throttling is acceptable if the plan leaves a future Redis-storage note.
- To keep `{ code, data, message }`, either configure `errorMessage` to `操作太频繁，请稍后再试` and let `AllExceptionsFilter` wrap `ThrottlerException`, or extend the guard/filter minimally. Do not return default throttler bodies.

### Upload Can Use NestJS FileInterceptor With Strict Validation

- NestJS file upload docs recommend `FileInterceptor('file')` plus `@UploadedFile()`, and built-in `ParseFilePipe`, `MaxFileSizeValidator`, and `FileTypeValidator` for metadata validation.
- Existing Docker/Nginx already maps the shared `uploads` volume and serves `/uploads`, so the endpoint should write to purpose folders under `UPLOAD_DIR` and return public URLs.
- Phase 1 should keep uploads owner-only and image-only. Do not add visitor uploads, media library, delete UI, cloud storage, or moderation.
- Safe filenames and purpose enum validation are important because purpose values become folder names.

### Docker Compose Reliability Should Use Healthchecks, Not Just depends_on Order

- Docker's Compose docs distinguish container startup order from readiness: short `depends_on` starts dependencies first, but `condition: service_healthy` waits for healthchecks to pass.
- Compose supports service `healthcheck` with `test`, `interval`, `timeout`, `retries`, and `start_period`; this should be applied to MongoDB, Redis, Elasticsearch, backend health endpoint, and frontend/Nginx.
- Backend currently imports MongoDB, Redis/Bull, and Elasticsearch in `AppModule`, so startup depends on all services. Healthchecks plus retry/fail clarity are safer than leaving random startup races.
- README quickstart must explain env vars, owner seed command, compose startup, health verification, and the development vs production secret behavior.

## Codebase Implications

### Existing Files To Reuse

- `backend/src/main.ts` already centralizes global prefix, validation, interceptors, filters, and global JWT guard.
- `backend/src/modules/auth/*` and `backend/src/modules/user/*` are the owner auth foundation.
- `frontend/src/api/client.ts` is the correct place for access-token attachment, refresh retry, and 401 logout/redirect behavior.
- `frontend/src/stores/authStore.ts` should remain the owner auth store; visitor identity should be separate to avoid confusing anonymous visitors with authenticated users.
- `frontend/src/router/index.tsx` currently only registers `/`, so the hidden login route must be explicitly added.
- `frontend/src/components/layout/Header.tsx` currently exposes a visible `/login` link; Phase 1 must remove or replace that visible public-login affordance.

### Testing Approach

- Backend should add unit tests for auth refresh/owner login, roles guard, upload validation, visitor identity, and 429 behavior where feasible.
- Backend e2e should either reuse app bootstrap setup or extract shared bootstrap configuration so global prefix, guards, filters, and interceptors are exercised.
- Frontend has no test runner; Phase 1 frontend verification should use `npm run lint` and `npm run build`, plus browser/manual smoke checks if execution reaches UI verification.
- Full-stack verification should include `docker compose up -d`, `docker compose ps`, backend `/api/v1/health`, frontend root response, and representative API calls.

## Recommended Plan Shape

1. **Walking skeleton and owner auth:** owner seed command, owner login/refresh, roles guard, hidden login route, auth persistence/refresh retry.
2. **Visitor identity and rate limiting:** backend visitor module, frontend visitor initialization/display, throttler configuration and structured 429.
3. **Owner-only uploads:** upload module/controller/service with purpose folders, image validation, public URL response, owner-only authorization.
4. **Compose reliability and docs:** health endpoints/checks, placeholder secret failure, README quickstart, final full-stack verification.

## Risks To Carry Into Planning

- `AUTH-01` is superseded by context. Plans still need to mention it for GSD coverage, but executors must not reintroduce public visitor registration.
- Upload purpose `guestbook-image` is only a reserved purpose/type in Phase 1; visitor uploads stay disabled until the community phase.
- If Docker images lack `curl`, `wget`, `mongosh`, or other healthcheck binaries, healthchecks may require image-specific commands or Dockerfile package additions.
- Backend `npm run lint` uses `--fix`, so execution should inspect/stage changes carefully after linting.

## Sources

- NestJS Authentication documentation: https://docs.nestjs.com/security/authentication
- NestJS Rate Limiting documentation: https://docs.nestjs.com/security/rate-limiting
- NestJS File Upload documentation: https://docs.nestjs.com/techniques/file-upload
- Docker Compose service reference: https://docs.docker.com/reference/compose-file/services/
- Docker Compose startup order guide: https://docs.docker.com/compose/how-tos/startup-order/

