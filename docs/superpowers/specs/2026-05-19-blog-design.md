# SoraBlog 个人博客全栈设计文档

> 版本: v1.0  
> 日期: 2026-05-19  
> 状态: 待实现

---

## 1. 项目概述

SoraBlog 是一个功能完整的个人博客系统，采用前后端分离架构。基于 18 张 UI 设计稿，覆盖首页 Dashboard、文章、项目、笔记、时间轴、关于我、友链、留言板、搜索、管理后台等全功能模块。

### 1.1 核心特性

- **内容管理**: 文章、项目、笔记三大内容类型，支持标签、分类、归档
- **用户系统**: 完整注册/登录、JWT 认证、用户等级体系
- **社区互动**: 留言板（支持表情/图片/链接/回复/置顶）、友链申请、邮件订阅
- **数据统计**: 阅读统计、成长趋势图表、年度总结、活跃日历
- **搜索能力**: 基于 Elasticsearch 的全文搜索（IK 分词）、搜索建议
- **管理后台**: 内置 `/admin` 路由，支持内容 CRUD、友链审核、系统管理
- **高可用设计**: Redis 缓存、Bull 队列异步处理、限流防刷

### 1.2 部署方式

Docker Compose 三容器部署：Nginx（前端）+ Nest.js API + MongoDB。

---

## 2. 技术栈总览

### 2.1 前端

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18 | UI 框架 |
| Vite | 5 | 构建工具 |
| TypeScript | 5 | 类型安全 |
| Tailwind CSS | 3 | 原子化样式 |
| shadcn/ui | latest | 基础交互组件 |
| Framer Motion | latest | 页面过渡与交互动画 |
| Recharts | latest | 数据可视化图表 |
| React Router | v6 | 路由管理 |
| Zustand | latest | 全局状态管理 |
| TanStack Query | v5 | 服务端状态与缓存 |
| Axios | latest | HTTP 客户端 |

### 2.2 后端

| 技术 | 版本 | 用途 |
|------|------|------|
| Nest.js | 11 | Node.js 框架 |
| TypeScript | 5 | 类型安全 |
| Mongoose | latest | MongoDB ODM |
| @nestjs/config | latest | 配置化管理 |
| Passport + JWT | latest | 认证授权 |
| class-validator | latest | DTO 参数校验 |
| Multer | latest | 文件上传 |
| @nestjs/throttler | latest | API 限流 |
| Bull | latest | Redis 任务队列 |
| @nestjs/elasticsearch | latest | ES 客户端封装 |
| winston | latest | 日志记录 |

### 2.3 基础设施

| 技术 | 用途 |
|------|------|
| MongoDB | 主数据库 |
| Redis | 缓存、限流、Session、队列 |
| Elasticsearch | 全文搜索引擎 |
| Nginx | 前端静态托管、反向代理 |
| Docker + Docker Compose | 容器化部署 |

---

## 3. 部署架构

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Compose                       │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐ │
│  │   Nginx     │───▶│  Nest.js    │───▶│  MongoDB    │ │
│  │   :80/:443  │    │   :3000     │    │   :27017    │ │
│  │  (前端静态)  │    │   API服务    │    │   主数据库   │ │
│  └─────────────┘    └──────┬──────┘    └─────────────┘ │
│       ↑                    │                           │
│  uploads/ 挂载卷          │                           │
│       │              ┌─────▼─────┐                     │
│       │              │  Redis    │                     │
│       │              │  :6379    │                     │
│       │              └───────────┘                     │
│       │              ┌─────────────┐                   │
│       └─────────────▶│Elasticsearch│                   │
│                      │  :9200      │                   │
│                      └─────────────┘                   │
└─────────────────────────────────────────────────────────┘
```

### 3.1 仓库结构

```
orangemoon-blog/
├── frontend/          # React + Vite 前端
├── backend/           # Nest.js 后端
├── docker-compose.yml
├── .env.example       # 环境变量模板
└── README.md
```

---

## 4. 前端架构

### 4.1 目录结构

```
frontend/src/
├── api/               # API 接口层（按模块分文件）
│   ├── auth.ts
│   ├── articles.ts
│   ├── projects.ts
│   ├── notes.ts
│   ├── timeline.ts
│   ├── friends.ts
│   ├── guestbook.ts
│   ├── search.ts
│   └── admin.ts
├── assets/            # 静态资源（插画、图标）
├── components/
│   ├── layout/        # 布局组件（Sidebar、Header、Footer）
│   ├── ui/            # shadcn/ui 组件
│   └── common/        # 业务公共组件
│       ├── ArticleCard.tsx
│       ├── ProjectCard.tsx
│       ├── NoteCard.tsx
│       ├── TagBadge.tsx
│       ├── Pagination.tsx
│       └── MarkdownRenderer.tsx
├── hooks/             # 自定义 Hooks
│   ├── useAuth.ts
│   ├── useTheme.ts
│   └── useReadingProgress.ts
├── pages/             # 页面组件（按模块组织）
│   ├── Home/
│   ├── Articles/
│   ├── ArticleDetail/
│   ├── TagArchive/
│   ├── Projects/
│   ├── ProjectDetail/
│   ├── Notes/
│   ├── NoteDetail/
│   ├── NoteCollection/
│   ├── Timeline/
│   ├── YearlySummary/
│   ├── About/
│   ├── Contact/
│   ├── Friends/
│   ├── FriendApply/
│   ├── Guestbook/
│   ├── MyMessages/
│   ├── Search/
│   ├── Login/
│   ├── Register/
│   └── Admin/
│       ├── Dashboard/
│       ├── Articles/
│       ├── Projects/
│       ├── Notes/
│       ├── FriendLinks/
│       ├── Guestbook/
│       └── Settings/
├── router/            # React Router 配置
│   └── index.tsx
├── stores/            # Zustand 状态管理
│   ├── authStore.ts
│   ├── themeStore.ts
│   ├── sidebarStore.ts
│   └── notificationStore.ts
├── styles/            # 全局样式 & Tailwind 配置
├── types/             # TypeScript 类型定义
└── utils/             # 工具函数
```

### 4.2 路由设计

| 路由 | 页面 | 权限 |
|------|------|------|
| `/` | 首页 Dashboard | 公开 |
| `/articles` | 文章列表 | 公开 |
| `/articles/:slug` | 文章详情 | 公开 |
| `/articles/tags/:tag` | 标签归档 | 公开 |
| `/projects` | 项目展示 | 公开 |
| `/projects/:slug` | 项目详情 | 公开 |
| `/notes` | 笔记看板 | 公开 |
| `/notes/:slug` | 笔记详情 | 公开 |
| `/notes/collections/:id` | 笔记文集 | 公开 |
| `/timeline` | 时间轴 | 公开 |
| `/timeline/year/:year` | 年度总结 | 公开 |
| `/about` | 关于我 | 公开 |
| `/friends` | 友链 | 公开 |
| `/friends/apply` | 友链申请 | 公开 |
| `/guestbook` | 留言板 | 公开 |
| `/guestbook/my` | 我的留言 | 需登录 |
| `/search?q=` | 搜索结果 | 公开 |
| `/contact` | 联系合作 | 公开 |
| `/admin/*` | 管理后台 | 需管理员 |
| `/login`, `/register` | 登录/注册 | 公开 |

### 4.3 状态管理

- **authStore**: 用户认证信息、JWT Token、登录状态
- **themeStore**: 暗黑/亮色模式（localStorage 持久化）
- **sidebarStore**: 侧边栏展开/折叠状态
- **notificationStore**: 全局 Toast 通知队列

### 4.4 关键技术决策

| 问题 | 方案 |
|------|------|
| 主题切换 | Tailwind `darkMode: 'class'` + localStorage 持久化 |
| 图表 | Recharts（折线图、饼图、进度环） |
| 代码高亮 | Shiki（文章/笔记详情代码块） |
| 富文本编辑 | 管理后台用 TipTap（Markdown 支持） |
| 图片懒加载 | 自定义 Hook + Intersection Observer |
| 无限滚动 | TanStack Query `useInfiniteQuery` |
| 阅读进度 | 自定义 Hook 监听滚动位置 |
| 动画 | Framer Motion 页面过渡 + 列表交互动画 |

---

## 5. 后端架构

### 5.1 模块划分

```
backend/src/
├── main.ts                    # 入口文件
├── app.module.ts              # 根模块
├── config/                    # 配置模块
│   ├── database.config.ts
│   ├── redis.config.ts
│   ├── elasticsearch.config.ts
│   ├── jwt.config.ts
│   └── mail.config.ts
├── common/                    # 公共基础设施
│   ├── decorators/
│   │   ├── current-user.decorator.ts
│   │   ├── public.decorator.ts
│   │   └── roles.decorator.ts
│   ├── filters/
│   │   └── all-exceptions.filter.ts
│   ├── guards/
│   │   ├── jwt.guard.ts
│   │   └── roles.guard.ts
│   ├── interceptors/
│   │   ├── transform.interceptor.ts
│   │   └── logging.interceptor.ts
│   └── pipes/
│       └── validation.pipe.ts
├── modules/                   # 业务模块
│   ├── auth/
│   ├── user/
│   ├── article/
│   ├── project/
│   ├── note/
│   ├── timeline/
│   ├── friend-link/
│   ├── guestbook/
│   ├── search/
│   ├── upload/
│   ├── admin/
│   ├── mail/
│   └── analytics/
└── shared/                    # 共享服务
    ├── redis/
    ├── elasticsearch/
    └── bull/
```

### 5.2 中间件与横切关注点

| 功能 | 实现方式 |
|------|---------|
| JWT 认证 | `@nestjs/passport` + `PassportStrategy` + `JwtGuard` |
| 角色权限 | `RolesGuard`（ADMIN / USER） + `@Roles()` 装饰器 |
| 全局参数校验 | `ValidationPipe`（`class-validator` + `class-transformer`） |
| API 响应统一格式 | `TransformInterceptor`（统一 `{ code, data, message }`） |
| 异常处理 | `AllExceptionsFilter`（捕获所有异常） |
| API 限流 | `@nestjs/throttler` + Redis 存储 |
| 日志记录 | `LoggingInterceptor` + `winston` |
| 文件上传 | `@nestjs/platform-express` + `multer` |

### 5.3 Redis 使用场景

| 场景 | Key 设计 | TTL | 用途 |
|------|---------|-----|------|
| JWT 黑名单 | `jwt:blacklist:{jti}` | 与 Token 过期时间一致 | 登出后 Token 失效 |
| API 限流 | `throttle:{ip}:{path}` | 1 分钟 | 滑动窗口限流 |
| 热点缓存 | `cache:home:data` | 5 分钟 | 首页聚合数据缓存 |
| 阅读计数缓冲 | `article:views:{id}` | 无 | 高并发阅读量先写 Redis |
| 在线用户 | `online:{userId}` | 5 分钟 | 统计在线人数 |
| ES 同步锁 | `lock:es:sync:{id}` | 30 秒 | 防止并发重复入队列 |

### 5.4 Elasticsearch 索引设计

```json
// articles 索引
{
  "mappings": {
    "properties": {
      "title": { "type": "text", "analyzer": "ik_max_word" },
      "content": { "type": "text", "analyzer": "ik_max_word" },
      "summary": { "type": "text" },
      "tags": { "type": "keyword" },
      "category": { "type": "keyword" },
      "author": { "type": "keyword" },
      "createdAt": { "type": "date" },
      "views": { "type": "integer" }
    }
  }
}
```

- `articles` / `projects` / `notes` 三个独立索引
- 搜索 API：`GET /search?q=Next.js&types=article,note&page=1`
- 搜索建议：`GET /search/suggestions?q=Next`
- IK 分词器支持中文分词和高亮

### 5.5 Bull 队列设计

| 队列名 | 生产者 | 消费者 | 并发 | 失败策略 |
|--------|--------|--------|------|---------|
| `sync-to-es` | Article/Project/Note Service | Search Service | 3 | 重试 3 次，进死信队列 |
| `send-email` | FriendLink/Auth/Subscription | Mail Service | 5 | 重试 5 次，指数退避 |
| `image-process` | Upload Service | Upload Service | 2 | 重试 2 次 |

### 5.6 双写一致性方案

```
写入流程:
1. 前端请求 → Nest.js Controller
2. Service 层写入 MongoDB（主数据源）
3. 写入成功后，将变更事件推入 Bull 队列 `sync-to-es`
4. 立即返回成功响应给前端
5. Consumer 异步将数据同步到 Elasticsearch
6. 同步失败自动重试，重试耗尽进入死信队列，告警通知

重建索引:
- `POST /admin/search/rebuild` — 管理后台一键全量重建 ES 索引
```

### 5.7 API 路由规范

```
/api/v1/
├── /auth
│   ├── POST /register
│   ├── POST /login
│   ├── POST /refresh
│   └── POST /logout
├── /users
│   ├── GET /me
│   ├── PUT /me
│   └── GET /:id
├── /articles
│   ├── GET /              # 列表（分页、筛选、排序）
│   ├── POST /             # 创建（ADMIN）
│   ├── GET /:slug
│   ├── PUT /:id           # 更新（ADMIN）
│   └── DELETE /:id        # 删除（ADMIN）
├── /projects
│   # 类似 REST 结构
├── /notes
│   # 类似 REST 结构
├── /note-collections
│   ├── GET /
│   ├── GET /:id
│   └── GET /:id/notes
├── /tags
│   ├── GET /
│   └── GET /:slug
├── /timeline
│   ├── GET /?year=&type=
│   └── GET /year/:year/summary
├── /friend-links
│   ├── GET /
│   └── POST /apply         # 友链申请（公开）
├── /friend-link-applications
│   ├── GET /               # 列表（ADMIN）
│   ├── PUT /:id/approve    # 审核通过（ADMIN）
│   └── PUT /:id/reject     # 审核拒绝（ADMIN）
├── /guestbook
│   ├── GET /messages
│   ├── POST /messages
│   ├── POST /messages/:id/like
│   ├── POST /messages/:id/reply
│   └── GET /my-messages    # 我的留言（需登录）
├── /search
│   ├── GET /?q=&types=&page=
│   └── GET /suggestions?q=
├── /upload
│   └── POST /image
├── /subscriptions
│   └── POST /              # 邮件订阅
└── /admin
    ├── GET /dashboard      # 仪表盘统计
    ├── GET /stats          # 全站统计数据
    └── POST /search/rebuild # 重建 ES 索引
```

---

## 6. 数据库 Schema

### 6.1 Collection 清单

| Collection | 用途 |
|-----------|------|
| `users` | 用户 & 等级 |
| `articles` | 文章 |
| `projects` | 项目 |
| `notes` | 笔记 |
| `noteCollections` | 笔记文集 |
| `tags` | 标签 |
| `timelines` | 时间轴事件 |
| `friendLinks` | 已通过友链 |
| `friendLinkApplications` | 友链申请 |
| `guestbookMessages` | 留言板留言 |
| `subscriptions` | 邮件订阅 |
| `uploads` | 文件上传记录 |
| `siteConfigs` | 站点配置 |

### 6.2 核心 Schema

#### users
```typescript
{
  _id: ObjectId,
  email: String,           // 唯一索引
  username: String,        // 唯一索引
  password: String,        // bcrypt hash
  avatar: String,
  role: String,            // enum: ['admin', 'user']
  level: Number,           // Lv.1 - Lv.10
  exp: Number,             // 经验值
  bio: String,
  location: String,
  website: String,
  socials: {
    github: String,
    juejin: String,
    bilibili: String,
    weibo: String
  },
  status: String,          // enum: ['active', 'banned']
  lastLoginAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### articles
```typescript
{
  _id: ObjectId,
  title: String,
  slug: String,            // 唯一索引
  summary: String,
  coverImage: String,
  content: String,         // Markdown
  author: ObjectId,        // ref: users
  category: String,        // enum: ['技术', '生活', '思考', '设计', '旅行', '随笔']
  tags: [String],
  status: String,          // enum: ['published', 'draft']
  isPinned: Boolean,
  views: Number,
  likes: Number,
  readTime: Number,        // 预计阅读时间（分钟）
  publishedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### projects
```typescript
{
  _id: ObjectId,
  title: String,
  slug: String,            // 唯一索引
  summary: String,
  description: String,     // Markdown
  coverImage: String,
  status: String,          // enum: ['已发布', '开发中', '实验中']
  techStack: [String],
  category: String,        // enum: ['Web', 'UI', '动画', '实验']
  screenshots: [String],
  links: {
    preview: String,
    repo: String,
    docs: String
  },
  stats: {
    githubStars: Number,
    users: Number,
    views: Number
  },
  features: [{ title: String, description: String, icon: String }],
  milestones: [{ date: String, title: String, description: String }],
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### notes
```typescript
{
  _id: ObjectId,
  title: String,
  slug: String,
  content: String,         // Markdown
  type: String,            // enum: ['技术笔记', '读书摘录', '灵感', '清单']
  coverImage: String,
  tags: [String],
  collectionId: ObjectId,  // ref: noteCollections（可选）
  isFavorite: Boolean,
  likes: Number,
  views: Number,
  status: String,          // enum: ['published', 'draft']
  todoItems: [{ text: String, done: Boolean }],
  relatedNotes: [ObjectId],
  publishedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### guestbookMessages
```typescript
{
  _id: ObjectId,
  author: {
    userId: ObjectId,      // 注册用户（可选）
    name: String,
    avatar: String,
    level: Number
  },
  content: String,
  location: String,        // IP 归属地
  reactions: {
    great: Number,
    warm: Number,
    wow: Number,
    learned: Number
  },
  likeCount: Number,
  replyCount: Number,
  isPinned: Boolean,
  status: String,          // enum: ['published', 'pending', 'deleted']
  replies: [{
    _id: ObjectId,
    author: { name, avatar, level },
    content: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### 6.3 关键索引设计

| Collection | 索引字段 | 类型 | 用途 |
|-----------|---------|------|------|
| users | email | 唯一 | 登录查询 |
| users | username | 唯一 | 用户主页 |
| articles | slug | 唯一 | URL 查询 |
| articles | category + status + createdAt | 复合 | 分类筛选列表 |
| articles | tags + status | 复合 | 标签归档 |
| guestbookMessages | status + isPinned + createdAt | 复合 | 留言列表 |
| guestbookMessages | author.userId + createdAt | 复合 | 我的留言 |
| tags | name | 唯一 | 标签查询 |
| tags | slug | 唯一 | URL 查询 |

---

## 7. 功能模块实现清单

### 7.1 前端页面（18 个 UI 稿对应）

| UI 稿 | 页面路由 | 核心功能 | 优先级 |
|-------|---------|---------|--------|
| 01-home-dashboard | `/` | Banner轮播、最新文章、精选项目、阅读统计、标签云、时间轴、邮件订阅 | P0 |
| 02-articles-list | `/articles` | 分类/标签筛选、排序、视图切换、文章卡片 | P0 |
| 03-projects-gallery | `/projects` | 项目状态筛选、项目卡片、总览统计 | P0 |
| 04-notes-board | `/notes` | 笔记类型筛选、多样式卡片、分页 | P0 |
| 05-timeline-activity | `/timeline` | 月度时间线、年度数据、成长趋势、日历视图、里程碑 | P1 |
| 06-about-profile | `/about` | 个人简介、成长经历、教育背景、生活碎片、技能标签 | P0 |
| 07-friend-links | `/friends` | 友链展示、分类筛选、数据统计 | P1 |
| 08-guestbook-messages | `/guestbook` | 留言输入、表情/图片/链接、留言列表、活跃访客 | P1 |
| 09-article-detail | `/articles/:slug` | 面包屑、文章渲染、目录导航、代码高亮、阅读进度 | P0 |
| 10-tag-archive | `/articles/tags/:tag` | 标签详情、子分类筛选、文章列表 | P0 |
| 11-project-detail | `/projects/:slug` | 项目Banner、统计数据、功能模块、开发历程、版本趋势 | P1 |
| 12-note-detail | `/notes/:slug` | 笔记渲染、核心收获、代码块、关联笔记图谱、快捷操作 | P1 |
| 13-notes-collection | `/notes/collections/:id` | 文集信息、分类章节、笔记列表 | P1 |
| 14-yearly-summary | `/timeline/year/:year` | 年度数据概览、成就徽章、月度时间轴、活跃日历、里程碑 | P2 |
| 15-contact | `/contact` | 联系方式、合作表单、合作伙伴评价 | P2 |
| 16-friend-apply | `/friends/apply` | 申请须知、申请表单、审核流程、申请状态 | P1 |
| 17-my-messages | `/guestbook/my` | 我的留言列表、状态筛选、草稿箱 | P1 |
| 18-search-results | `/search?q=` | 全局搜索、分类筛选、结果聚合、搜索建议 | P1 |

### 7.2 管理后台页面

| 页面 | 功能 |
|------|------|
| Dashboard | 全站统计数据、内容概览、近期动态 |
| 文章管理 | 文章 CRUD、发布/草稿切换、置顶 |
| 项目管理 | 项目 CRUD、状态管理 |
| 笔记管理 | 笔记 CRUD、文集管理 |
| 友链审核 | 申请列表、通过/拒绝操作 |
| 留言管理 | 留言审核、置顶、删除 |
| 用户管理 | 用户列表、封禁/解封 |
| 系统设置 | 站点配置、Banner 配置、SEO 设置 |
| 搜索管理 | ES 索引重建、搜索统计 |

---

## 8. 开发规范

### 8.1 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 文件/目录 | kebab-case | `article-card.tsx`, `friend-link/` |
| 组件名 | PascalCase | `ArticleCard`, `FriendLinkApply` |
| Hooks | camelCase, use 前缀 | `useAuth`, `useReadingProgress` |
| Store | camelCase, Store 后缀 | `authStore`, `themeStore` |
| API 函数 | camelCase | `getArticles`, `createArticle` |
| 类型/接口 | PascalCase | `Article`, `CreateArticleDto` |

### 8.2 Git 分支规范

- `main`: 生产分支
- `develop`: 开发分支
- `feature/*`: 功能分支
- `fix/*`: Bug 修复分支

### 8.3 代码提交规范

```
feat: 新功能
fix: Bug 修复
docs: 文档更新
style: 代码格式（不影响功能）
refactor: 重构
perf: 性能优化
test: 测试相关
chore: 构建/工具相关
```

---

## 9. 风险与待决策项

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| UI 稿中大量动漫插画资源 | 中 | 需确认图片版权或使用 AI 生成替代；实际实现先用占位图 |
| 18 个页面工作量较大 | 高 | 按 P0/P1/P2 优先级分阶段实现 |
| Elasticsearch 中文分词 | 中 | 需安装 IK 分词器插件，Docker 镜像需定制 |
| 文件存储后期扩展 | 低 | 本地存储初期够用，后期可平滑迁移到 OSS |
| 邮件服务配置 | 低 | 使用 Resend/SendGrid 等第三方 SMTP |

---

## 10. 附录

### 10.1 环境变量清单

```bash
# 后端
PORT=3000
MONGODB_URI=mongodb://mongodb:27017/sorablog
REDIS_URL=redis://redis:6379
ELASTICSEARCH_NODE=http://elasticsearch:9200
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# 邮件
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

# 前端
VITE_API_BASE_URL=/api/v1
```

### 10.2 Docker Compose 服务定义

```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    volumes:
      - uploads:/app/uploads
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/sorablog
      - REDIS_URL=redis://redis:6379
    volumes:
      - uploads:/app/uploads
  mongodb:
    image: mongo:7
    volumes:
      - mongo_data:/data/db
  redis:
    image: redis:7-alpine
  elasticsearch:
    image: elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    volumes:
      - es_data:/usr/share/elasticsearch/data

volumes:
  mongo_data:
  es_data:
  uploads:
```

---

*文档结束。下一步：编写详细实现计划。*
