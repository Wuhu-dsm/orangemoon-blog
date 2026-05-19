# SoraBlog Phase-01 Home Dashboard UI Design

> Version: v1.0
> Date: 2026-05-19
> Status: approved for design doc
> Scope: front-end home dashboard visual rebuild only

## 1. Goal

Rebuild the current SoraBlog home page to match the provided full dashboard UI draft:

- Target screenshot: `ui-drafts/01-home-dashboard.png`
- Related source assets:
  - `C:/Users/Administrator/Downloads/ChatGPT Image 2026年5月19日 20_40_53.png`
  - `C:/Users/Administrator/Downloads/ChatGPT Image 2026年5月19日 20_41_06.png`
  - `C:/Users/Administrator/Downloads/ChatGPT Image 2026年5月19日 20_41_16.png`
  - `C:/Users/Administrator/Downloads/ChatGPT Image 2026年5月19日 20_41_19.png`

The approved direction is a desktop-first, high-fidelity home dashboard rebuild. The implementation should closely follow the layout, spacing, color system, soft card treatment, and illustration usage in the draft, while keeping the front end componentized.

## 2. In Scope

- Replace the current simple home page with the designed dashboard composition.
- Rework the home layout into a fixed left sidebar plus a two-column dashboard canvas.
- Add the top search and action bar shown in the draft.
- Add all visible home modules:
  - hero banner
  - profile card
  - latest articles
  - featured projects
  - reading statistics
  - tag cloud
  - timeline
  - subscription banner
- Use the provided mascot, feather logo, profile-card background, and subscription-banner background assets.
- Drive repeated content with typed local mock data for phase-01.
- Preserve a readable responsive fallback for narrower screens.

## 3. Out of Scope

- No real backend data integration for the home dashboard in this pass.
- No login/auth behavior changes.
- No admin page redesign.
- No full rebuild of article, project, notes, timeline detail pages.
- No complex carousel or chart library unless already present and useful. Static SVG/CSS is enough for the dashboard chart.
- No large animation system. Use small hover states and simple active states only.

## 4. Visual Direction

The home page should feel like the draft: soft, airy, blue-green, cute, and polished. The UI should avoid a generic SaaS dashboard look and instead lean into the SoraBlog identity.

Core visual rules:

- Background: pale blue-white gradient with subtle depth.
- Cards: white or translucent white surfaces, thin blue borders, soft shadow, large but controlled radius.
- Accent colors: teal, sky blue, mint, pale yellow, and navy text.
- Typography: strong navy headings, compact metadata, readable Chinese copy.
- Imagery: illustrations should be first-class UI elements, not small decorations.
- Density: keep the dashboard information-rich like the draft, but with enough spacing to avoid clutter.

## 5. Component Architecture

The page should be rebuilt from small, named components. `Home.tsx` should compose the page, not contain all markup directly.

Recommended structure:

```text
frontend/src/pages/Home/
  Home.tsx
  Home.module.css
  components/
    DashboardLayout.tsx
    HomeSidebar.tsx
    TopBar.tsx
    HeroBanner.tsx
    ProfileCard.tsx
    ArticleSection.tsx
    ArticlePreviewCard.tsx
    ProjectCarousel.tsx
    ProjectCard.tsx
    ReadingStatsCard.tsx
    TagCloudCard.tsx
    TimelineCard.tsx
    SubscribeBanner.tsx
    SectionHeader.tsx
    IconActionButton.tsx
  data.ts
  types.ts
```

If the existing project already has reusable layout or UI primitives that fit, reuse them. Otherwise keep these home-specific components local to `pages/Home/components/` so this visual rebuild does not leak unfinished abstractions into the whole app.

## 6. Component Responsibilities

### DashboardLayout

Owns the page-level structure:

- fixed sidebar width similar to the draft
- main dashboard content area
- dashboard background
- desktop and narrow-screen layout behavior

### HomeSidebar

Owns the left navigation column:

- feather logo and `SoraBlog` brand
- nav items: 首页, 文章, 项目, 笔记, 时间轴, 关于我, 友链, 留言板
- active state for 首页
- mascot reading illustration
- quote card
- bottom icon dock

### TopBar

Owns the top row of the main canvas:

- search input with placeholder `搜索文章、笔记、项目...`
- keyboard hint
- gift, notification, and avatar buttons

### HeroBanner

Owns the large main banner:

- sky/anime style hero visual treatment inspired by the draft
- headline `写代码是热爱，写生活是本能`
- supporting line `在技术与生活之间，寻找平衡与热爱`
- primary CTA `探索我的世界`
- carousel dots

The exact hero illustration from the target screenshot was not supplied as a separate asset. Implementation can use a CSS image treatment from existing available assets if present, or a polished gradient/illustration fallback that preserves the same composition and mood.

### ProfileCard

Owns the profile summary:

- use profile-card background asset with cat decoration
- avatar, name `Sora`, level badge, role subtitle
- short intro copy
- stats: 文章 56, 项目 12, 笔记 89, 粉丝 1.2k
- social icon buttons

### ArticleSection and ArticlePreviewCard

Own latest articles:

- section title `最新文章`
- `查看全部` action
- three cards with image, category badge, title, excerpt, date, views
- data should come from local typed mock data

### ProjectCarousel and ProjectCard

Own selected projects:

- section title `精选项目`
- three visible project cards
- left/right circular controls as static UI
- progress dots
- status badge such as `进行中` or `已完成`

### ReadingStatsCard

Own right-column reading stats:

- month selector
- three metric blocks
- lightweight SVG/CSS line chart
- tooltip marker similar to the draft

### TagCloudCard

Own tag chips:

- section title `标签云`
- `更多标签` action
- colored chips with names and counts

### TimelineCard

Own compact timeline:

- section title `时间轴`
- `查看全部` action
- month-based items matching the draft style
- plant illustration detail can be done with CSS or a small reused asset

### SubscribeBanner

Own bottom subscription strip:

- use subscription-banner background asset
- title `订阅更新，不错过每一篇精彩内容`
- short supporting copy
- email input and `订阅` button

## 7. Assets

Implementation should copy the provided images into a stable repo-owned location, for example:

```text
frontend/src/assets/home/
  mascot-reading.png
  logo-feather.png
  profile-card-bg.png
  subscribe-banner-bg.png
```

After copying, components should import assets from the repo path rather than referencing `C:/Users/.../Downloads` directly.

## 8. Data Model

Use typed local data for this phase:

```ts
type ArticlePreview = {
  id: string
  title: string
  excerpt: string
  category: string
  date: string
  views: string
  image: string
}

type ProjectPreview = {
  id: string
  title: string
  description: string
  status: '进行中' | '已完成'
  image: string
}

type TagSummary = {
  name: string
  count: number
  tone: 'mint' | 'blue' | 'cyan' | 'yellow'
}

type TimelineItem = {
  month: string
  content: string
}
```

The home page should not fetch remote data yet. Keeping mock data typed makes it easy to connect the API later.

## 9. Responsive Behavior

Desktop is the priority because the draft is a 1728px dashboard.

Expected behavior:

- Desktop: fixed sidebar plus two-column main grid, matching the draft proportions.
- Tablet: sidebar can remain visible if width allows, main grid can collapse earlier than the draft.
- Mobile: single-column content, sidebar becomes stacked or hidden behind existing navigation behavior if available.
- Text must not overflow card boundaries.
- Cards and toolbar controls must keep stable dimensions while loading or resizing.

## 10. Accessibility and Interaction

- Buttons and links need clear labels or `aria-label`.
- Search input must have a useful label or accessible placeholder.
- Interactive controls should have visible hover/focus states.
- Color contrast should remain readable on pale blue and translucent surfaces.
- Decorative images should use empty alt text if they do not communicate content.
- Meaningful images, such as the mascot and avatar, should have concise alt text.

## 11. Verification

Minimum checks after implementation:

- `npm.cmd run build` from `frontend/`
- Browser screenshot at desktop width close to the draft, preferably around `1728x956`
- Browser smoke check at a mobile width
- Manual visual comparison against `ui-drafts/01-home-dashboard.png`

Acceptance criteria:

- Home page clearly matches the provided draft in structure and mood.
- Sidebar, top bar, hero, profile card, article list, project row, stats, tags, timeline, and subscription banner are all present.
- Implementation is componentized, with repeated content driven from typed data.
- Source assets live in the repo and are imported by components.
- No unrelated pages or backend behavior are changed.

## 12. Risks and Decisions

- The target screenshot includes several article/project/hero images that were not provided as separate cut assets. The implementation may need to use polished fallback thumbnail panels, existing assets, or CSS-backed panels for those internal thumbnails.
- High-fidelity spacing should be tuned with browser screenshots rather than guessed from code alone.
- The rebuild should stay local to the home page until other phase-01 UI drafts are approved.
