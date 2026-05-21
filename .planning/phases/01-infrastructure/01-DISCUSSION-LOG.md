# Phase 1: Infrastructure - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-21
**Phase:** 1-Infrastructure
**Areas discussed:** Blogger-only authentication and visitor identity, Rate limiting and anti-abuse strategy, Upload service boundary, Docker Compose deployment reliability

---

## Blogger-Only Authentication And Visitor Identity

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal public login/register pages | Add usable login/register pages for Phase 1 acceptance only. | |
| API only | Only complete backend auth/refresh behavior and defer frontend auth pages. | |
| Full auth shell | Build login, register, protected routing, and full auth shell now. | |
| Blogger-only login | Hide a blogger-only login behind a frontend easter egg; normal visitors receive anonymous identities. | ✓ |

**User's choice:** Blogger-only login.
**Notes:** The user clarified this is a personal blog, so public visitor accounts feel too heavy. The site should identify only the blogger and normal visitors. The login page should be hidden behind a small frontend easter egg and visually reference `C:/Users/Administrator/Downloads/ChatGPT Image 2026年5月21日 16_09_14.png`. Blogger account creation should use a CLI seed command. Visitor identity should be backend-issued and displayed as a generated visitor nickname, not an IP address.

---

## Rate Limiting And Anti-Abuse Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Auth + upload + visitor identity | Strict limits for auth, refresh, upload, and visitor identity; looser global limits elsewhere. | ✓ |
| Global only | All APIs share one uniform rate limit. | |
| Auth only | Only protect blogger login and refresh. | |

**User's choice:** Auth + upload + visitor identity.
**Notes:** The user selected IP + route bucket limiting, structured normalized 429 responses, and conservative-but-usable strictness. The expected 429 message is `操作太频繁，请稍后再试`.

---

## Upload Service Boundary

| Option | Description | Selected |
|--------|-------------|----------|
| Typed image upload | One reusable image upload endpoint with purpose types such as avatar, article-cover, guestbook-image. | ✓ |
| Generic image upload only | A generic image endpoint without purpose-specific handling. | |
| Full asset manager | File records, listing, deletion, categories, and asset management UI. | |

**User's choice:** Typed image upload with owner-only permissions.
**Notes:** The user clarified only the blogger can upload; visitors cannot upload in Phase 1. Files should be stored by purpose folder and exposed through public `/uploads/...` URLs. Validation should allow images only, check MIME/extension and size, and generate safe filenames.

---

## Docker Compose Deployment Reliability

| Option | Description | Selected |
|--------|-------------|----------|
| Local full-stack reliable | `docker-compose up -d` reliably starts frontend, backend, MongoDB, Redis, and Elasticsearch for local/single-node validation. | ✓ |
| Production-hardened | Add resource limits, log strategy, security headers, backup notes, and stronger deployment hardening. | |
| Basic boot only | Keep compose basic and only prove services can start manually. | |

**User's choice:** Local full-stack reliable.
**Notes:** Healthchecks should cover all runtime services. Production/compose mode should fail on placeholder secrets such as `change-me`. README or quickstart docs should explain env vars, the blogger seed command, compose startup, health checks, and common troubleshooting.

## the agent's Discretion

- Exact keyboard easter egg sequence.
- Exact route/module naming for owner auth, visitor identity, uploads, and health endpoints.
- Numeric rate-limit values, as long as auth/upload/visitor identity are stricter than ordinary APIs.
- Exact visitor nickname vocabulary.

## Deferred Ideas

- Public visitor account registration is deferred unless a future phase explicitly needs logged-in non-owner accounts.
- Visitor image uploads are deferred to the community/guestbook phase and need separate moderation and abuse controls before enabling.
