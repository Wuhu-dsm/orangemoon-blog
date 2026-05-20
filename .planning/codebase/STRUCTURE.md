---
last_mapped_commit: 249405fa2e2191357ed67cbdcac75a3c4968120a
last_mapped_at: 2026-05-20
---

# Codebase Structure

**Analysis Date:** 2026-05-20

## Directory Layout

```text
orangemoon-blog/
|-- backend/              # NestJS API service
|   |-- src/              # Backend source
|   |-- test/             # Backend e2e tests
|   |-- package.json      # Backend scripts and dependencies
|   |-- Dockerfile        # Backend container build
|   `-- eslint.config.mjs # Backend lint config
|-- frontend/             # React/Vite SPA
|   |-- src/              # Frontend source
|   |-- public/           # Static assets served by Vite/Nginx
|   |-- package.json      # Frontend scripts and dependencies
|   |-- Dockerfile        # Frontend build and Nginx image
|   `-- nginx.conf        # Production SPA/API proxy config
|-- docs/                 # Superpowers specs and implementation plans
|-- home-ui-design/       # Home page visual design assets and design notes
|-- ui-drafts/            # Page mockup PNGs for planned UI screens
|-- sidebar/              # Sidebar visual assets
|-- output/               # Generated or exported output assets
|-- docker-compose.yml    # Full-stack local/production orchestration
|-- .env.example          # Environment variable template
|-- agents.md             # Project instructions for agents
`-- README.md             # Minimal project readme
```

## Directory Purposes

**`backend/`:**
- Purpose: NestJS API service.
- Contains: Nest bootstrap, config, common decorators/filters/interceptors, feature modules, shared infrastructure wrappers, tests, and Docker config.
- Key files: `backend/src/main.ts`, `backend/src/app.module.ts`, `backend/package.json`, `backend/Dockerfile`.
- Subdirectories:
  - `backend/src/config` for environment-backed config namespaces.
  - `backend/src/common` for cross-cutting decorators, filters, and interceptors.
  - `backend/src/modules` for business domains.
  - `backend/src/shared` for infrastructure clients.

**`frontend/`:**
- Purpose: React SPA for the blog UI.
- Contains: Vite app shell, React Router route config, layout components, home dashboard components, UI primitives, stores, API client, static assets, and deployment config.
- Key files: `frontend/src/main.tsx`, `frontend/src/App.tsx`, `frontend/src/router/index.tsx`, `frontend/src/index.css`, `frontend/package.json`.
- Subdirectories:
  - `frontend/src/components/ui` for shared primitives.
  - `frontend/src/components/home` for home feature sections.
  - `frontend/src/components/layout` for Header/Sidebar/ThemeToggle.
  - `frontend/src/pages` for route pages and page-level composition.
  - `frontend/src/stores` for Zustand stores.
  - `frontend/src/api` for HTTP clients.
  - `frontend/src/lib` for utilities such as `cn`.

**`docs/superpowers/`:**
- Purpose: planning and product/design documentation.
- Contains: `docs/superpowers/specs/2026-05-19-blog-design.md` and multiple phase plans under `docs/superpowers/plans`.
- Important note: these docs describe a larger target system than what is currently implemented.

**`home-ui-design/`, `ui-drafts/`, `sidebar/`:**
- Purpose: design source assets and mockups.
- Contains: PNG images and design notes used to guide frontend implementation.

**`.planning/codebase/`:**
- Purpose: generated GSD codebase map.
- Contains: this mapping set: `STACK.md`, `INTEGRATIONS.md`, `ARCHITECTURE.md`, `STRUCTURE.md`, `CONVENTIONS.md`, `TESTING.md`, and `CONCERNS.md`.

## Backend Source Layout

```text
backend/src/
|-- main.ts                       # Nest app bootstrap and global middleware-like setup
|-- app.module.ts                 # Root module and infrastructure imports
|-- app.controller.ts             # Default root controller
|-- app.service.ts                # Default root service
|-- config/
|   |-- database.config.ts        # MongoDB URI config
|   |-- redis.config.ts           # Redis URL config
|   |-- elasticsearch.config.ts   # Elasticsearch node config
|   |-- jwt.config.ts             # JWT secret/expiry config
|   `-- index.ts                  # Config barrel
|-- common/
|   |-- decorators/               # CurrentUser/Public/Roles decorators
|   |-- filters/                  # Global exception filter
|   `-- interceptors/             # Response transform and request logging
|-- modules/
|   |-- auth/                     # Auth controller/service/DTOs/JWT strategy
|   |-- user/                     # User controller/service/schema
|   `-- article/                  # Article module and placeholder controller
`-- shared/
    |-- redis/                    # Redis module and service
    |-- elasticsearch/            # Elasticsearch module and service
    `-- bull/                     # Bull module
```

## Frontend Source Layout

```text
frontend/src/
|-- main.tsx                      # React root creation
|-- App.tsx                       # Query and router providers
|-- index.css                     # Tailwind imports and theme variables
|-- router/
|   `-- index.tsx                 # React Router config
|-- pages/
|   |-- Layout.tsx                # Shared application layout
|   `-- Home/
|       `-- Home.tsx              # Home route composition
|-- components/
|   |-- layout/                   # Header, Sidebar, ThemeToggle
|   |-- home/                     # Dashboard/home widgets
|   `-- ui/                       # Reusable UI primitives
|-- stores/                       # Zustand stores
|-- api/
|   `-- client.ts                 # Axios client and interceptors
|-- lib/
|   `-- utils.ts                  # `cn` class merge helper
`-- assets/                       # Vite-imported assets
```

## Key File Locations

**Entry Points:**
- `frontend/src/main.tsx` - frontend render entry.
- `frontend/src/App.tsx` - frontend providers.
- `frontend/src/router/index.tsx` - frontend route tree.
- `backend/src/main.ts` - backend bootstrap.
- `backend/src/app.module.ts` - backend root module.

**Configuration:**
- `docker-compose.yml` - full-stack service orchestration.
- `.env.example` - environment variable template.
- `frontend/vite.config.ts` - Vite plugins, alias, dev server, and proxy.
- `frontend/tailwind.config.js` - Tailwind tokens and content paths.
- `frontend/tsconfig*.json` - frontend TypeScript configuration.
- `backend/tsconfig.json` - backend TypeScript configuration.
- `backend/nest-cli.json` - Nest CLI source root and build options.

**Core Backend Logic:**
- `backend/src/modules/auth/auth.service.ts` - registration, login, token issuing.
- `backend/src/modules/user/user.service.ts` - user persistence and profile update logic.
- `backend/src/modules/user/schemas/user.schema.ts` - user MongoDB schema.
- `backend/src/common/filters/all-exceptions.filter.ts` - error response format.
- `backend/src/common/interceptors/transform.interceptor.ts` - success response format.

**Core Frontend Logic:**
- `frontend/src/pages/Layout.tsx` - major page layout and responsive composition.
- `frontend/src/components/layout/Sidebar.tsx` - navigation items and sidebar state behavior.
- `frontend/src/components/home/ContentSwiper.tsx` - reusable animated carousel/swiper logic.
- `frontend/src/api/client.ts` - API client and auth redirect behavior.
- `frontend/src/stores/authStore.ts` - persisted auth state.

**Testing:**
- `backend/src/app.controller.spec.ts` - unit test for default app controller.
- `backend/test/app.e2e-spec.ts` - default e2e test.
- `backend/test/jest-e2e.json` - e2e Jest config.
- No frontend test files are present.

**Documentation and Design:**
- `docs/superpowers/specs/2026-05-19-blog-design.md` - broad system design spec.
- `docs/superpowers/plans/sorablog/entrypoint.md` - phase plan entrypoint.
- `home-ui-design/design.md` - home UI design context.
- `ui-drafts/*.png` - planned UI mockups.

## Naming Conventions

**Files:**
- Backend Nest files use dot-suffix naming: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `*.schema.ts`, `*.dto.ts`, `*.guard.ts`, `*.strategy.ts`.
- Backend tests use `*.spec.ts` in `backend/src` and `*.e2e-spec.ts` in `backend/test`.
- Frontend React components use PascalCase file names, such as `Header.tsx`, `Sidebar.tsx`, and `BannerCarousel.tsx`.
- Frontend UI primitives use lowercase file names, such as `button.tsx`, `card.tsx`, and `input.tsx`.
- Stores use camelCase plus `Store`, such as `authStore.ts` and `themeStore.ts`.

**Directories:**
- Backend feature directories are singular domain names: `auth`, `user`, `article`.
- Backend common/shared directories group by infrastructure concern: `decorators`, `filters`, `interceptors`, `redis`, `elasticsearch`, `bull`.
- Frontend feature component directories use domain names: `home`, `layout`, `ui`.
- Frontend route pages are under `frontend/src/pages`, with `Home/Home.tsx` using a feature directory.

**Special Patterns:**
- `index.ts` is used for config re-exports in `backend/src/config/index.ts`.
- `@/*` alias is used in UI primitives for `@/lib/utils`; much of the rest of frontend uses relative imports.

## Where to Add New Code

**New Backend Feature Module:**
- Module: `backend/src/modules/<feature>/<feature>.module.ts`.
- Controller: `backend/src/modules/<feature>/<feature>.controller.ts`.
- Service: `backend/src/modules/<feature>/<feature>.service.ts`.
- DTOs: `backend/src/modules/<feature>/dto/*.dto.ts`.
- Schemas: `backend/src/modules/<feature>/schemas/*.schema.ts`.
- Register in `backend/src/app.module.ts`.
- Unit tests should be colocated under `backend/src/modules/<feature>/*.spec.ts`.

**New Backend Cross-Cutting Behavior:**
- Decorators: `backend/src/common/decorators`.
- Filters: `backend/src/common/filters`.
- Interceptors: `backend/src/common/interceptors`.
- Guards currently live under auth strategy code; a shared roles guard would reasonably fit `backend/src/common/guards` if added.

**New Frontend Route Page:**
- Page component: `frontend/src/pages/<Feature>/<Feature>.tsx`.
- Route registration: `frontend/src/router/index.tsx`.
- Page-specific business components: `frontend/src/components/<feature>`.
- Reusable primitives: `frontend/src/components/ui`.
- Shared browser/data logic: create `frontend/src/hooks` if logic is reusable.

**New Frontend API Module:**
- Keep Axios setup in `frontend/src/api/client.ts`.
- Add feature-specific API wrapper files under `frontend/src/api` when endpoints grow.
- Use TanStack Query hooks from page/feature components when data caching or invalidation is needed.

**New Shared Frontend State:**
- Use local component state first.
- Add Zustand state under `frontend/src/stores` only for cross-page or cross-component state.

**New Static Assets:**
- Public URL assets: `frontend/public`.
- Imported Vite assets: `frontend/src/assets`.
- Design-only references: `home-ui-design`, `ui-drafts`, or `sidebar`.

## Special Directories

**`frontend/dist`:**
- Purpose: generated frontend production build.
- Source: `npm run build` in `frontend`.
- Committed: should remain ignored.

**`backend/dist`:**
- Purpose: generated backend production build.
- Source: `npm run build` in `backend`.
- Committed: should remain ignored.

**`docs/superpowers`:**
- Purpose: implementation roadmap/spec material, not runtime source.
- Source: planning workflow outputs.
- Committed: yes.

**`agents.md`:**
- Purpose: local agent instructions.
- Status: currently untracked in git at mapping time.
- Note: do not overwrite without explicit user direction.

---

*Structure analysis: 2026-05-20*
*Update when directory structure changes.*
