# SoraBlog

## What This Is

SoraBlog 是一个功能完整的个人博客全栈系统，采用前后端分离架构。基于 18 张 UI 设计稿，覆盖首页 Dashboard、文章、项目、笔记、时间轴、关于我、友链、留言板、搜索、管理后台等全功能模块。目标是为 orangeMoon 打造一个高颜值、高性能、可维护的个人博客站点。

## Core Value

访客能够流畅地阅读文章、浏览项目、查看笔记，并与博主通过留言板和友链进行互动；博主可以通过内置管理后台高效地管理全部内容。

## Requirements

### Validated

- ✓ 后端 NestJS 基础设施与模块化架构 — 现有
- ✓ MongoDB + Mongoose 数据库连接与 User Schema — 现有
- ✓ Redis 客户端封装（ioredis）— 现有
- ✓ Elasticsearch 客户端封装 — 现有
- ✓ Bull 队列基础设施 — 现有
- ✓ JWT 认证体系（注册/登录/Token 签发/刷新）— 现有
- ✓ 全局异常过滤、响应转换、日志拦截器 — 现有
- ✓ 前端 React + Vite + TypeScript 基础架构 — 现有
- ✓ Tailwind CSS + shadcn/ui 组件库体系 — 现有
- ✓ Zustand 状态管理（auth、theme、sidebar）— 现有
- ✓ Axios API 客户端（含认证拦截器）— 现有
- ✓ 首页 Dashboard 静态 UI 组件（Banner、文章、项目、标签云、时间轴、订阅）— 现有
- ✓ Docker Compose 全栈部署配置 — 现有

### Active

- [ ] 文章系统：列表/详情/标签归档/评论
- [ ] 项目系统：展示/详情/状态筛选
- [ ] 笔记系统：看板/详情/文集/代码高亮
- [ ] 时间轴与关于我：年度总结/数据可视化/联系表单
- [ ] 社区互动：友链展示与申请/留言板（表情/图片/链接/回复/置顶）
- [ ] 全文搜索：Elasticsearch IK 分词/搜索建议/结果页
- [ ] 管理后台：`/admin` 路由/内容 CRUD/友链审核/仪表盘
- [ ] 数据统计：阅读统计/成长趋势/活跃日历
- [ ] 邮件订阅与通知系统
- [ ] 用户等级体系与积分
- [ ] 前端路由完整化（除首页外的所有页面）
- [ ] API 限流与防刷机制落地

### Out of Scope

- 多用户博客平台（SaaS）— 个人博客单用户即可
- 移动端原生 App — Web-first，响应式覆盖移动端
- 第三方 OAuth 登录（GitHub/Google）— 邮箱注册已满足 v1
- 实时在线聊天 — 留言板已覆盖异步互动
- 视频内容托管 — 聚焦图文，视频外链即可
- 多语言国际化 — 中文优先，后续按需扩展

## Context

- **设计资产：** 18 张 UI 设计稿位于 `ui-drafts/`、`home-ui-design/`、`sidebar/`，覆盖全部功能页面
- **历史规划：** `docs/superpowers/` 下存有完整设计文档和 9 个 phase 的详细实现计划，可作为需求和实现参考
- **代码库映射：** `.planning/codebase/` 已生成，包含架构、技术栈、结构、约定、测试、集成和关注点分析
- **当前状态：** 基础设施（前后端框架、数据库、缓存、搜索、队列、认证）已搭建完成；业务功能（文章、项目、笔记、留言、搜索、后台）待实现
- **前端规范：** 项目根目录 `AGENTS.md` 定义了前端组件化、hooks、状态管理、Tailwind 样式等开发规范

## Constraints

- **Tech Stack:** 已锁定 React 18 + Vite + NestJS 11 + MongoDB + Redis + Elasticsearch，不改变基础架构
- **Design Compliance:** 所有前端页面必须与现有 UI 设计稿视觉风格一致，保持高颜值输出
- **Timeline:** 按 9 个 phase 推进，每个 phase 产出可独立验收的端到端功能
- **Dependencies:** Docker Compose 为唯一官方部署方式，所有服务必须容器化可运行
- **Performance:** 首屏加载 < 2s，API 响应 < 200ms（Redis 缓存后）
- **Security:** JWT 认证已落地，后续需补充 API 限流、上传安全、XSS 防护

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 使用现有前后端代码基础继续开发 | 基础设施已投入，推翻重建成本高 | ✓ Good — 架构合理 |
| 按 UI 设计稿驱动前端实现 | 18 张稿图已完备，避免设计返工 | — Pending |
| MongoDB 为主存储，ES 仅用于搜索 | 博客内容关系简单，无需关系型数据库 | — Pending |
| 内置 `/admin` 管理后台而非独立系统 | 降低部署复杂度，单代码库维护 | — Pending |
| GSD 规划替代原有 docs/superpowers 计划 | 统一使用 GSD 工作流管理执行和验证 | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `$gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `$gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-21 after initialization*
