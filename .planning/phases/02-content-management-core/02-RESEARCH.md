# Phase 2: Content Management Core - Research

**Researched:** 2026-05-21
**Status:** RESEARCH COMPLETE

## RESEARCH COMPLETE

Phase 2 can be planned as a vertical MVP slice: admin-only content workspace, real CRUD for articles/notes/projects, public read APIs for published content, and lightweight admin shells for friend links, guestbook, and users. The implementation should preserve the user's core product decision: body content is the native JSON output of a Notion/Feishu-like block editor, not Markdown or synchronized HTML.

## User Constraints

- Build `/admin` as a real blogger workspace, visible from the existing blog sidebar only to the admin/blogger.
- Only `admin` can access admin routes and all management writes.
- Use separate Article, Note, and Project models/modules, with shared common fields where useful.
- Store editor-native block JSON as the canonical body. Do not persist synchronized Markdown, HTML, or plain-text body fields in Phase 2.
- Required first-version blocks: paragraph, heading, list, quote, code block, image, divider, hyperlink, external video embed, table, and todo/task.
- Prefer a mature block editor library. The phase should lock capabilities and integration boundaries, not permanently lock a vendor choice.
- External video embeds are in scope; local video upload/transcoding/hosting is out of scope.
- Content status supports draft and published, plus archived/unpublished semantics. Public reads expose only published, non-deleted content.
- Use soft delete first.
- Guestbook does not need approval; admin can view/delete. Friend links and users get admin shells, with full public flows deferred.
- AI summary generation is deferred. Keep a summary field/entry point only.

## Project Constraints

- Frontend stack is React 18, TypeScript, Vite, Tailwind CSS, React Router, Zustand, TanStack Query, Axios, and existing shadcn-style primitives under `frontend/src/components/ui`.
- Backend stack is NestJS 11, Mongoose/MongoDB, Redis, Elasticsearch, Bull, class-validator, global API prefix `/api/v1`, and normalized response envelopes.
- Frontend route files should compose pages, not accumulate complex UI/request/state logic. Reusable admin UI should live under a feature folder such as `frontend/src/components/admin`.
- API calls must go through `frontend/src/api`, reusing `apiClient`.
- Shared frontend state should only go into stores when it is genuinely cross-page. Form/editor state should stay local or in route-level hooks.
- Tailwind class merging should use `cn`; icon buttons should use `lucide-react` with accessible labels.
- After frontend edits, run `npm run lint`; run `npm run build` when routes, dependencies, or type boundaries change.

## Summary

The codebase already has the core authentication, role guard, upload service, visitor identity, API client, auth store, and UI primitive foundation needed for Phase 2. The main missing pieces are content persistence models, admin/public route separation for content APIs, the `/admin` frontend route tree, admin feature components, and a block editor integration wrapper.

The safest implementation shape is:

- Backend: add real Article/Note/Project modules with public controllers for published reads and admin controllers for CRUD; reuse global `JwtAuthGuard`, `RolesGuard`, and `@Roles('admin')`.
- Frontend: add an admin route hierarchy with an admin layout, protected route gate, overview, content tables, and full-page editor screens.
- Editor: isolate the chosen editor behind project-owned `ContentBlockEditor`, `ContentBlockPreview`, and `BlockContent` types so future renderer/export/search work depends on the project contract rather than directly on a vendor API.
- Uploads: reuse the current admin-protected upload endpoint for covers and image blocks, adding content-specific upload purposes as needed. Do not add video upload.

## Architectural Responsibility Map

| Area | Existing anchor | Phase 2 additions |
| --- | --- | --- |
| Backend auth | `JwtAuthGuard`, `RolesGuard`, `@Roles`, `AuthService` | Apply `@Roles('admin')` to all admin controllers; public reads use `@Public()` and status/deletion filters. |
| Backend upload | `UploadModule`, `UploadService`, `UploadPurposeDto` | Add note/project/body-image purpose values; keep image-only upload policy. |
| Backend content | Stub `ArticleController` | Article, Note, Project schemas/services/DTOs/controllers; slug generation; soft delete; publish/unpublish actions. |
| Admin API boundary | Global `/api/v1` prefix | `/api/v1/admin/articles`, `/api/v1/admin/notes`, `/api/v1/admin/projects`, plus shells for friend-links/guestbook/users. |
| Public API boundary | Stub `/api/v1/articles` | Published non-deleted list/detail reads for articles/notes/projects. |
| Frontend auth | `apiClient`, `authStore`, owner login | Admin route guard and conditional sidebar entry for admin users. |
| Frontend UI | `components/ui`, root `Layout`, `Sidebar` | Admin layout, overview, tables, editor pages, empty/loading/error states. |
| Frontend data | `apiClient`, TanStack Query provider | Typed admin/public API modules and content hooks. |

## Package Legitimacy Audit

### BlockNote

Disposition: strong candidate for the requested first version.

Official docs describe BlockNote as a React, block-based rich text editor with an out-of-the-box experience comparable to Notion/Google Docs/Coda. Its document model is a list of blocks whose JSON can be read from `editor.document`. The default schema includes paragraph, heading, quote, bullet/numbered/check list items, code block, tables, image, file, audio, and video blocks. It also has link inline content, slash/suggestion menus, side menus, formatting toolbars, and customizable schemas.

Fit:

- Closest match to "Notion/Feishu-like" block editing.
- Native JSON block output aligns with the user's canonical body decision.
- Built-in check list item covers todo/task.
- Built-in table support covers first-version tables, with optional advanced table features.
- Built-in video block exists, but planning should validate whether external embed behavior covers Bilibili/YouTube/ordinary URLs well enough or needs a small custom block.
- Requires adding BlockNote packages and styles to the Vite app.

Primary sources:

- [BlockNote Introduction](https://www.blocknotejs.org/docs)
- [BlockNote Document Structure](https://www.blocknotejs.org/docs/foundations/document-structure)
- [BlockNote Built-in Blocks](https://www.blocknotejs.org/docs/features/blocks)
- [BlockNote Table Blocks](https://www.blocknotejs.org/docs/features/blocks/tables)
- [BlockNote Embed Blocks](https://www.blocknotejs.org/docs/features/blocks/embeds)
- [BlockNote Inline Content](https://www.blocknotejs.org/docs/features/blocks/inline-content)
- [BlockNote Suggestion Menus](https://www.blocknotejs.org/docs/react/components/suggestion-menus)

### Tiptap

Disposition: viable lower-level fallback if custom editor behavior becomes more important than time-to-usable admin UX.

Official docs recommend Tiptap JSON for persistence and expose `editor.getJSON()`. Tiptap has React integration, a strict schema model, StarterKit, Link, Table/TableKit, TaskList, Image, CodeBlock, and YouTube extension support. It is mature and flexible, but the product-level Notion/Feishu experience requires composing menus, slash commands, block controls, toolbars, node views, and preview rendering manually or through additional kits.

Fit:

- Strong JSON persistence story.
- Strong extension ecosystem and custom node control.
- More implementation effort for a polished block editor/admin writing UX.
- A good fallback if BlockNote cannot satisfy embed/localization/styling constraints.

Primary sources:

- [Tiptap Persistence](https://tiptap.dev/docs/editor/core-concepts/persistence)
- [Tiptap Concepts](https://tiptap.dev/docs/editor/core-concepts/introduction)
- [Tiptap React Integration](https://tiptap.dev/docs/editor/getting-started/install/react)
- [Tiptap Editor API](https://tiptap.dev/docs/editor/api/editor)
- [Tiptap Link Extension](https://tiptap.dev/docs/editor/extensions/marks/link)
- [Tiptap Table Extension](https://tiptap.dev/docs/editor/extensions/nodes/table)
- [Tiptap TaskList Extension](https://tiptap.dev/docs/editor/extensions/nodes/task-list)
- [Tiptap YouTube Extension](https://tiptap.dev/docs/editor/extensions/nodes/youtube)

## Recommended Editor Strategy

Plan for BlockNote first, with a project-owned adapter boundary:

- `BlockContent` type in frontend API/types should be permissive enough to store editor JSON without leaking `any` throughout the app.
- `ContentBlockEditor` should accept `value`, `onChange`, `placeholder`, `readOnly`, and upload/embed handlers.
- `ContentBlockPreview` should render saved block JSON in admin preview mode.
- API DTOs should validate that body content is an object/array JSON payload, while avoiding brittle validation against a vendor schema until the editor is finalized.
- Backend should store body JSON as `Schema.Types.Mixed` or a narrow object/array structure with application-level validation. Do not render or sanitize HTML because no HTML body is persisted.
- Keep editor vendor imports out of page files so a later switch from BlockNote to Tiptap only touches the adapter and renderer.

## Backend Findings

- `backend/src/app.module.ts` already wires global JWT auth and role guards. Admin controllers should use `@Roles('admin')` rather than adding a parallel auth mechanism.
- `RolesGuard` checks `request.user?.role`; `JwtStrategy` returns `{ userId, username, role }`. This is enough for admin-only management endpoints.
- `AuthService` currently enforces owner/admin login behavior. Phase 2 should not add public registration or broaden login scope.
- `UploadService` already stores image files and returns a URL. Extend `UploadPurpose` for content image contexts instead of adding a new upload service.
- `ArticleController` is currently a public stub returning an empty list. Phase 2 should replace it with real public published reads and add a separate admin controller.
- There are no existing Note or Project backend modules. Add modules following the same Nest module/controller/service/schema layout as existing modules.
- Mongoose schemas should include `deletedAt`, `deletedBy`, `publishedAt`, and status fields. Services should apply non-deleted filters by default.
- Slug uniqueness should be per content type. Use indexed unique fields for non-deleted active documents where feasible, and service-level collision handling for generated slugs.

## Frontend Findings

- `frontend/src/router/index.tsx` currently exposes `/owner-login` and the root blog layout only. Phase 2 should add `/admin` as a sibling route tree, not as a child of the public blog layout.
- `frontend/src/pages/Layout.tsx` and `frontend/src/components/layout/Sidebar.tsx` are the correct insertion points for conditional admin entry visibility.
- `frontend/src/api/client.ts` already refreshes access tokens and redirects to owner login on unauthorized responses. Admin API modules should reuse it.
- `frontend/src/stores/authStore.ts` persists the current user and role. Admin route guards can combine this with a current-identity query to avoid stale local-only authorization.
- Existing UI primitives include table, button, card, input, textarea, tabs, badge, dialog, and scroll area components. Admin UI should reuse them and keep page files as composition layers.
- The frontend currently has no block editor dependency. Adding one will affect dependency/type/build boundaries, so the plan should include `npm run lint` and `npm run build`.

## Admin UX Findings

- Build the admin layout as a dense work surface rather than a marketing page.
- Sidebar order should be Overview, Articles, Notes, Projects, Friend Links, Guestbook, Users.
- Content lists should be table-first with status filters and single-row actions.
- Editor pages should be full-page routes with title/slug/summary/tags/status/cover controls and a large editor area.
- Preview should be an admin-side renderer of the current block JSON. It must not expose unpublished public URLs.
- Friend links, guestbook, and users can be route-complete shells with typed API boundaries and empty states, but their full public workflows are deferred.

## Security And Threat Model Inputs

- Threat: visitor discovers `/admin` route. Mitigation: frontend guard for UX plus backend `@Roles('admin')` enforcement on every admin endpoint.
- Threat: public API leaks drafts/deleted content. Mitigation: public services always filter `status='published'` and `deletedAt=null`.
- Threat: non-admin uses upload endpoint for content images. Mitigation: keep upload controller admin-protected and use purpose validation.
- Threat: slug collision or route confusion. Mitigation: unique per content type plus collision suffixing and explicit slug update validation.
- Threat: unsafe external links/video URLs in editor JSON. Mitigation: validate embed/link URL protocols on the frontend adapter and, where practical, on backend DTO/service boundaries.
- Threat: destructive delete mistakes. Mitigation: soft delete first; admin lists hide deleted items by default.

## Validation Architecture

- Unit/service tests should cover slug generation, public-read filters, status transitions, soft delete, and admin authorization-sensitive service behavior.
- Controller/e2e tests should cover public vs admin route boundaries for articles/notes/projects.
- Frontend verification should include admin route guard behavior, conditional sidebar entry, list empty states, create/edit save draft, publish, and preview rendering.
- Editor adapter verification should include at least one JSON fixture with paragraph, heading, link, image, video/embed, table, and todo/checklist blocks.
- Run backend tests/build and frontend lint/build after implementation because this phase changes both API and route/type boundaries.

## Planning Notes

- Plan should include a UI-SPEC gate before implementation because Phase 2 introduces a substantial admin interface and there is no current Phase 2 UI design contract.
- Plan should explicitly update requirement status after implementation for ADMN-01, ADMN-03, ADMN-04, ADMN-05, ADMN-06, ARTC-07, NOTE-05, PROJ-05, and INFR-04 if work completes.
- Historical docs mention Markdown-oriented article content. Phase 2 CONTEXT supersedes that: editor-native block JSON is canonical.
- `INFR-04` is already marked complete, but Phase 2 may extend upload purpose support. Treat this as reuse/extension, not a new upload architecture.
