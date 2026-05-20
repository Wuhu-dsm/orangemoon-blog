---
last_mapped_commit: 249405fa2e2191357ed67cbdcac75a3c4968120a
last_mapped_at: 2026-05-20
---

# External Integrations

**Analysis Date:** 2026-05-20

## APIs & External Services

**HTTP API Surface:**
- Backend exposes REST endpoints under `/api/v1`, configured in `backend/src/main.ts`.
- Implemented public endpoints:
  - `POST /api/v1/auth/register` from `backend/src/modules/auth/auth.controller.ts`.
  - `POST /api/v1/auth/login` from `backend/src/modules/auth/auth.controller.ts`.
  - `GET /api/v1/articles` from `backend/src/modules/article/article.controller.ts`.
  - Root app controller remains in `backend/src/app.controller.ts`, but the global prefix means it is served under `/api/v1`.
- Implemented protected endpoints:
  - `GET /api/v1/users/me` from `backend/src/modules/user/user.controller.ts`.
  - `PATCH /api/v1/users/me` from `backend/src/modules/user/user.controller.ts`.

**Frontend API Client:**
- `frontend/src/api/client.ts` defines the shared Axios instance.
- Base URL comes from `VITE_API_BASE_URL`; fallback is `/api/v1`.
- Request interceptor reads `useAuthStore.getState().token` and attaches `Authorization: Bearer <token>`.
- Response interceptor unwraps `response.data`, logs the user out on HTTP 401, and navigates to `/login`.

**Email/SMS:**
- `nodemailer` is installed in `backend/package.json`.
- `.env.example` declares `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASS`.
- No mail module, mail service, or outbound email call is implemented yet in `backend/src`.

**Payment Processing:**
- No payment provider SDK or endpoint is present.

**External APIs:**
- No third-party HTTP API client is used beyond database, cache, and search infrastructure clients.

## Data Storage

**MongoDB:**
- Purpose: primary data store.
- Connection: `MONGODB_URI` read by `backend/src/config/database.config.ts`.
- Client/ODM: Mongoose through `MongooseModule.forRootAsync` in `backend/src/app.module.ts`.
- Implemented schema: `backend/src/modules/user/schemas/user.schema.ts`.
- Docker service: `mongodb` in `docker-compose.yml`, with volume `mongo_data`.
- Migrations: no migration framework or seed script is present in current source.

**Redis:**
- Purpose: cache/queue infrastructure, with a small wrapper service.
- Connection: `REDIS_URL` read by `backend/src/config/redis.config.ts`.
- Client: `ioredis` in `backend/src/shared/redis/redis.service.ts`.
- Queue backend: `backend/src/shared/bull/bull.module.ts` parses the same Redis URL for Bull.
- Docker service: `redis` in `docker-compose.yml`.

**Elasticsearch:**
- Purpose: search infrastructure.
- Connection: `ELASTICSEARCH_NODE` read by `backend/src/config/elasticsearch.config.ts`.
- Client: `@nestjs/elasticsearch` wrapped by `backend/src/shared/elasticsearch/elasticsearch.service.ts`.
- Implemented operations: index, update, delete, search, and create index.
- Docker service: `elasticsearch` in `docker-compose.yml`.
- Index mappings are not yet defined in code.

**File Storage:**
- Upload storage is planned as a local filesystem volume.
- Env vars: `UPLOAD_DIR` and `MAX_FILE_SIZE`.
- Docker volume: `uploads`, mounted at `/app/uploads` for backend and `/usr/share/nginx/html/uploads` for frontend Nginx.
- `multer` and `@types/multer` are installed, but no upload module or upload controller exists yet.

## Authentication & Identity

**Auth Provider:**
- Custom username/email + password auth.
- Password hashing: `bcrypt.hash(dto.password, 10)` in `backend/src/modules/auth/auth.service.ts`.
- Token issuing: `JwtService.sign` creates access and refresh tokens in `AuthService.generateTokens`.
- JWT secret and expiry values come from `backend/src/config/jwt.config.ts`.

**Authorization Model:**
- `JwtAuthGuard` is registered globally in `backend/src/main.ts`.
- Public endpoints opt out with `@Public()` from `backend/src/common/decorators/public.decorator.ts`.
- `@Roles()` exists in `backend/src/common/decorators/roles.decorator.ts`, but no roles guard is implemented or registered yet.

**Frontend Token Storage:**
- Auth state is persisted by Zustand persist middleware in `frontend/src/stores/authStore.ts`.
- Store name is `auth-storage`.
- The token is available to Axios through `useAuthStore.getState()`.

**OAuth Integrations:**
- None implemented.

## Monitoring & Observability

**Error Tracking:**
- No external error tracking service is configured.

**Analytics:**
- No analytics SDK is configured.

**Logs:**
- Backend request logging is implemented by `backend/src/common/interceptors/logging.interceptor.ts` using Nest's `Logger`.
- `winston` and `nest-winston` are installed but not currently wired into `AppModule`.
- Docker/Nest stdout is the effective logging sink in production.

## CI/CD & Deployment

**Hosting:**
- Intended deployment is Docker Compose.
- `frontend/Dockerfile` builds the SPA and serves static assets with Nginx.
- `backend/Dockerfile` builds the Nest app and runs `node dist/main`.
- `frontend/nginx.conf` routes SPA paths to `index.html`, proxies `/api` to `http://backend:3000`, and serves `/uploads`.

**CI Pipeline:**
- No `.github/workflows` or other CI configuration is present.
- Manual verification currently depends on npm scripts and Docker Compose commands.

## Environment Configuration

**Development:**
- Required backend env vars: `MONGODB_URI`, `REDIS_URL`, `ELASTICSEARCH_NODE`, `JWT_SECRET`.
- Optional backend env vars: `PORT`, `NODE_ENV`, token expiry values, upload limits, SMTP values.
- Required frontend env var for non-proxy API use: `VITE_API_BASE_URL`.
- Local dev proxy is configured in `frontend/vite.config.ts` from `/api` to `http://localhost:3000`.

**Production:**
- `docker-compose.yml` injects backend environment variables and uses service hostnames: `mongodb`, `redis`, and `elasticsearch`.
- Frontend Nginx proxies `/api` to the backend service name.
- Secrets should be provided by environment or deployment tooling, not committed.

## Webhooks & Callbacks

**Incoming:**
- No webhook endpoint is implemented.

**Outgoing:**
- No outbound webhook integration is implemented.

## Integration Gaps

- `nodemailer`, `multer`, `@nestjs/throttler`, `winston`, Bull, Redis, and Elasticsearch are installed or configured, but many are infrastructure-ready rather than feature-integrated.
- The frontend navigation includes routes such as `/articles`, `/projects`, `/notes`, `/timeline`, `/friends`, and `/guestbook`, but `frontend/src/router/index.tsx` currently registers only `/`.
- Design and phase docs under `docs/superpowers` describe a broader 18-page target system than the code currently implements.

---

*Integration audit: 2026-05-20*
*Update when adding/removing external services or changing env vars.*
