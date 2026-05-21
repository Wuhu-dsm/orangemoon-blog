---
phase: 2
slug: content-management-core
status: approved
shadcn_initialized: true
preset: b2fA
created: 2026-05-21
reviewed_at: 2026-05-21
---

# Phase 2 - UI Design Contract

> Visual and interaction contract for the SoraBlog admin content-management core. Generated for `$gsd-ui-phase 2` and verified inline against the 6 UI checker dimensions.

## Design System

| Property | Value |
|----------|-------|
| Tool | shadcn |
| Preset | `b2fA` / radix-nova / neutral / Geist |
| Component library | Radix via existing shadcn-style `frontend/src/components/ui` |
| Icon library | lucide-react |
| Font | Geist Variable with Chinese fallbacks from `frontend/src/index.css` |

Use existing primitives first: `avatar`, `badge`, `button`, `card`, `dialog`, `dropdown-menu`, `input`, `scroll-area`, `separator`, `sheet`, `skeleton`, `table`, `tabs`, `textarea`.

## Visual Reference

Use the provided SoraBlog admin screenshot as the Phase 2 style reference:

- Bright admin workspace with a fixed left sidebar, top utility bar, and scrollable content area.
- White cards on a pale cyan/teal page background.
- Soft shadows, thin borders, restrained icon tints, and low-saturation status chips.
- Dense management layout: tables, filters, compact actions, and clear empty/loading/error states.
- Teal is the primary action and active-navigation color. Purple, amber, sky, and green may appear only as semantic icon tile tints, never as competing primary CTAs.

Phase 2 must not copy Phase 9 analytics from the reference image. Overview cards can show content counts, draft counts, recent edits, and quick-create actions only. Visit trends, traffic charts, server metrics, and analytics dashboards are deferred.

## Layout Contract

| Surface | Contract |
|---------|----------|
| Admin shell | `/admin` uses an independent admin layout, not the public blog layout. Desktop: fixed 240-256px sidebar, 64px top bar, scrollable content canvas. Mobile: sidebar becomes a sheet/drawer. |
| Sidebar | Order: 仪表盘, 文章, 笔记, 项目, 友链, 留言, 用户. Active item uses teal text and pale teal background. Each item has a lucide icon and text label. |
| Top bar | Left shows current page title/back action when relevant. Center/right contains search input, notification/icon buttons, and admin avatar/name. |
| Overview | Card grid for content totals and drafts, recent edits table, and quick-create action tiles. No analytics chart in Phase 2. |
| Content lists | Table-first management pages with filter tabs/search, status chips, updated time, and row actions. |
| Editor pages | Full-page create/edit route with metadata column/section and large block editor canvas. Do not use drawer/modal editing for long content. |
| Shell pages | Friend links, guestbook, and users use real admin page shells with filters, empty states, and action affordances even when backend data flow is deferred. |

## Visual Hierarchy

- Primary focal point on overview: quick-create/content status band at the top, followed by recent edits.
- Primary focal point on article/note/project lists: table title row plus the `写新文章` / `新建笔记` / `新建项目` CTA.
- Primary focal point on editor pages: title input and block editor canvas; publish actions sit in the sticky top/right action area.
- Row actions are secondary. Destructive actions must be visually quieter until confirmation.
- Icon-only controls require `aria-label` and `title`; tables must keep text truncation predictable at narrow widths.
- Do not place UI cards inside other cards. Quick actions inside overview may be square action tiles, not nested `Card` components.

## Spacing Scale

Declared values (must be multiples of 4):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps, inline padding, badge inner gaps |
| sm | 8px | Compact control gaps, table row action gaps |
| md | 16px | Default card padding, form field spacing |
| lg | 24px | Page section padding, card grid gaps |
| xl | 32px | Major content area gaps, editor panel separation |
| 2xl | 48px | Large empty-state vertical spacing |
| 3xl | 64px | Page-level top/bottom rhythm and top bar height |

Exceptions: none for spacing tokens. Existing button/icon component dimensions may follow shadcn component sizes, but new layout spacing must use the scale above.

## Typography

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Label | 12px | 400 | 1.4 |
| Body | 14px | 400 | 1.5 |
| Heading | 16px | 600 | 1.3 |
| Display | 24px | 600 | 1.15 |

Rules:

- Use only weights 400 and 600 in admin chrome.
- Use `Display` only for overview numbers and main editor title value states. Do not use hero-scale type in admin panels.
- Table body, filters, helper text, and row actions use `Body` or `Label`.
- Chinese copy must not rely on negative letter spacing. Keep letter spacing at `0`.

## Color

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | `#F6FBFB` | Admin background, content canvas, pale page bands |
| Secondary (30%) | `#FFFFFF` | Cards, sidebar, top bar, table surfaces, dialogs |
| Accent (10%) | `#14B8A6` | Primary CTA, active nav, focus ring, publish state, selected filter |
| Destructive | `#DC2626` | Delete/disable/destructive confirmation only |

Accent reserved for: primary create buttons, publish action, active sidebar item, selected tab/filter, focus ring, and success/published badges.

Semantic tint allowances:

- Article/content tile tint: pale teal or sky.
- User/community tile tint: pale violet.
- Warning/draft tint: pale amber.
- Delete/disabled tint: pale red.

These tints must stay low-saturation backgrounds for icons or chips only. They must not become alternate primary action colors.

Dark mode must reuse existing CSS variables from `frontend/src/index.css`, preserving contrast for text, chips, borders, and focus rings.

## Component Contract

| Need | Use |
|------|-----|
| Navigation | lucide icons plus text labels; mobile sheet for sidebar |
| Stats/summary | Existing `Card`, but top-level only; no nested cards |
| Lists | Existing `Table`, `Badge`, `Button`, `Input`, `Tabs` |
| Editor metadata | `Input`, `Textarea`, `Badge`, future select/combobox primitive if needed |
| Editor body | `ContentBlockEditor` wrapper around chosen block editor; no vendor imports in route files |
| Preview | `ContentBlockPreview` rendering the saved block JSON in admin-only preview |
| Confirmation | Existing `Dialog` for soft-delete/disable actions |
| Loading | Existing `Skeleton` rows/cards |
| Empty states | Illustration-free compact empty blocks using lucide icon, heading, body, and action button |

## Screen Contracts

### Admin Overview

- Shows content production state, not analytics.
- Required blocks: content totals by type, draft counts, recently edited content, quick-create action tiles.
- Quick-create tiles: `写文章`, `记笔记`, `建项目`.
- If all content is empty, show a compact onboarding empty state with the `写新文章` CTA.

### Articles, Notes, Projects

- Table columns must support scanning: title, status, tags/type/category, updated time, publish time when available, and actions.
- Required filters: status tabs (`全部`, `草稿`, `已发布`, `已归档`) and search by title/slug.
- Row actions: `编辑`, `预览`, `发布`/`取消发布`, `移入回收站`.
- Destructive action must open confirmation before calling delete.

### Editor Pages

- Full-page route, never modal/drawer.
- Top actions: `保存草稿`, `发布内容` or `更新发布`, `预览内容`.
- Metadata: title, slug, summary, cover image, tags, and type/category/status fields according to content type.
- Block editor must visually feel document-like: white canvas, generous line height, block controls/slash menu if supported, and enough width for tables/code blocks.
- Preview must render from current block JSON and remain admin-only.

### Friend Links, Guestbook, Users

- These pages are functional shells in Phase 2.
- Friend links: status filters for pending/approved/rejected structure, empty state, and disabled/deferred review affordances where backend flow is not yet active.
- Guestbook: view/delete-oriented management; no approval UI.
- Users: list/search/filter shell reflecting admin/user boundary; no public registration management expansion.

## Responsive Contract

- Desktop `>= 1280px`: sidebar fixed, content uses 12-column grid or explicit responsive grid, cards/tables fit without horizontal page scroll.
- Tablet `768px-1279px`: sidebar can collapse; overview grids reduce columns; tables keep priority columns and move secondary actions into menu if needed.
- Mobile `< 768px`: sidebar opens as sheet; top search can collapse to icon/search sheet; tables become stacked row cards or horizontal scroll containers with visible affordance.
- Text must never overlap controls. Long titles/slugs use truncate with title tooltip or wrap in editor forms.

## Copywriting Contract

| Element | Copy |
|---------|------|
| Primary CTA | `写新文章` |
| Secondary CTAs | `新建笔记`, `新建项目`, `保存草稿`, `发布内容`, `预览内容` |
| Empty state heading | `还没有内容` |
| Empty state body | `先写第一篇文章，或切换到笔记、项目开始整理你的内容。` |
| Error state | `内容加载失败，请刷新重试；如果仍然失败，请重新登录后台。` |
| Destructive confirmation | `移入回收站：该内容会从列表和公开访问中隐藏，确认移入回收站吗？` |
| Keep action in confirmation | `保留内容` |

Copy rules:

- Avoid generic button labels such as `提交`, `确定`, `取消`, `保存`.
- Use verb + noun labels for main actions.
- Public-facing marketing copy does not belong in admin pages.
- Empty states should always include the next useful action.

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | avatar, badge, button, card, dialog, dropdown-menu, input, scroll-area, separator, sheet, skeleton, table, tabs, textarea | components installed and listed by `npx shadcn@latest info` on 2026-05-21 |
| third-party registries | none | not applicable |

No third-party registry blocks are approved for Phase 2. If implementation later adds a third-party registry block, run `npx shadcn view` and record the reviewed result before use.

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved 2026-05-21
