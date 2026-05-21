# Walking Skeleton — SoraBlog

**Phase:** 1
**Generated:** 2026-05-21

## Capability Proven End-to-End

A seeded blogger can open the deployed SoraBlog app, trigger a hidden owner login, authenticate through the NestJS API, keep the session alive with refresh tokens, receive a backend-issued visitor identity for normal browsing, upload an owner-only image, and run the full stack with Docker Compose health checks.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Frontend framework | React 18 + Vite + React Router | Existing app stack; fast local development and static Nginx deployment. |
| Backend framework | NestJS 11 modular monolith | Existing API stack; controllers/services/modules map cleanly to auth, visitor, upload, and health boundaries. |
| Data layer | MongoDB + Mongoose | Existing primary store; sufficient for owner user, visitor identity, and future content documents. |
| Auth | Blogger-only JWT access/refresh tokens + CLI owner seed | Matches personal-blog scope and avoids public visitor account overhead. |
| Visitor identity | Backend-issued anonymous visitor record | Keeps visitor display stable and prepares for later guestbook/statistics work without exposing IPs. |
| Rate limiting | `@nestjs/throttler` with IP + route buckets | Uses installed dependency and fits Phase 1 anti-abuse needs. |
| Upload storage | Local Docker volume served by Nginx `/uploads` | Existing Compose/Nginx mapping; enough for local and single-node deployment. |
| Deployment target | Docker Compose local full-stack | Official project deployment path in Phase 1. |
| Directory layout | Existing `frontend/` and `backend/` split, Nest modules under `backend/src/modules`, React pages/components/stores/api under `frontend/src` | Preserves current repository conventions. |

## Stack Touched in Phase 1

- [ ] Existing project scaffold verified, not recreated.
- [ ] Routing — hidden owner login route and existing home route.
- [ ] Database — owner account seed/write, owner lookup/read, visitor identity read/write.
- [ ] UI — keyboard easter egg opens owner login, login form calls API, visitor nickname displays.
- [ ] Deployment — documented `docker-compose up -d` path with service health checks.

## Out of Scope (Deferred to Later Slices)

- Public visitor registration/login.
- Visitor image uploads.
- Admin dashboard CRUD UI.
- Article/project/note content CRUD.
- Guestbook moderation and community interaction flows.
- Production hardening beyond local full-stack reliability.

## Subsequent Slice Plan

- Phase 2: Admin/content-management core builds on owner auth, owner-only upload, and Docker health foundation.
- Phase 3: Article frontend consumes authenticated/admin-created content and public visitor identity.
- Phase 4: Note frontend reuses markdown/content patterns from Phase 2.
- Phase 5: Home dashboard migrates static widgets to API-backed data.
- Phase 6: Project system reuses upload and content APIs for covers/screenshots.
- Phase 7: Timeline/About adds public pages and contact data flows.
- Phase 8: Community/Search decides whether to enable visitor uploads with moderation.
- Phase 9: Admin dashboard, statistics, subscription, and final deployment polish.
