---
status: diagnosed
phase: 02-content-management-core
source:
  - 02-01-SUMMARY.md
  - 02-02-SUMMARY.md
  - 02-03-SUMMARY.md
  - 02-04-SUMMARY.md
  - 02-05-SUMMARY.md
  - 02-06-SUMMARY.md
  - 02-07-SUMMARY.md
  - 02-08-SUMMARY.md
started: 2026-05-22T14:30:00+08:00
updated: 2026-05-22T15:10:00+08:00
---

## Current Test

[testing paused — 1 blocked, 2 skipped, 3 issues outstanding]

## Tests

### 1. Admin Login & Route Protection
expected: Navigate to /admin. If not logged in, you are redirected to /owner-login?returnTo=/admin. After login with admin credentials, you land on the admin overview dashboard at /admin/overview. Non-admin users are redirected away from /admin.
result: pass

### 2. Admin Layout & Sidebar Navigation
expected: Admin sidebar shows 仪表盘, 文章, 笔记, 项目, 友链, 留言, 用户 in order. Clicking each item navigates to the correct page and the active item is highlighted. Top bar shows the current page title. On mobile, sidebar opens as a sheet drawer.
result: pass

### 3. Admin Overview Dashboard
expected: Admin overview at /admin/overview shows content stat cards (文章, 笔记, 项目 with counts), quick-create action tiles (写文章, 记笔记, 建项目), and a recent edits section. Clicking a quick-create tile navigates to the create page.
result: issue
reported: "页面包含内容统计卡片（文章、笔记、项目及对应数量）数量不正确，我创建一个新的笔记发布后，还是显示0。近期编辑记录板块也没有显示。"
severity: major

### 4. Article List Page
expected: Navigate to /admin/articles. Page shows a table with article rows (or empty state if none). Status filter tabs (全部/草稿/已发布/已归档) work. Search input is present. "写新文章" button is visible and navigates to /admin/articles/new.
result: pass

### 5. Create Article with Block Editor
expected: At /admin/articles/new, a block editor loads with a title field and body area. You can type a title, insert content blocks (text, headings, lists, code blocks, images via upload), and save as draft. After saving, the article appears in the article list.
result: issue
reported: "编辑器交互和体验还比较差，不能丝滑的进行编辑体验（比如表格块的删除，工具栏需要跟行绑定、预览功能），另外还需要支持粘贴上来的md文本自动识别渲染"
severity: major

### 6. Article Status Management
expected: In the article list, each article has actions to publish, unpublish, archive, and soft-delete. Publishing an article makes it visible via the public API. Archiving hides it from public. Soft-deleting removes it from all views.
result: blocked
blocked_by: prior-phase
reason: "目前首页的文章/项目/笔记还没有接入真实数据，无法验证 - 公共前端展示依赖 Phase 3/4/5"

### 7. Note Management
expected: Navigate to /admin/notes. List shows note rows with noteType labels. "新建笔记" button opens the editor. Note editor includes a note-type selector (Short/Code/Quote/Todo). Create, edit, publish, and delete work the same as articles.
result: pass

### 8. Project Management
expected: Navigate to /admin/projects. List shows project rows. "新建项目" button opens the editor. Project editor includes project-specific fields (projectStatus, techStack, repositoryUrl, demoUrl, screenshots). Create, edit, publish, and archive work.
result: issue
reported: "项目编辑不应该跟笔记或者文章一样，而是提供封面图、名称、简介、状态、git地址、项目的状态机需要设计，例如待启动、开发中、更新中、已归档等，另外首页项目部分也需要支持从mock数据到真实接口的迭代"
severity: major

### 9. User Management
expected: Navigate to /admin/users. Table shows user list with role and status columns. Role filter tabs (全部/管理员/普通用户) filter the list. Admin can change a user's role (admin/user) and status (active/banned) via inline controls.
result: pass

### 10. Friend Links & Guestbook Shells
expected: Navigate to /admin/friend-links. Page loads with status tabs (全部/待审核/已通过/已拒绝), search, and "添加友链" button. /admin/guestbook loads with search and message list (empty or with entries). Both are management-ready shells.
result: pass

### 11. Public API — Articles
expected: GET /api/v1/articles returns a paginated list of published articles only (not drafts, not soft-deleted). GET /api/v1/articles/:slug returns full article detail including title, body blocks, tags, and publishedAt.
result: skipped
reason: "用户表示待验证"

### 12. Public API — Notes & Projects
expected: GET /api/v1/notes returns published notes with noteType metadata. GET /api/v1/projects returns published projects with projectStatus, techStack, and links. Draft/non-published content is excluded from both.
result: skipped
reason: "用户表示待验证"

### 13. Admin Entry in Public Sidebar
expected: When logged in as admin, the public blog sidebar shows a "后台管理" link at the bottom (with Settings icon). Clicking it navigates to /admin. When logged in as a regular user or not logged in, the link is not visible.
result: pass

## Summary

total: 13
passed: 7
issues: 3
pending: 0
skipped: 2
blocked: 1

## Gaps

- truth: "Content stat cards show accurate live counts for articles, notes, and projects"
  status: failed
  reason: "User reported: 创建新笔记发布后，数量还是显示0"
  severity: major
  test: 3
  root_cause: "AdminOverview.tsx lines 20-42: stats is a hardcoded const with all zero counts. Component never imports useAdminArticles/useAdminNotes/useAdminProjects hooks."
  artifacts:
    - path: "frontend/src/pages/admin/AdminOverview.tsx"
      issue: "Hardcoded stats constant, zero API integration"
  missing:
    - "Wire useAdminArticles/useAdminNotes/useAdminProjects to replace hardcoded stats"
  debug_session: ".planning/debug/admin-overview-mock-data.md"
- truth: "Recent edits section shows a list of recently modified content"
  status: failed
  reason: "User reported: 近期编辑记录板块也没有显示"
  severity: major
  test: 3
  root_cause: "AdminOverview.tsx line 51: hasContent always false due to hardcoded zero stats. Lines 138-140: else branch is static placeholder text with no data fetching."
  artifacts:
    - path: "frontend/src/pages/admin/AdminOverview.tsx"
      issue: "Recent edits section never fetches data"
  missing:
    - "Fetch content by updatedAt, merge, sort descending, render top N"
  debug_session: ".planning/debug/admin-overview-mock-data.md"
- truth: "Table blocks can be easily deleted via block-level controls"
  status: failed
  reason: "User reported: 表格块的删除操作体验差"
  severity: major
  test: 5
  root_cause: "BlockNote v0.51.2 TableHandleMenu only exposes AddButton/DeleteButton for rows/columns — no whole-table delete button. DragHandleMenu's RemoveBlockItem exists but is in a separate interaction area."
  artifacts:
    - path: "frontend/src/components/admin/editor/ContentBlockEditor.tsx"
      issue: "tableHandles enabled without custom delete-table menu item"
  missing:
    - "Add custom table handle menu item for whole-table deletion"
  debug_session: ".planning/debug/block-editor-ux-issues.md"
- truth: "Editor toolbar is bound to the active line/block, not floating disconnected"
  status: failed
  reason: "User reported: 工具栏需要跟行绑定"
  severity: major
  test: 5
  root_cause: "BlockNote v0.51.2 formattingToolbar is boolean-only (no position option). Inline/block-bound toolbar mode does not exist in this version."
  artifacts:
    - path: "frontend/src/components/admin/editor/ContentBlockEditor.tsx"
      issue: "formattingToolbar: true — boolean-only, no inline binding option in v0.51.x"
  missing:
    - "Upgrade to BlockNote v0.60+ for inline toolbar support, or build custom slash-menu toolbar"
  debug_session: ".planning/debug/block-editor-ux-issues.md"
- truth: "Editor provides a preview mode to see rendered content before publishing"
  status: failed
  reason: "User reported: 缺少预览功能"
  severity: major
  test: 5
  root_cause: "ContentBlockPreview.tsx uses read-only BlockNoteViewRaw — same editor look, not a public-facing HTML render. blocksToFullHTML() API exists but is unused."
  artifacts:
    - path: "frontend/src/components/admin/editor/ContentBlockPreview.tsx"
      issue: "Renders editor-internal view, not HTML output"
    - path: "frontend/src/components/admin/content/AdminContentEditor.tsx"
      issue: "Preview Dialog wraps ContentBlockPreview — shows editor style, not public style"
  missing:
    - "Use blocksToFullHTML() to render actual HTML in preview mode"
  debug_session: ".planning/debug/block-editor-ux-issues.md"
- truth: "Pasting markdown text auto-detects and renders as structured blocks"
  status: failed
  reason: "User reported: 需要支持粘贴的md文本自动识别渲染"
  severity: major
  test: 5
  root_cause: "BlockNote has built-in markdown paste support, but isMarkdown() detection is conservative — when clipboard has both text/html and text/plain, HTML wins without explicit pasteHandler config."
  artifacts:
    - path: "frontend/src/components/admin/editor/ContentBlockEditor.tsx"
      issue: "No custom pasteHandler configured"
  missing:
    - "Add pasteHandler with plainTextAsMarkdown: true to prioritize markdown over HTML"
  debug_session: ".planning/debug/block-editor-ux-issues.md"
- truth: "Project editor is purpose-built with form fields (cover image, name, description, status, git URL) rather than reusing the article/note block editor"
  status: failed
  reason: "User reported: 项目编辑不应该跟笔记或者文章一样，而是提供封面图、名称、简介、状态、git地址"
  severity: major
  test: 8
  root_cause: "AdminContentEditor.tsx always renders ContentBlockEditor as the primary (1fr) content area for all kinds. Project-specific fields are relegated to a 320px sidebar card."
  artifacts:
    - path: "frontend/src/components/admin/content/AdminContentEditor.tsx"
      issue: "Lines 267-281: ContentBlockEditor always primary; lines 382-448: project fields in sidebar"
  missing:
    - "Create purpose-built ProjectForm component replacing block editor for project kind"
  debug_session: ".planning/debug/phase-02-project-management-gaps.md"
- truth: "Project status machine supports 待启动, 开发中, 更新中, 已归档 states with proper transitions"
  status: failed
  reason: "User reported: 项目的状态机需要设计，例如待启动、开发中、更新中、已归档"
  severity: major
  test: 8
  root_cause: "ProjectStatus enum uses planning/in-progress/completed/maintenance across backend enum, DTOs, and frontend type/selector — doesn't match user's required states."
  artifacts:
    - path: "backend/src/modules/project/enums/project-status.enum.ts"
      issue: "Enum values: planning, in-progress, completed, maintenance"
    - path: "frontend/src/api/adminContent.ts"
      issue: "Type union uses old enum values"
    - path: "frontend/src/components/admin/content/AdminContentEditor.tsx"
      issue: "UI labels use 规划中/进行中/已完成/维护中"
  missing:
    - "Update enum to pending/developing/updating/archived across full stack"
    - "Write migration for existing project documents"
  debug_session: ".planning/debug/phase-02-project-management-gaps.md"
- truth: "Home page project section supports iterative migration from mock data to real API"
  status: failed
  reason: "User reported: 首页项目部分也需要支持从mock数据到真实接口的迭代"
  severity: major
  test: 8
  root_cause: "FeaturedProjects.tsx has hardcoded mock data (lines 22-74) with no API integration. No public project API client exists in frontend/src/api/. Backend GET /api/v1/projects endpoint is available but unused."
  artifacts:
    - path: "frontend/src/components/home/FeaturedProjects.tsx"
      issue: "Hardcoded mock data, local Project interface incompatible with API type"
    - path: "frontend/src/api/"
      issue: "No public project API client exists"
  missing:
    - "Create public API client for GET /api/v1/projects"
    - "Refactor FeaturedProjects to use useQuery with real data"
    - "Keep mock data as fallback/loading skeleton"
  debug_session: ".planning/debug/phase-02-project-management-gaps.md"
