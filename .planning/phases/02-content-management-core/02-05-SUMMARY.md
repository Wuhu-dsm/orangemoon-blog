# Plan 02-05 Summary: Admin Route Shell and Visual Frame

## What Was Built

A complete protected `/admin` workspace shell for the SoraBlog content management system, consisting of an independent admin layout, route guard, navigation sidebar, top bar, overview dashboard, and functional empty shells for all content management pages.

## Key Files Created/Modified

### Task 1 — Protected Admin Route Tree
- **`frontend/src/router/index.tsx`** — Added `/admin` as an independent route tree (not nested under public Layout) with `AdminRouteGuard` wrapping `AdminLayout`. Includes child routes for all admin pages and a catch-all redirect.
- **`frontend/src/components/admin/AdminRouteGuard.tsx`** — New route guard component that checks `isAuthenticated && user?.role === 'admin'`; redirects non-admin users to `/owner-login?returnTo=` with the original admin URL preserved.
- **`frontend/src/pages/Admin/AdminLayout.tsx`** — New independent admin layout with fixed desktop sidebar (256px), 64px top bar, and scrollable content canvas. Uses `#F6FBFB` background per the UI design contract.

### Task 2 — Admin Layout, Sidebar, Top Bar, Overview, and Route Pages
- **`frontend/src/components/admin/AdminSidebar.tsx`** — Fixed desktop sidebar (256px) and mobile sheet drawer. Navigation order: 仪表盘, 文章, 笔记, 项目, 友链, 留言, 用户. Active item uses `bg-primary-50 text-primary-600` with dark-mode support. Uses lucide-react icons with `aria-label` and `title`.
- **`frontend/src/components/admin/AdminTopbar.tsx`** — 64px top bar showing current page title (derived from route), centered search input, notification button, and admin avatar/name.
- **`frontend/src/pages/Admin/AdminOverview.tsx`** — Dashboard with content stat cards (文章/笔记/项目 counts + draft badges), quick-create action tiles (写文章, 记笔记, 建项目), and recent edits section with compact empty state and "写新文章" CTA. No analytics charts.
- **`frontend/src/pages/Admin/AdminArticles.tsx`** — Functional shell with status filter tabs (全部/草稿/已发布/已归档), search input, empty state, and "写新文章" CTA.
- **`frontend/src/pages/Admin/AdminNotes.tsx`** — Same shell structure as Articles with "新建笔记" CTA.
- **`frontend/src/pages/Admin/AdminProjects.tsx`** — Same shell structure with "新建项目" CTA.
- **`frontend/src/pages/Admin/AdminFriendLinks.tsx`** — Shell with custom status tabs (全部/待审核/已通过/已拒绝), search, and "添加友链" CTA.
- **`frontend/src/pages/Admin/AdminGuestbook.tsx`** — View/delete-oriented shell with search and empty state. No create action (user-submitted content).
- **`frontend/src/pages/Admin/AdminUsers.tsx`** — User management shell with role filter tabs (全部/管理员/普通用户), search, and empty state. No create action.

### Task 3 — Conditional Admin Entry in Public Sidebar
- **`frontend/src/components/layout/Sidebar.tsx`** — Added conditional "后台管理" nav entry at the bottom of the nav list, visible only when `user?.role === 'admin'`. Uses `Settings` icon with `aria-label` and `title`. Preserves existing collapsed/mobile sidebar behavior.

## Verification Results

- `npm run lint` — Passed with zero errors.
- `npm run build` — Passed successfully (`tsc -b && vite build` completed, production bundle generated).

## Decisions Made

1. **Independent Layout**: The `/admin` route tree is completely separate from the public blog `Layout`, as required. It does not reuse the public sidebar, header, or gradient background.
2. **Background Color**: Used explicit `bg-[#F6FBFB]` for the admin canvas background to match the UI-SPEC design contract, rather than the CSS variable `bg-background` which is slightly different.
3. **Route Guard Redirect**: The guard preserves the original admin URL in `returnTo` so successful login returns the user to their intended admin page.
4. **Mobile Sheet for Sidebar**: Used the existing shadcn `Sheet` component for the mobile sidebar drawer, keeping implementation consistent with the project's UI primitive usage.
5. **Empty State Copy**: Used the exact copywriting from the UI-SPEC contract for empty states ("还没有内容", "先写第一篇文章...").
6. **No Analytics in Overview**: Deliberately excluded traffic charts, visit trends, and server metrics per Phase 2 scope. Overview only shows content production state.
7. **Future-Ready Shells**: All list pages include status tabs, search inputs, and empty states with CTAs so they are ready for backend data integration in later phases.
