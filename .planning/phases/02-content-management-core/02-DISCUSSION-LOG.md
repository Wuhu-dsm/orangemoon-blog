# Phase 2: Content Management Core - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-21
**Phase:** 2-Content Management Core
**Areas discussed:** Content model boundary, Admin CRUD experience, Editor strategy, Review and management scope, Publishing flow and safety rules, Additional planning boundaries

---

## Content Model Boundary

| Decision Point | Options Considered | Selected |
|----------------|--------------------|----------|
| Model structure | Separate models with shared fields; single content model; fully separate models | Separate models with shared fields |
| Body content storage | Markdown-first; HTML-first; dual Markdown/HTML; block-editor-native artifact | Block-editor-native artifact |
| Tags/categories | Shared tags with model-specific categories; free strings; independent Tag/Category collections | Shared tags with model-specific categories |
| Slug generation | Auto-generated and editable; required manual entry; database ID only | Auto-generated and editable |
| Summary behavior | Auto-generated with override; required manual summary; always auto-generated; future AI generation | Not locked now; future AI generation deferred |
| Image/attachment references | URL reference plus upload metadata; embedded full file metadata; independent Asset collection | URL reference plus upload metadata |

**User's choice:** Separate content models with shared common fields; editor-native block JSON as source of truth; shared tags; editable generated slugs; no locked summary rule yet; URL-based image references.
**Notes:** The user clarified that the editor should feel like Notion/Feishu Docs, so Markdown-first storage was superseded.

---

## Admin CRUD Experience

| Decision Point | Options Considered | Selected |
|----------------|--------------------|----------|
| Admin UX depth | Content production workspace; minimal CRUD forms; near-final dashboard | Content production workspace |
| Admin entry | Visible broadly; hidden; blogger-only sidebar entry | Blogger-only sidebar entry |
| List density | Table-first; card-first; switchable table/card | Table-first |
| Create/edit organization | Full-page editor; drawer/modal; inline editing | Full-page editor |
| Quick actions | Single-item actions; batch operations; minimal edit/delete | Single-item actions |

**User's choice:** Build a usable admin workspace. The `/admin` entry can appear in the blog left navigation, but only the blogger/admin can see it.
**Notes:** Batch operations are deferred.

---

## Editor Strategy

| Decision Point | Options Considered | Selected |
|----------------|--------------------|----------|
| First-version capability depth | Basic block editor; full collaboration-style document; normal rich-text simulation | Enhanced block editor baseline |
| Library approach | Mature block editor library; TipTap self-assembled block UX; from-scratch editor | Mature block editor library |
| Persisted formats | Block JSON plus derived HTML/plainText; block JSON only; block JSON plus Markdown/HTML/plainText | Block JSON only |
| Video handling | External embeds; local upload; store URL without preview | External embeds |
| Library preference | Lock capabilities only; prefer BlockNote-like; prefer TipTap | Lock capabilities only |

**User's choice:** Use a mature block editor library and save only native block JSON. Required blocks include paragraph, heading, list, quote, code, image, divider, hyperlink, video, table, and todo/task.
**Notes:** The exact library remains open for research.

---

## Review And Management Scope

| Decision Point | Options Considered | Selected |
|----------------|--------------------|----------|
| Friend/guestbook/user depth | Admin shells with API boundaries; real management now; navigation placeholders only | Admin shells with API boundaries |
| Guestbook management | Disabled/simulated actions; mock operations; real interfaces now; no approval needed | No approval; deletion/view boundary |
| Friend link review | Shell with review structure, API deferred; real review now; approved links only | Shell with review structure, API deferred |
| User management | Existing identity boundary; complete user list; placeholder only | Existing identity boundary |

**User's choice:** Phase 2 should not build the full community system. Guestbook messages do not need approval, but can be deleted by admin later.
**Notes:** Public friend-link applications and real guestbook flows remain deferred.

---

## Publishing Flow And Safety Rules

| Decision Point | Options Considered | Selected |
|----------------|--------------------|----------|
| Status flow | Draft/published/archived; draft/published; draft/pending/published/archived | Draft/published/archived |
| Delete behavior | Soft delete first; hard delete; mixed by content type | Soft delete first |
| Save/publish UX | Separate Save Draft and Publish; one Save with status dropdown; auto-save plus publish | Separate Save Draft and Publish |
| Preview | Admin-side preview; public temporary preview link; no preview | Admin-side preview |
| Admin access | Admin-only management; all APIs login-only; fully separated route sets | Admin-only management |
| Public reads | Provide public read APIs; admin-only APIs; fully separated routes all now | Provide public read APIs |

**User's choice:** Only admin can access the backend management system. Public APIs should expose published, non-deleted content only.
**Notes:** The user briefly selected hard delete, then corrected to soft delete first; the correction is the locked decision.

---

## Additional Planning Boundaries

| Decision Point | Options Considered | Selected |
|----------------|--------------------|----------|
| API route boundary | Separate admin/public routes; permission-switched single routes; content routes only | Separate admin/public routes |
| Admin IA | Content-first; grouped by object type; minimal three-entry sidebar | Content-first |
| Overview page | Lightweight content overview; welcome page; full dashboard skeleton | Lightweight content overview |

**User's choice:** Use content-first admin navigation and a lightweight content overview. Keep analytics dashboard scope for later.
**Notes:** Route examples captured as `/api/v1/admin/articles` for admin and `/api/v1/articles` for public read-only content.

---

## the agent's Discretion

- Exact editor library after research, as long as it satisfies mature block editor, block JSON, and required block type constraints.
- Exact enum naming, component naming, admin table columns, and shared field implementation technique.
- Exact route/controller decomposition, as long as admin/public boundaries remain separate.

## Deferred Ideas

- AI-generated summaries.
- Full media asset library.
- Local video upload/transcoding/hosting.
- Public content frontend pages.
- Public friend-link application and full guestbook flows.
- Full analytics/statistics dashboard.
