---
last_mapped_commit: 249405fa2e2191357ed67cbdcac75a3c4968120a
last_mapped_at: 2026-05-20
---

# Codebase Concerns

**Analysis Date:** 2026-05-20

## Tech Debt

**Planned system is much larger than implemented source:**
- Issue: `docs/superpowers` describes an 18-page, multi-domain blog system, but current source implements only the home route on the frontend and auth/user/articles placeholder routes on the backend.
- Files: `docs/superpowers/specs/2026-05-19-blog-design.md`, `frontend/src/router/index.tsx`, `backend/src/modules/article/article.controller.ts`.
- Impact: Navigation links and planning docs can imply functionality that does not exist yet.
- Fix approach: Treat docs as roadmap, then implement one vertical slice at a time with routes, API modules, schemas, and tests kept in sync.

**Infrastructure wrappers are present before feature usage:**
- Issue: Redis, Bull, and Elasticsearch modules are configured, but current business modules do not use them.
- Files: `backend/src/shared/redis/redis.service.ts`, `backend/src/shared/bull/bull.module.ts`, `backend/src/shared/elasticsearch/elasticsearch.service.ts`.
- Impact: Deployment has extra moving parts before the code depends on them; failures in infrastructure can affect app startup earlier than necessary.
- Fix approach: Either keep them as intentional foundation and add health checks, or defer imports until the first feature uses them.

**Frontend data layer is mostly unused:**
- Issue: `QueryClientProvider` and `apiClient` exist, but home components render static arrays rather than server data.
- Files: `frontend/src/App.tsx`, `frontend/src/api/client.ts`, `frontend/src/components/home/*.tsx`.
- Impact: Future migration from mock/static data to API data may touch many components at once.
- Fix approach: Add feature-specific API wrappers and query hooks as each backend endpoint becomes real.

**Route registration lags behind sidebar navigation:**
- Issue: Sidebar links point to `/articles`, `/projects`, `/notes`, `/timeline`, `/about`, `/friends`, and `/guestbook`, but router currently registers only `/`.
- Files: `frontend/src/components/layout/Sidebar.tsx`, `frontend/src/router/index.tsx`.
- Impact: Clicking most nav items will hit unmatched routes.
- Fix approach: Add placeholder or real route pages as soon as navigation is exposed, or hide links until the pages exist.

## Known Bugs

**Article endpoint returns placeholder data:**
- Symptoms: `GET /api/v1/articles` always returns an empty array.
- Trigger: Any request to `/api/v1/articles`.
- File: `backend/src/modules/article/article.controller.ts`.
- Root cause: Article service, schema, DTOs, and persistence layer are not implemented.
- Fix approach: Add article schema/service/controller methods and frontend API integration for real article data.

**Frontend 401 redirect targets an unregistered route:**
- Symptoms: API 401 causes `window.location.href = '/login'`, but `/login` is not registered in the router.
- Trigger: Any API request that receives HTTP 401.
- File: `frontend/src/api/client.ts`.
- Root cause: Auth UI route has not been implemented.
- Fix approach: Add login/register pages and routes, or redirect to an implemented auth modal/route.

**Backend e2e test does not mirror production bootstrap:**
- Symptoms: `backend/test/app.e2e-spec.ts` tests `/` against a testing app without the global prefix and global filters/guards/interceptors from `backend/src/main.ts`.
- Trigger: Running `npm run test:e2e`.
- Root cause: Test creates `AppModule` directly and does not apply the same bootstrap setup.
- Fix approach: Extract bootstrap configuration into a reusable function and apply it in e2e tests.

## Security Considerations

**JWT secret fallback must not be used in production:**
- Risk: `backend/src/config/jwt.config.ts` has a fallback secret when `JWT_SECRET` is absent.
- Current mitigation: `docker-compose.yml` expects `JWT_SECRET` through environment substitution.
- Recommendation: Fail fast in production if `JWT_SECRET` is missing, and use a strong deployment secret.

**Refresh tokens are issued but not managed server-side:**
- Risk: `AuthService.generateTokens` returns refresh tokens, but no refresh endpoint, revocation, rotation, or blacklist exists.
- Files: `backend/src/modules/auth/auth.service.ts`, `backend/src/modules/auth/auth.controller.ts`.
- Current mitigation: Access token expiry is configurable.
- Recommendation: Add refresh/logout endpoints, token rotation, and revocation storage before relying on refresh tokens.

**Role metadata exists without enforcement:**
- Risk: `@Roles()` can annotate handlers, but no roles guard is registered.
- File: `backend/src/common/decorators/roles.decorator.ts`.
- Current mitigation: Global JWT authentication protects non-public routes.
- Recommendation: Implement and globally/register a `RolesGuard` before adding admin endpoints.

**Profile update body is not DTO-validated:**
- Risk: `PATCH /users/me` accepts a TypeScript type only; runtime validation does not enforce field types for nested `socials`.
- File: `backend/src/modules/user/user.controller.ts`.
- Current mitigation: Controller destructures only allowed top-level keys.
- Recommendation: Add `UpdateProfileDto` with nested class-validator rules.

**CORS is wide open:**
- Risk: `app.enableCors()` permits broad defaults.
- File: `backend/src/main.ts`.
- Current mitigation: Auth uses bearer tokens, not cookies.
- Recommendation: Restrict origins by environment for production.

## Performance Bottlenecks

**Frontend bundle is already large for a small implemented app:**
- Problem: `npm run build` emitted an index JavaScript chunk around 794 kB minified and 246 kB gzip during mapping.
- Files: `frontend/src/App.tsx`, `frontend/src/pages/Layout.tsx`, `frontend/src/components/home/ReadingStats.tsx`, dependencies in `frontend/package.json`.
- Cause: Charting, motion, Radix, and UI dependencies are loaded into the main route.
- Improvement path: Add route-level lazy loading and consider lazy loading heavier widgets such as chart sections.

**All backend infrastructure connects at startup:**
- Problem: MongoDB, Redis/Bull, and Elasticsearch are imported in `AppModule`, so full backend startup depends on all configured services.
- Files: `backend/src/app.module.ts`, `backend/src/shared/*`.
- Cause: Infrastructure modules are globally available from the root module.
- Improvement path: Add health checks and consider deferring optional integrations until the feature that needs them is enabled.

## Fragile Areas

**Global response envelope:**
- Why fragile: `TransformInterceptor` wraps every success response and `AllExceptionsFilter` wraps errors. Frontend callers need to know whether they receive raw Axios data, the envelope, or the nested payload.
- Files: `backend/src/common/interceptors/transform.interceptor.ts`, `backend/src/common/filters/all-exceptions.filter.ts`, `frontend/src/api/client.ts`.
- Common failures: Double-unwrapping responses or expecting `data` where the API client already returned the envelope.
- Safe modification: Add typed API response helpers and test the client/interceptor contract before broad API work.
- Test coverage: no tests cover the response envelope or Axios client.

**Auth state persistence:**
- Why fragile: token and user data are persisted in localStorage through Zustand.
- File: `frontend/src/stores/authStore.ts`.
- Common failures: stale token after backend revocation, redirect loops on 401, cross-tab inconsistency.
- Safe modification: Add a central auth flow, token refresh strategy, and tests around logout/401 handling.
- Test coverage: none.

**Theme class synchronization:**
- Why fragile: theme persistence lives in `themeStore`, but DOM class application happens only when `ThemeToggle` is mounted.
- Files: `frontend/src/stores/themeStore.ts`, `frontend/src/components/layout/ThemeToggle.tsx`.
- Common failures: initial flash or stale theme if the toggle component is not rendered on a route.
- Safe modification: move root class sync into an app-level hook or provider.
- Test coverage: none.

**Home dashboard static data:**
- Why fragile: multiple sections hold hardcoded arrays in component files.
- Files: `frontend/src/components/home/BannerCarousel.tsx`, `LatestArticles.tsx`, `FeaturedProjects.tsx`, `ReadingStats.tsx`, `Timeline.tsx`.
- Common failures: duplicated data shape drift when APIs are introduced.
- Safe modification: define shared frontend types and API adapters before replacing static arrays.
- Test coverage: none.

## Scaling Limits

**Local filesystem uploads:**
- Current capacity: bounded by the Docker host volume.
- Limit: no object storage, CDN, cleanup job, or metadata model is present.
- Symptoms at limit: disk pressure, slow static serving, difficult multi-host deployment.
- Scaling path: introduce object storage or a managed storage service when upload features become real.

**Single NestJS service and Docker Compose deployment:**
- Current capacity: suitable for local/small deployment.
- Limit: no horizontal scaling, no process manager, no CI/CD, no managed secrets.
- Symptoms at limit: deploys become manual and service recovery is operationally fragile.
- Scaling path: add CI, health checks, managed secrets, backups, and a production deployment target.

## Dependencies at Risk

**Elasticsearch 8 with security disabled in Compose:**
- Risk: `docker-compose.yml` disables Elasticsearch security for local simplicity.
- Impact: unsafe if exposed beyond trusted local/internal networks.
- Migration plan: keep it local-only, or configure auth/TLS for any hosted/prod ES deployment.

**Frontend uses Vite 8 and TypeScript 6-era dependencies:**
- Risk: the stack is modern and may have ecosystem churn.
- Impact: plugin or type behavior can shift during upgrades.
- Migration plan: pin lockfile, run `npm run build` and `npm run lint` after dependency changes.

## Missing Critical Features

**No real content domain implementation yet:**
- Problem: Articles, projects, notes, tags, timeline, friend links, guestbook, search, uploads, subscriptions, and admin are planned but mostly absent.
- Current workaround: static frontend data and placeholder `GET /articles`.
- Blocks: full blog functionality, search, admin, and production content management.
- Implementation complexity: high; should be phased.

**No seed data implementation:**
- Problem: phase docs reference seed data, but no `backend/src/seed.ts` exists.
- Current workaround: static frontend arrays.
- Blocks: local demo data and automated full-stack verification.
- Implementation complexity: medium once schemas are added.

**No CI pipeline:**
- Problem: no automated build/test/lint gate exists.
- Current workaround: manual commands.
- Blocks: reliable collaboration and regression detection.
- Implementation complexity: low to medium.

## Test Coverage Gaps

**Auth flow:**
- What's not tested: registration conflict, password hashing, login failure, token payload/expiry.
- Risk: authentication regressions could ship unnoticed.
- Priority: high.
- Difficulty: medium due to Mongoose/JWT/bcrypt dependencies.

**Global API behavior:**
- What's not tested: validation pipe, public route metadata, JWT guard, transform interceptor, exception filter.
- Risk: frontend/backend contract breaks silently.
- Priority: high.
- Difficulty: medium; best covered with e2e tests mirroring `main.ts`.

**Frontend UI and routing:**
- What's not tested: route rendering, sidebar navigation, theme switching, auth redirect behavior, carousel interaction.
- Risk: UI regressions and dead routes.
- Priority: medium.
- Difficulty: medium because frontend test tooling is not installed.

**Infrastructure wrappers:**
- What's not tested: Redis service methods, Elasticsearch wrapper behavior, Bull configuration parsing.
- Risk: production startup/runtime failures around external services.
- Priority: medium.
- Difficulty: medium; can start with mocked unit tests.

---

*Concerns audit: 2026-05-20*
*Update as issues are fixed or new concerns are discovered.*
