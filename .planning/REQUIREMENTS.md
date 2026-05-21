# Requirements: SoraBlog

**Defined:** 2026-05-21
**Core Value:** 访客能够流畅地阅读文章、浏览项目、查看笔记，并与博主通过留言板和友链进行互动；博主可以通过内置管理后台高效地管理全部内容。

## v1 Requirements

### Infrastructure

- [ ] **INFR-01**: Docker Compose 全栈部署可一键启动（Nginx + NestJS + MongoDB + Redis + ES）
- [ ] **INFR-02**: 后端全局异常处理、请求日志、响应格式统一
- [ ] **INFR-03**: API 限流与防刷机制生效（@nestjs/throttler）
- [ ] **INFR-04**: 文件上传服务可用（头像、文章封面、留言图片）

### Authentication

- [ ] **AUTH-01**: 用户可通过邮箱/密码注册账号
- [ ] **AUTH-02**: 用户可通过邮箱/密码登录并获得 JWT Token
- [ ] **AUTH-03**: Token 过期后可使用 Refresh Token 换取新 Token
- [ ] **AUTH-04**: 未认证用户访问受保护 API 时返回 401 并被引导登录
- [ ] **AUTH-05**: 前端登录状态持久化，刷新页面后保持登录

### Home Dashboard

- [ ] **HOME-01**: 首页 Banner 轮播展示精选内容，支持自动切换和手动导航
- [ ] **HOME-02**: 最新文章列表展示（标题、摘要、标签、阅读数、发布时间）
- [ ] **HOME-03**: 精选项目卡片展示（封面、名称、技术栈、状态）
- [ ] **HOME-04**: 个人资料卡片展示（头像、昵称、简介、社交链接、等级）
- [ ] **HOME-05**: 标签云展示热门标签，点击可跳转对应归档页
- [ ] **HOME-06**: 时间轴展示近期动态/里程碑
- [ ] **HOME-07**: 邮件订阅输入框可提交邮箱地址
- [ ] **HOME-08**: 阅读统计图表展示（Recharts 数据可视化）
- [ ] **HOME-09**: 首页所有数据从后端 API 动态获取，非静态写死

### Article System

- [ ] **ARTC-01**: 文章列表页支持分页、按标签/分类筛选、排序
- [ ] **ARTC-02**: 文章详情页渲染完整内容（Markdown 渲染、代码高亮、目录导航）
- [ ] **ARTC-03**: 文章详情页显示阅读数、点赞数、发布/更新时间
- [ ] **ARTC-04**: 文章支持标签和分类体系
- [ ] **ARTC-05**: 标签归档页展示某标签下的所有文章
- [ ] **ARTC-06**: 文章支持评论（访客可匿名评论，登录用户可实名评论）
- [ ] **ARTC-07**: 后端文章 CRUD API 完整，支持富文本/Markdown 内容存储

### Project System

- [ ] **PROJ-01**: 项目展示页以卡片画廊形式呈现所有项目
- [ ] **PROJ-02**: 项目卡片包含封面、名称、简介、技术栈标签、状态
- [ ] **PROJ-03**: 项目支持按状态（开发中/已完成/维护中）筛选
- [ ] **PROJ-04**: 项目详情页展示完整信息（描述、截图、链接、技术细节）
- [ ] **PROJ-05**: 后端项目 CRUD API 完整

### Note System

- [ ] **NOTE-01**: 笔记看板页以卡片形式展示所有笔记
- [ ] **NOTE-02**: 笔记卡片支持多种样式（短文、代码片段、引用、待办）
- [ ] **NOTE-03**: 笔记详情页支持 Markdown 渲染和代码高亮
- [ ] **NOTE-04**: 笔记文集页按主题/系列聚合相关笔记
- [ ] **NOTE-05**: 后端笔记 CRUD API 完整

### Timeline & About

- [ ] **TIML-01**: 时间轴页按月份展示动态和里程碑
- [ ] **TIML-02**: 年度总结页展示当年数据可视化（文章数、阅读量、项目数等）
- [ ] **ABOT-01**: 关于我页面展示个人简介、技能栈、经历、联系方式
- [ ] **ABOT-02**: 联系合作页提供表单，访客可提交合作意向

### Community

- [ ] **FRND-01**: 友链展示页按分类展示所有已审核友链
- [ ] **FRND-02**: 访客可提交友链申请（站点名称、URL、描述、Logo）
- [ ] **FRND-03**: 博主可在后台审核/编辑/删除友链
- [ ] **GSTB-01**: 留言板支持发布留言（文字 + 表情 + 图片 + 链接）
- [ ] **GSTB-02**: 留言支持回复和楼中楼嵌套展示
- [ ] **GSTB-03**: 博主可置顶/删除/回复留言
- [ ] **GSTB-04**: 用户可在"我的留言"页面查看自己发过的所有留言

### Search

- [ ] **SRCH-01**: 全局搜索框支持输入关键词实时搜索建议
- [ ] **SRCH-02**: 搜索结果页展示文章/项目/笔记的综合结果
- [ ] **SRCH-03**: 基于 Elasticsearch IK 分词实现中文全文搜索
- [ ] **SRCH-04**: 搜索支持按类型（文章/项目/笔记）过滤

### Admin Dashboard

- [ ] **ADMN-01**: 管理后台独立路由 `/admin`，需管理员角色登录访问
- [ ] **ADMN-02**: 后台仪表盘展示站点概览（内容统计、访问趋势、最新动态）
- [ ] **ADMN-03**: 后台支持文章/项目/笔记的完整 CRUD
- [ ] **ADMN-04**: 后台支持友链审核和管理
- [ ] **ADMN-05**: 后台支持留言管理（审核、回复、删除、置顶）
- [ ] **ADMN-06**: 后台支持用户管理（查看、禁用、调整角色）

### Data & Subscription

- [ ] **DATA-01**: 阅读统计系统记录每篇文章的 PV/UV
- [ ] **DATA-02**: 成长趋势图表展示博主内容产出和阅读增长趋势
- [ ] **DATA-03**: 活跃日历（GitHub-style heatmap）展示内容发布频率
- [ ] **SUBS-01**: 邮件订阅系统收集邮箱并发送确认邮件
- [ ] **SUBS-02**: 新文章发布时自动通知订阅用户（Bull 队列异步发送）

## v2 Requirements

### Notifications

- **NOTF-01**: 用户收到新回复时获得站内通知
- **NOTF-02**: 友链申请状态变更邮件通知
- **NOTF-03**: 用户可配置通知偏好

### Advanced Content

- **ADV-C-01**: 文章支持系列/连载，自动生成分章导航
- **ADV-C-02**: 文章支持私密/草稿/定时发布
- **ADV-C-03**: 内容导入/导出（Markdown 批量导入）

### Analytics

- **ANLT-01**: 集成第三方分析（Umami / Plausible）
- **ANLT-02**: 热门文章排行和趋势分析

## Out of Scope

| Feature | Reason |
|---------|--------|
| 多用户博客平台（SaaS） | 个人博客单用户即可 |
| 移动端原生 App | Web-first，响应式覆盖移动端 |
| 第三方 OAuth 登录 | 邮箱注册已满足 v1 |
| 实时在线聊天 | 留言板已覆盖异步互动 |
| 视频内容托管 | 聚焦图文，视频外链即可 |
| 多语言国际化 | 中文优先，后续按需扩展 |
| 支付/打赏系统 | 非核心，v2+ 再考虑 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFR-01 | Phase 1 | Pending |
| INFR-02 | Phase 1 | Pending |
| INFR-03 | Phase 1 | Pending |
| INFR-04 | Phase 1 | Pending |
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| AUTH-04 | Phase 1 | Pending |
| AUTH-05 | Phase 1 | Pending |
| ADMN-01 | Phase 2 | Pending |
| ADMN-03 | Phase 2 | Pending |
| ADMN-04 | Phase 2 | Pending |
| ADMN-05 | Phase 2 | Pending |
| ADMN-06 | Phase 2 | Pending |
| ARTC-07 | Phase 2 | Pending |
| NOTE-05 | Phase 2 | Pending |
| PROJ-05 | Phase 2 | Pending |
| ARTC-01 | Phase 3 | Pending |
| ARTC-02 | Phase 3 | Pending |
| ARTC-03 | Phase 3 | Pending |
| ARTC-04 | Phase 3 | Pending |
| ARTC-05 | Phase 3 | Pending |
| ARTC-06 | Phase 3 | Pending |
| NOTE-01 | Phase 4 | Pending |
| NOTE-02 | Phase 4 | Pending |
| NOTE-03 | Phase 4 | Pending |
| NOTE-04 | Phase 4 | Pending |
| HOME-01 | Phase 5 | Pending |
| HOME-02 | Phase 5 | Pending |
| HOME-03 | Phase 5 | Pending |
| HOME-04 | Phase 5 | Pending |
| HOME-05 | Phase 5 | Pending |
| HOME-06 | Phase 5 | Pending |
| HOME-07 | Phase 5 | Pending |
| HOME-08 | Phase 5 | Pending |
| HOME-09 | Phase 5 | Pending |
| PROJ-01 | Phase 6 | Pending |
| PROJ-02 | Phase 6 | Pending |
| PROJ-03 | Phase 6 | Pending |
| PROJ-04 | Phase 6 | Pending |
| TIML-01 | Phase 7 | Pending |
| TIML-02 | Phase 7 | Pending |
| ABOT-01 | Phase 7 | Pending |
| ABOT-02 | Phase 7 | Pending |
| FRND-01 | Phase 8 | Pending |
| FRND-02 | Phase 8 | Pending |
| FRND-03 | Phase 8 | Pending |
| GSTB-01 | Phase 8 | Pending |
| GSTB-02 | Phase 8 | Pending |
| GSTB-03 | Phase 8 | Pending |
| GSTB-04 | Phase 8 | Pending |
| SRCH-01 | Phase 8 | Pending |
| SRCH-02 | Phase 8 | Pending |
| SRCH-03 | Phase 8 | Pending |
| SRCH-04 | Phase 8 | Pending |
| ADMN-02 | Phase 9 | Pending |
| DATA-01 | Phase 9 | Pending |
| DATA-02 | Phase 9 | Pending |
| DATA-03 | Phase 9 | Pending |
| SUBS-01 | Phase 9 | Pending |
| SUBS-02 | Phase 9 | Pending |

**Coverage:**
- v1 requirements: 62 total
- Mapped to phases: 62
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-21*
*Last updated: 2026-05-21 after initial definition*
