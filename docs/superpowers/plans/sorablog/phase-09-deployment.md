# Phase 9: 部署与收尾

> **目标:** Docker 全量部署验证、README 完善、最终验收
> **UI 稿参考:** 全部
> **前置条件:** Phase 8 完成
> **验收标准:** `docker-compose up -d` 后全站可用，所有 18 个页面可访问

---

## Task 9.1: Docker 全量构建验证

**Files:**
- 无新文件，仅验证

- [ ] **Step 1: 构建并启动全部服务**

```bash
docker-compose up -d --build
# 期望: 5 个服务全部启动成功
# 检查: docker-compose ps
```

- [ ] **Step 2: 验证前端可访问**

```bash
curl http://localhost
# 期望: 返回 HTML 页面，包含 Sidebar 和 Header
```

- [ ] **Step 3: 验证后端 API**

```bash
curl http://localhost:3000/api/v1/articles
# 期望: 返回 { code: 200, data: [...], message: 'success' }

curl http://localhost:3000/api/v1/search?q=Next.js
# 期望: 返回搜索结果
```

- [ ] **Step 4: 验证数据库**

```bash
docker-compose exec mongodb mongosh sorablog --eval "db.articles.countDocuments()"
# 期望: 返回文章数量 > 0
```

- [ ] **Step 5: 验证 Redis**

```bash
docker-compose exec redis redis-cli ping
# 期望: PONG
```

- [ ] **Step 6: 验证 Elasticsearch**

```bash
curl http://localhost:9200/_cat/indices
# 期望: 显示 articles, projects, notes 索引
```

---

## Task 9.2: 运行种子数据

**Files:**
- 无新文件

- [ ] **Step 1: 在容器内运行种子脚本**

```bash
cd backend
npx ts-node src/seed.ts
# 期望: Seed completed
```

- [ ] **Step 2: 验证数据已插入**

```bash
curl http://localhost:3000/api/v1/articles
# 期望: 返回 seeded 文章数据
```

---

## Task 9.3: 端到端页面验证

**Files:**
- 无新文件

- [ ] **Step 1: 验证所有页面可访问**

逐个访问以下页面，确认无报错：

| 页面 | URL | 检查点 |
|------|-----|--------|
| 首页 | http://localhost | Banner、文章卡片、项目卡片、统计图表 |
| 文章列表 | http://localhost/articles | 分类筛选、文章卡片网格 |
| 文章详情 | http://localhost/articles/{slug} | 标题、内容、目录、相关标签 |
| 标签归档 | http://localhost/articles/tags/{tag} | 标签头图、文章列表 |
| 项目展示 | http://localhost/projects | 项目卡片、分类筛选 |
| 项目详情 | http://localhost/projects/{slug} | 头图、统计、功能模块 |
| 笔记看板 | http://localhost/notes | 多样式卡片、类型筛选 |
| 笔记详情 | http://localhost/notes/{slug} | 内容概要、核心收获 |
| 笔记文集 | http://localhost/notes/collections/{id} | 章节布局 |
| 时间轴 | http://localhost/timeline | 时间线、图表 |
| 年度总结 | http://localhost/timeline/year/2024 | 数据概览、图表 |
| 关于我 | http://localhost/about | Banner、经历、教育 |
| 联系合作 | http://localhost/contact | 表单、服务列表 |
| 友链 | http://localhost/friends | 友链卡片、分类 |
| 友链申请 | http://localhost/friends/apply | 申请表单 |
| 留言板 | http://localhost/guestbook | 留言列表、输入框 |
| 搜索 | http://localhost/search?q=Next.js | 搜索结果 |
| 登录 | http://localhost/login | 登录表单 |
| 管理后台 | http://localhost/admin | 仪表盘（需管理员登录） |

- [ ] **Step 2: 记录问题并修复**

如发现有页面报错或样式问题，立即修复。

---

## Task 9.4: README 完善

**Files:**
- Modify: `README.md`

- [ ] **Step 1: 编写 README**

```markdown
# SoraBlog

个人博客全栈系统。

## 技术栈

- **前端**: React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui + Framer Motion + Recharts
- **后端**: Nest.js 11 + MongoDB + Redis + Elasticsearch + Bull

## 快速开始

### 环境要求

- Node.js 20+
- Docker & Docker Compose

### 1. 克隆项目

```bash
git clone <repo-url>
cd orangemoon-blog
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，设置 JWT_SECRET 等配置
```

### 3. Docker 部署（推荐）

```bash
docker-compose up -d
```

访问 http://localhost 查看前端，http://localhost:3000/api/v1 访问 API。

### 4. 本地开发

启动基础设施：

```bash
docker-compose up -d mongodb redis elasticsearch
```

启动后端：

```bash
cd backend
npm install
npm run start:dev
```

启动前端：

```bash
cd frontend
npm install
npm run dev
```

### 5. 种子数据

```bash
cd backend
npx ts-node src/seed.ts
```

## 功能模块

- [x] 首页 Dashboard（Banner、最新文章、精选项目、阅读统计、标签云、时间轴、订阅）
- [x] 文章系统（列表、详情、分类筛选、标签归档）
- [x] 项目系统（展示、详情、技术栈标签）
- [x] 笔记系统（看板、详情、文集、多种笔记类型）
- [x] 时间轴（事件展示、年度总结、数据可视化）
- [x] 关于我（个人简介、成长经历、教育背景、生活碎片）
- [x] 联系合作（联系方式、合作表单）
- [x] 友链系统（展示、分类、申请审核）
- [x] 留言板（留言发布、回复、点赞、表情反应）
- [x] 全文搜索（Elasticsearch + IK 分词）
- [x] 管理后台（仪表盘、内容管理）
- [x] 用户系统（注册/登录、JWT、等级体系）

## 部署架构

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Nginx     │───▶│  Nest.js    │───▶│  MongoDB    │
│  (前端静态)  │    │   API服务    │    │   数据库     │
└─────────────┘    └──────┬──────┘    └─────────────┘
                     ┌─────▼─────┐
                     │  Redis    │
                     │  缓存/队列 │
                     └───────────┘
                     ┌─────────────┐
                     │Elasticsearch│
                     │  搜索引擎    │
                     └─────────────┘
```

## License

MIT
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: update readme with setup instructions"
```

---

## Task 9.5: 最终验收清单

- [ ] **Step 1: 功能完整性检查**

| 功能 | 状态 |
|------|------|
| 首页 Dashboard | ☐ |
| 文章列表/详情/归档 | ☐ |
| 项目展示/详情 | ☐ |
| 笔记看板/详情/文集 | ☐ |
| 时间轴/年度总结 | ☐ |
| 关于我/联系合作 | ☐ |
| 友链/申请 | ☐ |
| 留言板/我的留言 | ☐ |
| 全文搜索 | ☐ |
| 管理后台 | ☐ |
| 用户登录/注册 | ☐ |
| Docker 部署 | ☐ |

- [ ] **Step 2: UI 一致性检查**

- [ ] 所有页面配色一致（green-500 主色）
- [ ] Sidebar 和 Header 在所有页面显示正常
- [ ] 暗色模式切换正常
- [ ] 响应式布局（可选）

- [ ] **Step 3: 性能检查**

- [ ] 首页加载时间 < 3s
- [ ] 文章列表分页正常
- [ ] 搜索响应时间 < 1s

- [ ] **Step 4: 安全基础检查**

- [ ] JWT Token 验证正常
- [ ] 管理员权限控制正常
- [ ] API 限流生效

- [ ] **Step 5: Commit 最终版本**

```bash
git commit --allow-empty -m "release: v1.0.0 - complete blog system"
```

---

## 已知限制与后续优化方向

1. **图片资源**: UI 稿中的动漫插画需要替换为实际图片或 AI 生成
2. **邮件服务**: 需要配置真实 SMTP 才能发送邮件通知
3. **文件存储**: 当前本地存储，生产环境建议迁移到 OSS
4. **SEO**: 纯 SPA 方案，如需 SEO 可考虑 SSR 或预渲染
5. **移动端适配**: 当前主要针对桌面端，移动端可进一步优化
6. **测试覆盖**: 建议补充单元测试和 E2E 测试
7. **CI/CD**: 建议配置 GitHub Actions 自动构建和部署
