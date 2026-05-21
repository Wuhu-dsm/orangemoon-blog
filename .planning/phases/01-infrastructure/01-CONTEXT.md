# Phase 1: Infrastructure - Context

**Gathered:** 2026-05-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 1 delivers the infrastructure and identity foundation for SoraBlog: reliable Docker Compose startup, backend global response/error/logging behavior, blogger-only authentication, anonymous visitor identity, focused rate limiting, and owner-only image uploads. It does not introduce public visitor accounts, content CRUD, admin dashboard screens, or community upload flows.

</domain>

<decisions>
## Implementation Decisions

### Blogger-Only Authentication And Visitor Identity
- **D-01:** Replace public user registration/login for Phase 1 with blogger-only login. Normal visitors do not register or log in.
- **D-02:** The blogger login entry should be hidden behind a frontend keyboard easter egg, not exposed in normal navigation.
- **D-03:** The hidden login page should use the supplied light SoraBlog auth mockup as visual direction: illustrated split layout, rounded white form panel, soft sky palette, and teal primary button.
- **D-04:** Create the blogger/admin account with an explicit CLI seed command. Do not expose public registration and do not auto-create an admin account from environment variables during startup.
- **D-05:** Implement backend-issued anonymous visitor identity. Frontend displays a generated visitor nickname such as a friendly visitor label, never the raw IP.
- **D-06:** Treat `AUTH-01` in the original requirements as superseded for Phase 1: no public email/password registration for non-owner visitors unless a future phase reintroduces it.

### Rate Limiting And Anti-Abuse
- **D-07:** Apply stricter rate limits to blogger auth, token refresh, owner upload, and visitor identity issuance endpoints.
- **D-08:** Use a looser global limit for ordinary APIs so normal browsing is not disrupted.
- **D-09:** Use IP + route bucket keys such as `throttle:{ip}:{route}` for Phase 1. Avoid coupling rate limiting to visitor/admin identity until a later phase needs that precision.
- **D-10:** Rate-limit failures must use the normalized API envelope: `{ code: 429, data: null, message: "操作太频繁，请稍后再试" }`.
- **D-11:** Frontend auth, upload, and visitor initialization flows should surface friendly rate-limit messages instead of silently retrying.

### Upload Service Boundary
- **D-12:** Implement one reusable image upload capability with explicit purpose types such as `avatar`, `article-cover`, and `guestbook-image`.
- **D-13:** Only the blogger/admin can upload files in Phase 1. Visitors cannot upload files.
- **D-14:** Store files in purpose-specific folders under `uploads` and return a public URL served by the existing Nginx `/uploads` mapping.
- **D-15:** Accept images only. Validate MIME/extension and file size, and generate safe filenames.
- **D-16:** Do not build a full asset manager, file list, delete UI, or moderation workflow in Phase 1.

### Docker Compose Deployment Reliability
- **D-17:** Phase 1 deployment target is local full-stack reliability: `docker-compose up -d` should reliably start frontend, backend, MongoDB, Redis, and Elasticsearch for local/single-node validation.
- **D-18:** Add healthchecks or startup availability checks for all runtime services: backend, frontend/Nginx, MongoDB, Redis, and Elasticsearch.
- **D-19:** Backend should start only after dependencies are healthy or should explicitly wait/retry dependency connections.
- **D-20:** In production/compose mode, fail startup if `JWT_SECRET` or other sensitive configuration still uses placeholder values such as `change-me`.
- **D-21:** Update README or a deployment quickstart with environment variables, blogger account seed command, `docker-compose up -d`, healthcheck verification, and common troubleshooting notes.
- **D-22:** Do not expand Phase 1 into full production hardening such as backups, advanced log retention, or multi-node deployment.

### the agent's Discretion
- Choose exact keyboard easter egg sequence, visitor nickname vocabulary, route names, and numeric rate-limit values, as long as they follow the decisions above and remain easy to adjust.
- Choose whether upload purpose values are represented by enum, DTO validation, or constants, following existing NestJS patterns.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### GSD Planning
- `.planning/ROADMAP.md` — Phase 1 goal, success criteria, and phase boundary.
- `.planning/REQUIREMENTS.md` — Original Phase 1 requirement mapping. Note that public visitor registration is superseded by the decisions in this context.
- `.planning/PROJECT.md` — Project constraints, locked stack, and high-level product direction.

### Historical Specs And Plans
- `docs/superpowers/plans/sorablog/phase-01-infrastructure.md` — Historical Phase 1 implementation outline and existing infrastructure task breakdown.
- `docs/superpowers/specs/2026-05-19-blog-design.md` — Architecture, API route conventions, Redis key ideas, upload/storage expectations, and security notes.

### User-Provided Visual Reference
- `C:/Users/Administrator/Downloads/ChatGPT Image 2026年5月21日 16_09_14.png` — Visual reference for the hidden blogger login page.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `backend/src/main.ts`: already sets global prefix `api/v1`, CORS, `ValidationPipe`, `TransformInterceptor`, `LoggingInterceptor`, `AllExceptionsFilter`, and global `JwtAuthGuard`.
- `backend/src/modules/auth`: existing register/login/JWT implementation can be refactored toward owner login and refresh flow rather than rebuilt from scratch.
- `backend/src/modules/user/schemas/user.schema.ts`: existing user schema includes `role`, `status`, profile fields, and can represent the blogger/admin account.
- `frontend/src/api/client.ts`: existing Axios client attaches auth token and handles 401; extend this for refresh-token retry and visitor identity initialization.
- `frontend/src/stores/authStore.ts`: existing persisted auth store should be expanded from one token to owner auth state with access/refresh token handling.
- `docker-compose.yml` and `frontend/nginx.conf`: existing upload volume and `/uploads` serving path match the chosen upload URL strategy.

### Established Patterns
- Backend feature work should use Nest modules, controllers, services, DTOs, decorators, and `class-validator`.
- Global API success/error format is `{ code, data, message }`; new throttling and upload errors should preserve this envelope.
- Shared infrastructure wrappers already exist for Redis, Elasticsearch, and Bull under `backend/src/shared`.
- Frontend code should keep page composition in `src/pages`, reusable UI in `src/components/ui`, feature components under feature folders, shared state in `src/stores`, API calls under `src/api`, and reusable browser/data logic in `src/hooks` when needed.

### Integration Points
- Add or adjust auth endpoints under `/api/v1/auth`, including owner login and refresh. Public registration should not be exposed for visitors.
- Add visitor identity endpoints under `/api/v1/visitors` or another clear module boundary chosen during planning.
- Add upload endpoints under `/api/v1/uploads`, protected by owner/admin auth.
- Add rate limiting globally and stricter route-level limits for auth, refresh, upload, and visitor identity endpoints.
- Add health endpoints or service healthchecks that Docker Compose can use for backend and frontend/Nginx readiness.

</code_context>

<specifics>
## Specific Ideas

- The blogger login page should feel like the supplied SoraBlog auth mockup: soft white/sky background, anime-style illustration side, rounded form panel, teal action button, small top navigation back to home/help, and gentle decorative details.
- The blogger login entry should feel like a small hidden site secret, not a visible admin button.
- Visitor identity should support friendly display names such as `xxx访客`; IP can be used internally for abuse control but must not be shown as identity.

</specifics>

<deferred>
## Deferred Ideas

- Public visitor account registration is deferred unless a future phase explicitly needs logged-in non-owner accounts.
- Visitor image uploads are deferred to the community/guestbook phase and need separate moderation and abuse controls before enabling.

</deferred>

---

*Phase: 1-Infrastructure*
*Context gathered: 2026-05-21*
