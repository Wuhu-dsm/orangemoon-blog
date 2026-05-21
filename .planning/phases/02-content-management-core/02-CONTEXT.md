# Phase 2: Content Management Core - Context

**Gathered:** 2026-05-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 2 delivers the blogger-only content production core for SoraBlog: an admin-only `/admin` workspace, content CRUD for articles, notes, and projects, admin upload usage, public read APIs for published content, and lightweight admin shells for friend links, guestbook, and users. It does not deliver the public article/note/project frontend pages, public friend-link application flow, real guestbook posting flow, AI-generated summaries, media asset library, local video hosting, full analytics dashboard, or public visitor account system.

</domain>

<decisions>
## Implementation Decisions

### Content Model Boundary
- **D-01:** Use separate `Article`, `Note`, and `Project` models/modules, but keep a shared set of common fields and semantics such as `title`, `slug`, `summary`, `coverImage`, `tags`, `status`, timestamps, and soft-delete metadata.
- **D-02:** Use the native artifact of a Notion/Feishu-like block editor as the canonical body content. In Phase 2, save only editor-native block JSON as the source of truth.
- **D-03:** Do not persist synchronized Markdown/HTML/plain-text body fields in Phase 2. Rendering, preview, search indexing, excerpt extraction, and future export should convert from block JSON when needed.
- **D-04:** Use shared tags across content types. Keep category/type/status choices model-specific: article categories, note types, project statuses, and any project-specific fields should not be forced into one generic content schema.
- **D-05:** Generate unique slugs automatically from titles on creation, and allow manual slug edits in admin. Slugs must remain unique within the relevant content type.
- **D-06:** Keep a summary field/entry point, but do not make summary generation a locked Phase 2 behavior. AI-generated summaries are deferred; Phase 2 should not implement AI summary generation.
- **D-07:** Use URL references plus existing upload metadata for cover images and image blocks. Body blocks can reference URLs returned by the upload endpoint. Do not build a full media asset library in Phase 2.

### Admin CRUD Experience
- **D-08:** Build `/admin` as a real content production workspace, not a minimal demo form: independent admin layout, sidebar, overview, content management tables, create/edit pages, status filters, upload entry points, and clear empty/loading/error states.
- **D-09:** The admin entry should appear in the blog left sidebar only for the blogger/admin. Normal visitors must not see the entry.
- **D-10:** Use table-first management lists for articles, notes, and projects. Tables should support scanning fields like title, status, tags/type, updated time, and row actions.
- **D-11:** Use full-page create/edit screens so the block editor has enough room. Avoid drawer/modal editing for long body content.
- **D-12:** First-version list actions are single-item actions: edit, preview, publish/unpublish, and delete. Include search/filtering where useful, but defer batch operations.

### Editor Strategy
- **D-13:** Lock editor capabilities, not a specific library. Research/planning should compare mature block editor options and choose one that best satisfies the required capabilities.
- **D-14:** The required first-version block set is: paragraph, heading, list, quote, code block, image, divider, hyperlink, external video embed, table, and todo/task blocks. Slash commands or block type switching should be supported if the chosen library provides it cleanly.
- **D-15:** Prefer a mature block editor library instead of hand-rolling editor behavior. Historical specs mention TipTap with Markdown support, but that is not a lock; the product decision is a Notion/Feishu-like block editor experience.
- **D-16:** Video blocks should support external embeds such as Bilibili, YouTube, or ordinary video URLs. Do not implement local video upload, transcoding, or video hosting in Phase 2.

### Review And Management Scope
- **D-17:** Friend links, guestbook, and users should have real admin page shells with clear empty states, filters/action affordances, and API boundaries, but their full public data flows are deferred to later phases.
- **D-18:** Guestbook messages do not require approval. Phase 2 should model guestbook admin as view/delete-oriented management, with real publishing/reply/full data flow deferred.
- **D-19:** Friend-link admin should show the intended pending/approved/rejected review structure and action entry points, but real public friend-link application and review data model can be deferred to the community phase.
- **D-20:** User management should reflect the existing admin/user identity boundary and reserve ban/unban affordances. Do not reopen public registration or build a full multi-user account system in Phase 2.
- **D-21:** Treat the original guestbook-management wording that included audit/review as superseded for this phase: no guestbook approval workflow is required.

### Publishing Flow And Safety Rules
- **D-22:** Content status flow is `draft`, `published`, and `archived`/`unpublished`. Public reads expose only published, non-deleted content.
- **D-23:** Use soft delete first. Admin lists hide deleted content by default, and models should preserve enough metadata for future restore/recycle-bin behavior.
- **D-24:** Keep `Save Draft` and `Publish`/`Update Published` as separate editor actions. Avoid one ambiguous save action that silently changes publish state.
- **D-25:** Provide admin-side preview rendered from current block JSON. Do not expose unpublished content through public URLs in Phase 2.
- **D-26:** Only `admin` users can access the admin management system and all management write interfaces.
- **D-27:** Provide public read APIs for published, non-deleted articles/notes/projects so later frontend phases can consume real data directly.
- **D-28:** Separate admin and public API route boundaries. Admin routes such as `/api/v1/admin/articles` manage full state and writes; public routes such as `/api/v1/articles` expose read-only published content.

### Admin Information Architecture
- **D-29:** Use content-first admin sidebar ordering: Overview, Articles, Notes, Projects, Friend Links, Guestbook, Users.
- **D-30:** Phase 2 admin overview should be lightweight: article/note/project counts, draft counts, recently edited content, and quick-create actions. Avoid visit statistics and trend charts, which belong to the later dashboard/statistics phase.

### the agent's Discretion
- Choose exact enum names, route file names, component names, form field grouping, and admin table column order as long as the decisions above are preserved.
- Choose the exact mature block editor library after research. The chosen library must support the required block JSON workflow and block types, or the planner must explicitly document gaps and mitigations.
- Choose whether shared content-field helpers are implemented as TypeScript utility types, base DTO helpers, schema helper functions, or small duplicated field definitions, following whichever pattern keeps the Nest/Mongoose code cleanest.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### GSD Planning
- `.planning/ROADMAP.md` — Current Phase 2 goal, success criteria, and phase boundary. This is authoritative over older `docs/superpowers` phase numbering.
- `.planning/REQUIREMENTS.md` — Phase 2 mapped requirements: ADMN-01, ADMN-03, ADMN-04, ADMN-05, ADMN-06, ARTC-07, NOTE-05, PROJ-05, and INFR-04.
- `.planning/PROJECT.md` — Locked stack, design-first constraint, project context, and out-of-scope boundaries.
- `.planning/phases/01-infrastructure/01-CONTEXT.md` — Prior decisions: blogger-only auth, admin-only uploads, hidden owner login, visitor identity, rate limiting, and API envelope expectations.

### Product And Architecture Specs
- `docs/superpowers/specs/2026-05-19-blog-design.md` — Broader product spec, route map, data model sketches, admin page list, and historical editor note. Use it as reference, but Phase 2 decisions in this CONTEXT supersede Markdown-first and guestbook-approval assumptions where they conflict.
- `docs/superpowers/plans/sorablog/phase-08-search-admin.md` — Historical admin dashboard/layout reference. Use selectively because roadmap phases have been reordered.
- `docs/superpowers/plans/sorablog/phase-03-article-system.md` — Historical article fields and frontend/API reference. Use selectively; public article frontend belongs to current Phase 3, not Phase 2.
- `docs/superpowers/plans/sorablog/phase-04-project-system.md` — Historical project fields and status ideas. Use selectively; public project frontend belongs to current Phase 6.
- `docs/superpowers/plans/sorablog/phase-05-note-system.md` — Historical note fields/type ideas. Use selectively; public note frontend belongs to current Phase 4.
- `docs/superpowers/plans/sorablog/phase-07-community.md` — Historical friend-link and guestbook behavior. Use only for future-facing structure; public community flows belong to current Phase 8.

### Codebase Maps
- `.planning/codebase/STACK.md` — Locked technologies and verified build/test commands.
- `.planning/codebase/ARCHITECTURE.md` — Current frontend/backend layering, data flow, auth flow, and deployment flow.
- `.planning/codebase/CONVENTIONS.md` — File naming, Nest module/service/DTO patterns, frontend directory responsibilities, Tailwind/UI conventions.
- `.planning/codebase/INTEGRATIONS.md` — Existing API surface, MongoDB/Redis/Elasticsearch/upload integration gaps, and deployment integration notes.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `backend/src/app.module.ts`: already wires ConfigModule, Mongoose, Redis, Elasticsearch, Bull, global throttling, global JWT guard, roles guard, upload module, visitor module, and article module. New admin/content modules should follow this Nest composition style.
- `backend/src/common/decorators/roles.decorator.ts` and `backend/src/common/guards/roles.guard.ts`: use these for admin-only management routes instead of inventing a second authorization mechanism.
- `backend/src/modules/upload/upload.controller.ts` and `backend/src/modules/upload/upload.service.ts`: existing admin-protected image upload can support article covers, note images, and project screenshots via purpose values.
- `backend/src/modules/user/schemas/user.schema.ts`: includes `role`, `status`, profile fields, refresh-token version, and login metadata; enough for the admin identity boundary without adding public registration.
- `backend/src/modules/article/article.controller.ts`: currently a public stub returning an empty list; Phase 2 should replace/extend this with real public published reads and add separate admin management endpoints.
- `frontend/src/api/client.ts`: shared Axios client already attaches access tokens, refreshes tokens, redirects to owner login on 401, and unwraps the API envelope.
- `frontend/src/stores/authStore.ts`: persisted auth state exposes the current user and role needed for admin-entry visibility and protected route checks.
- `frontend/src/router/index.tsx`: currently has `/owner-login` and the root layout only; Phase 2 should add `/admin` route hierarchy and public read routes only as API consumers, not full public pages.
- `frontend/src/components/ui`: existing Button, Card, Input, Table, Tabs, Dialog, Badge, Textarea, ScrollArea, and related primitives should be reused for admin UI instead of creating one-off controls.

### Established Patterns
- Backend controllers should stay thin, DTOs should use `class-validator`, services should own business logic/persistence, and schemas should live under feature modules.
- Backend success/error responses must keep the normalized `{ code, data, message }` envelope.
- Frontend page files should compose routes and feature components; reusable admin pieces should live under `frontend/src/components/admin` or another feature folder rather than bloating route files.
- Frontend API calls should live under `frontend/src/api`, with shared data hooks added under `frontend/src/hooks` only when reused.
- Tailwind class merging should use `cn`; icon buttons should use `lucide-react` and include `aria-label`/`title`.

### Integration Points
- Backend API routes should separate public and admin boundaries, e.g. `/api/v1/articles` for published read-only data and `/api/v1/admin/articles` for admin CRUD.
- Add or expand modules for articles, notes, projects, and admin. The planner should decide whether admin controllers aggregate feature services or each feature owns an admin controller, but the route boundary must remain clear.
- Add frontend `/admin` route protection based on persisted auth state and backend admin authorization, with graceful redirect to `/owner-login?returnTo=/admin...`.
- Add conditional admin navigation to the existing blog left sidebar, visible only when the current user is an admin.
- Reuse the existing upload endpoint for admin cover/image insertion. Do not add video upload or asset-library endpoints in Phase 2.

</code_context>

<specifics>
## Specific Ideas

- The desired editor experience is like Notion or Feishu Docs: block-based writing, not a plain Markdown textarea.
- The admin area should feel like a practical writing/work-management surface: content tables for management, full-page document editor for writing.
- The admin overview should be useful for content production rather than analytics: counts, drafts, recent edits, and quick-create actions.
- There is no dedicated admin PNG in the 18 public-facing UI drafts; admin should still respect the project design system, Tailwind/shadcn-style primitives, responsive behavior, and dark mode.

</specifics>

<deferred>
## Deferred Ideas

- AI-generated summaries are deferred beyond Phase 2. Phase 2 should preserve a future-friendly summary field/entry point only.
- Full media asset library, asset search, and asset lifecycle management are deferred beyond Phase 2.
- Local video upload, transcoding, and video hosting are deferred beyond Phase 2; only external embeds are in scope.
- Public article, note, and project frontend pages are deferred to their mapped later phases.
- Public friend-link application, real guestbook posting/replying, and full community data flows are deferred to the community/search phase.
- Full analytics dashboard, visit trends, reading statistics, and subscription flows are deferred to Phase 9.

</deferred>

---

*Phase: 2-Content Management Core*
*Context gathered: 2026-05-21*
