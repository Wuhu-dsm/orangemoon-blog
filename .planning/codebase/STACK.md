---
last_mapped_commit: 249405fa2e2191357ed67cbdcac75a3c4968120a
last_mapped_at: 2026-05-20
---

# Technology Stack

**Analysis Date:** 2026-05-20

## Languages

**Primary:**
- TypeScript - all backend NestJS source under `backend/src` and all frontend React source under `frontend/src`.
- TSX - React route, layout, UI, and home feature components under `frontend/src/pages` and `frontend/src/components`.

**Secondary:**
- JavaScript - config files such as `frontend/tailwind.config.js`, `frontend/eslint.config.js`, and `backend/eslint.config.mjs`.
- CSS - Tailwind entry and CSS variable theme definitions in `frontend/src/index.css`.
- Markdown - project specs and phase plans under `docs/superpowers`.
- YAML - Docker Compose deployment in `docker-compose.yml`.

## Runtime

**Environment:**
- Node.js 20 is the container baseline for both apps, from `backend/Dockerfile` and `frontend/Dockerfile`.
- Browser runtime for the React SPA built by Vite and served through Nginx.
- Backend runtime is NestJS on Node, listening on `PORT` with global prefix `api/v1` in `backend/src/main.ts`.

**Package Manager:**
- npm is used in both `backend` and `frontend`.
- Lockfiles: `backend/package-lock.json` and `frontend/package-lock.json` are present.
- No workspace-level package manager file is present at the repository root.

## Frameworks

**Core Backend:**
- NestJS 11 - HTTP API framework, module system, decorators, global guards, pipes, filters, and interceptors.
- Mongoose 9 with `@nestjs/mongoose` - MongoDB ODM, currently used by the user module.
- Passport JWT with `@nestjs/passport` and `@nestjs/jwt` - authentication strategy and token signing.

**Core Frontend:**
- React 18 - UI runtime.
- Vite 8 - development server and production bundler.
- React Router 7 - browser routing via `frontend/src/router/index.tsx`.
- Tailwind CSS 3 - utility styling and theme tokens.
- shadcn-style local UI primitives - components in `frontend/src/components/ui`.

**State and Data:**
- Zustand 5 - auth, theme, and sidebar stores under `frontend/src/stores`.
- TanStack Query 5 - provider is installed at `frontend/src/App.tsx`; no active query hooks are used in current source.
- Axios - shared API client in `frontend/src/api/client.ts`.

**UI and Visualization:**
- Radix UI package - used by UI primitives such as `frontend/src/components/ui/button.tsx`.
- class-variance-authority, clsx, tailwind-merge - variant and class merging helpers.
- lucide-react - icons in layout and home components.
- Framer Motion - carousel/swiper animation in `frontend/src/components/home`.
- Recharts - reading statistics chart in `frontend/src/components/home/ReadingStats.tsx`.

**Testing:**
- Backend uses Jest 30 with ts-jest, configured in `backend/package.json`.
- Backend e2e uses Jest plus Supertest, configured by `backend/test/jest-e2e.json`.
- Frontend has ESLint and TypeScript build checks but no test runner dependency yet.

**Build/Dev:**
- Backend build: `npm run build` in `backend`, invoking `nest build`.
- Frontend build: `npm run build` in `frontend`, invoking `tsc -b && vite build`.
- Frontend dev server: `vite` with port `5173` and `/api` proxy in `frontend/vite.config.ts`.
- Docker deployment builds backend and frontend separately, then runs Nginx, NestJS, MongoDB, Redis, and Elasticsearch via `docker-compose.yml`.

## Key Dependencies

**Backend Critical:**
- `@nestjs/config` - environment-backed configuration loaded globally in `backend/src/app.module.ts`.
- `@nestjs/mongoose` and `mongoose` - MongoDB connection and user schema persistence.
- `bcrypt` - password hashing in `backend/src/modules/auth/auth.service.ts`.
- `passport-jwt` - bearer-token authentication in `backend/src/modules/auth/strategies/jwt.strategy.ts`.
- `ioredis` - Redis client wrapper in `backend/src/shared/redis/redis.service.ts`.
- `@nestjs/elasticsearch` and `@elastic/elasticsearch` - Elasticsearch client wrapper in `backend/src/shared/elasticsearch`.
- `@nestjs/bull` and `bull` - Redis-backed queue infrastructure in `backend/src/shared/bull/bull.module.ts`.
- `class-validator` and `class-transformer` - DTO validation with the global `ValidationPipe`.

**Frontend Critical:**
- `react`, `react-dom`, `react-router-dom` - SPA shell and routing.
- `@tanstack/react-query` - available service-state layer through `QueryClientProvider`.
- `zustand` - persisted auth/theme state and transient sidebar UI state.
- `axios` - API client with auth header and 401 handling.
- `tailwindcss`, `tailwindcss-animate`, `@fontsource-variable/geist` - design system styling.
- `lucide-react`, `framer-motion`, `recharts` - icons, motion, and charts for the dashboard UI.

## Configuration

**Environment:**
- Root environment template: `.env.example`.
- Backend expected variables include `PORT`, `NODE_ENV`, `MONGODB_URI`, `REDIS_URL`, `ELASTICSEARCH_NODE`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `UPLOAD_DIR`, and `MAX_FILE_SIZE`.
- Frontend expected variable: `VITE_API_BASE_URL`.
- Do not copy literal secret fallback values into docs or commits; keep only variable names and setup guidance.

**Build and TypeScript:**
- Backend TypeScript config: `backend/tsconfig.json` with `nodenext`, decorators, strict null checks, and declaration emit.
- Backend Nest CLI config: `backend/nest-cli.json`.
- Frontend TypeScript configs: `frontend/tsconfig.json`, `frontend/tsconfig.app.json`, `frontend/tsconfig.node.json`.
- Frontend alias `@/*` maps to `frontend/src/*` in `frontend/vite.config.ts` and TypeScript configs.

**Linting:**
- Backend ESLint config: `backend/eslint.config.mjs`, with Prettier integration and `npm run lint` using `--fix`.
- Frontend ESLint config: `frontend/eslint.config.js`, with React Hooks and React Refresh rules.

## Platform Requirements

**Development:**
- Node.js 20+ is the safest baseline because Docker images use Node 20.
- Docker and Docker Compose are required for local MongoDB, Redis, Elasticsearch, and full-stack deployment.
- Frontend can run locally with `cd frontend && npm run dev`.
- Backend can run locally with `cd backend && npm run start:dev` once infrastructure env vars are available.

**Production:**
- Deployment target is Docker Compose from `docker-compose.yml`.
- Frontend is built into static assets and served by Nginx from `frontend/nginx.conf`.
- Backend is built into `backend/dist` and started with `node dist/main`.
- Shared uploads are mounted through the `uploads` Docker volume.

## Verified Commands

```bash
cd frontend && npm run build
cd frontend && npm run lint
cd backend && npm run build
cd backend && npm test -- --runInBand
```

All four commands completed successfully during this map on 2026-05-20.

---

*Stack analysis: 2026-05-20*
*Update after major dependency, runtime, or deployment changes.*
