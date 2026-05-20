---
last_mapped_commit: 249405fa2e2191357ed67cbdcac75a3c4968120a
last_mapped_at: 2026-05-20
---

# Architecture

**Analysis Date:** 2026-05-20

## Pattern Overview

**Overall:** Frontend SPA plus modular NestJS API, deployed as separate Docker services.

**Key Characteristics:**
- Repository-level split between `frontend` and `backend`.
- Frontend is a React single-page application with client-side routing.
- Backend is a NestJS monolith with feature modules.
- MongoDB is the primary persistence layer; Redis, Bull, and Elasticsearch are configured as shared infrastructure.
- Nginx serves frontend assets and proxies API calls in production.
- Current implementation is an early slice of a larger planned SoraBlog system described in `docs/superpowers`.

## Layers

**Frontend App Shell:**
- Purpose: mount providers and route tree.
- Contains: `frontend/src/main.tsx`, `frontend/src/App.tsx`, and `frontend/src/router/index.tsx`.
- Depends on: React, React Router, TanStack Query.
- Used by: the browser runtime through `frontend/index.html`.

**Frontend Layout Layer:**
- Purpose: persistent page chrome and shared dashboard layout.
- Contains: `frontend/src/pages/Layout.tsx`, `frontend/src/components/layout/Header.tsx`, `frontend/src/components/layout/Sidebar.tsx`, and `frontend/src/components/layout/ThemeToggle.tsx`.
- Depends on: Zustand stores, lucide icons, React Router links/outlets.
- Used by: routes declared in `frontend/src/router/index.tsx`.

**Frontend Feature Components:**
- Purpose: home dashboard sections and reusable business UI.
- Contains: `frontend/src/components/home/*.tsx`.
- Depends on: local UI primitives in `frontend/src/components/ui`, motion/chart/icon libraries, static assets under `frontend/public/images`.
- Used by: `frontend/src/pages/Home/Home.tsx` and the right rail in `Layout.tsx`.

**Frontend UI Primitives:**
- Purpose: reusable, weakly business-coupled components.
- Contains: `frontend/src/components/ui/button.tsx`, `card.tsx`, `input.tsx`, and related primitives.
- Depends on: `@/lib/utils`, Radix UI where needed, class-variance-authority where variants are needed.
- Used by: feature components and future pages.

**Frontend State and API Layer:**
- Purpose: cross-page state and HTTP client.
- Contains: `frontend/src/stores/*.ts` and `frontend/src/api/client.ts`.
- Depends on: Zustand persist, Axios.
- Used by: layout, auth UI, and future data hooks.

**Backend Bootstrap and Cross-Cutting Layer:**
- Purpose: configure the Nest application boundary.
- Contains: `backend/src/main.ts`, `backend/src/app.module.ts`, `backend/src/common`.
- Depends on: Nest core, ConfigModule, global guards, pipes, filters, and interceptors.
- Used by: every HTTP request.

**Backend Feature Modules:**
- Purpose: group controllers, services, DTOs, and schemas by domain.
- Contains: `backend/src/modules/auth`, `backend/src/modules/user`, and `backend/src/modules/article`.
- Depends on: shared modules, Mongoose models, JWT services, DTO validation.
- Used by: `AppModule`.

**Backend Shared Infrastructure:**
- Purpose: wrap infrastructure clients for reuse across feature modules.
- Contains: `backend/src/shared/redis`, `backend/src/shared/elasticsearch`, and `backend/src/shared/bull`.
- Depends on: `@nestjs/config`, `ioredis`, `@nestjs/elasticsearch`, and `@nestjs/bull`.
- Used by: `AppModule` and future feature services.

## Data Flow

**Frontend Page Load:**
1. Browser loads `frontend/index.html`.
2. `frontend/src/main.tsx` renders `App` into `#root`.
3. `frontend/src/App.tsx` installs `QueryClientProvider` and `RouterProvider`.
4. `frontend/src/router/index.tsx` matches `/` and renders `Layout`.
5. `Layout` renders `Header`, `Sidebar`, `Outlet`, and the right-rail home widgets.
6. The index route renders `frontend/src/pages/Home/Home.tsx`, which composes home dashboard sections.

**Authenticated Backend Request:**
1. Frontend calls `apiClient` from `frontend/src/api/client.ts`.
2. Request interceptor attaches the persisted auth token if present.
3. Nginx or Vite proxy forwards `/api` requests to the Nest backend.
4. `backend/src/main.ts` applies global prefix, validation, interceptors, exception filter, and `JwtAuthGuard`.
5. `JwtAuthGuard` permits handlers marked with `@Public()` or delegates to the Passport JWT strategy.
6. Controller handles the route and delegates to a service.
7. Service reads/writes MongoDB through Mongoose or returns computed data.
8. `TransformInterceptor` wraps success as `{ code, data, message }`.
9. `AllExceptionsFilter` wraps thrown exceptions into the same high-level response envelope with `data: null`.

**Auth Flow:**
1. `POST /api/v1/auth/register` or `POST /api/v1/auth/login` enters `AuthController`.
2. DTO validation is applied globally using `ValidationPipe`.
3. `AuthService` checks users via `UserService.findByEmailOrUsername`.
4. Registration hashes passwords with bcrypt before saving the user.
5. Login compares bcrypt hashes.
6. `AuthService.generateTokens` signs access and refresh tokens using JWT config.

**Deployment Flow:**
1. `docker-compose.yml` builds `frontend` and `backend`.
2. Frontend build output is copied into Nginx.
3. Backend build output is run by Node.
4. Service DNS names connect backend to MongoDB, Redis, and Elasticsearch.
5. Nginx proxies `/api` to `http://backend:3000`.

## State Management

**Client State:**
- Auth state persists via `frontend/src/stores/authStore.ts`.
- Theme state persists via `frontend/src/stores/themeStore.ts`; `ThemeToggle` mirrors it to `document.documentElement.classList`.
- Sidebar state is transient in `frontend/src/stores/sidebarStore.ts`.

**Server State:**
- MongoDB stores users through `UserSchema`.
- Redis is available through `RedisService`, but no feature module currently uses it.
- Elasticsearch and Bull are available wrappers, but no feature module currently uses queues or search indexing.

## Key Abstractions

**Nest Module:**
- Purpose: domain and infrastructure composition.
- Examples: `AuthModule`, `UserModule`, `ArticleModule`, `RedisModule`, `ElasticsearchModule`, `BullModule`.
- Pattern: Nest module imports/exports/providers.

**Controller:**
- Purpose: HTTP boundary and route declarations.
- Examples: `AuthController`, `UserController`, `ArticleController`.
- Pattern: thin handlers delegating to services.

**Service:**
- Purpose: business logic and persistence operations.
- Examples: `AuthService`, `UserService`, `RedisService`, `ElasticsearchService`.
- Pattern: injectable classes with constructor dependency injection.

**Decorator:**
- Purpose: route metadata and request extraction.
- Examples: `@Public()`, `@Roles()`, `@CurrentUser()`.
- Pattern: Nest metadata decorators and param decorators.

**UI Primitive:**
- Purpose: reusable presentation building blocks.
- Examples: `Button`, `Card`, `Input`, `Badge`.
- Pattern: typed React components, local variants, `cn` class merging.

**Zustand Store:**
- Purpose: global client state.
- Examples: `useAuthStore`, `useThemeStore`, `useSidebarStore`.
- Pattern: small hooks with explicit TypeScript state interfaces.

## Entry Points

**Frontend Runtime:**
- Location: `frontend/src/main.tsx`.
- Triggers: browser loads bundled script.
- Responsibilities: create React root and render `App`.

**Frontend Router:**
- Location: `frontend/src/router/index.tsx`.
- Triggers: React Router browser navigation.
- Responsibilities: define route hierarchy and page elements.

**Backend Runtime:**
- Location: `backend/src/main.ts`.
- Triggers: `nest start`, `nest start --watch`, or `node dist/main`.
- Responsibilities: create app, install global behavior, listen on port.

**Backend Module Root:**
- Location: `backend/src/app.module.ts`.
- Triggers: Nest application bootstrap.
- Responsibilities: load config, connect infrastructure, register feature modules.

**Docker Runtime:**
- Location: `docker-compose.yml`.
- Triggers: `docker-compose up`.
- Responsibilities: orchestrate frontend, backend, MongoDB, Redis, Elasticsearch, volumes, and network.

## Error Handling

**Backend Strategy:**
- Global exception filter catches all thrown exceptions in `backend/src/common/filters/all-exceptions.filter.ts`.
- HTTP exceptions preserve their status; unknown exceptions become 500.
- Returned error shape is `{ code, data: null, message }`.

**Backend Success Shape:**
- `TransformInterceptor` wraps successful handler output as `{ code: 200, data, message: 'success' }`.

**Frontend Strategy:**
- API response interceptor unwraps backend response bodies.
- 401 responses clear auth state and redirect to `/login`.
- Component-level error boundaries are not present.

## Cross-Cutting Concerns

**Validation:**
- Backend uses global `ValidationPipe({ whitelist: true, transform: true })`.
- Existing DTOs are `backend/src/modules/auth/dto/register.dto.ts` and `login.dto.ts`.
- `UserController.updateProfile` accepts a TypeScript type, not a class-validator DTO.

**Authentication:**
- Global JWT guard protects all backend routes unless marked with `@Public()`.
- JWT payload maps `sub` to `userId` in `JwtStrategy.validate`.

**Logging:**
- `LoggingInterceptor` logs method, URL, and elapsed time for successful requests.
- Error logging beyond exception response shaping is not implemented.

**Response Format:**
- Both success and error responses are normalized globally.
- Frontend API client assumes that normalized shape and returns `response.data`.

**Design System:**
- Tailwind theme tokens are defined in `frontend/src/index.css`.
- Component primitives use CSS variables and `cn`.

---

*Architecture analysis: 2026-05-20*
*Update when major patterns, modules, or data flows change.*
