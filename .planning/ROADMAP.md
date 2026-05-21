# Roadmap: SoraBlog

**Created:** 2026-05-21
**Phases:** 9
**Requirements:** 62 v1 requirements mapped

---

## Phase Overview

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Infrastructure | 4/4 | Complete    | 2026-05-21 |
| 2 | Content Management Core | 搭建管理后台与内容管理核心 API | ADMN-01,03~06, ARTC-07, NOTE-05, PROJ-05, INFR-04 | 6 |
| 3 | Article Frontend | 文章列表、详情、归档、评论前端 | ARTC-01~06 | 5 |
| 4 | Note Frontend | 笔记看板、详情、文集前端 | NOTE-01~04 | 4 |
| 5 | Home Dashboard | 数据驱动的完整首页 | HOME-01~09 | 5 |
| 6 | Project System | 项目展示画廊与详情 | PROJ-01~04 | 4 |
| 7 | Timeline & About | 时间轴、年度总结、关于我 | TIML-01~02, ABOT-01~02 | 4 |
| 8 | Community & Search | 友链、留言板、全文搜索 | FRND-01~03, GSTB-01~04, SRCH-01~04 | 6 |
| 9 | Admin Dashboard & Polish | 后台仪表盘、数据统计、订阅、部署 | ADMN-02, DATA-01~03, SUBS-01~02 | 5 |

---

### Phase 1: Infrastructure
**Goal:** 完善基础设施，落地认证体系，确保前后端通信和部署链路完整
**Mode:** mvp
**Success Criteria**:
1. `docker-compose up -d` 一键启动全部服务且无报错
2. 注册/登录/刷新 Token API 可正常使用，前端登录态持久化
3. 全局异常过滤、日志、响应格式统一生效
4. API 限流 middleware 对高频请求返回 429
5. 文件上传接口可接收图片并返回可访问 URL

**Requirements:** INFR-01, INFR-02, INFR-03, INFR-04, AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05

**UI hint:** no

---

### Phase 2: Content Management Core
**Goal:** 搭建管理后台框架与内容管理核心，让博主能先创建和编辑文章、笔记、项目
**Mode:** mvp
**Success Criteria**:
1. 管理后台 `/admin` 路由可用，需管理员角色登录，有基础布局（侧边栏 + 内容区）
2. 后台支持文章的完整 CRUD：创建（富文本/Markdown 编辑器）、编辑、发布/草稿、删除、列表管理
3. 后台支持笔记的完整 CRUD：创建、编辑、发布、删除、列表管理
4. 后台支持项目的基础 CRUD：创建、编辑、删除、列表管理
5. 后台支持友链审核、留言管理、用户管理的基础操作界面
6. 后端文章/笔记/项目 API 完整，支持封面图和正文内容存储，前端 Admin 可调用
7. 文件上传在 Admin 中可用（文章封面、笔记图片、项目截图）

**Requirements:** ADMN-01, ADMN-03, ADMN-04, ADMN-05, ADMN-06, ARTC-07, NOTE-05, PROJ-05, INFR-04

**UI hint:** yes

**Plans:** 8 plans

Plans:

**Wave 1**
- [ ] `02-01-PLAN.md` — Backend content contracts, slug helpers, upload purposes, module entrypoints
- [ ] `02-05-PLAN.md` — Protected admin route shell, sidebar, top bar, overview, conditional public sidebar entry

**Wave 2 *(blocked on relevant Wave 1 foundations)***
- [ ] `02-02-PLAN.md` — Article schema, service, public/admin APIs, tests
- [ ] `02-03-PLAN.md` — Note schema, service, public/admin APIs, tests
- [ ] `02-04-PLAN.md` — Project schema, service, public/admin APIs, tests
- [ ] `02-06-PLAN.md` — Block editor adapter, preview, frontend upload purpose parity

**Wave 3 *(blocked on backend content APIs, admin shell, and editor adapter)***
- [ ] `02-07-PLAN.md` — Admin article/note/project content tables, editor flows, API hooks

**Wave 4 *(blocked on admin shell and content workspace)***
- [ ] `02-08-PLAN.md` — Friend-link, guestbook, user management shells, admin user API, final automated verification

Cross-cutting constraints:
- Admin writes must be admin-only, public reads must expose only published non-deleted content, and editor body content must remain editor-native JSON only.

**Note:** 这是 MVP 的核心骨架。Phase 2 完成后，博主已经可以通过后台独立生产内容，后续 phase 只需在前端和消费端迭代。

---

### Phase 3: Article Frontend
**Goal:** 实现文章列表、详情、标签归档和评论的前端展示
**Mode:** mvp
**Success Criteria**:
1. 文章列表页支持分页、标签筛选、分类筛选、排序（时间/热度）
2. 文章详情页正确渲染 Markdown 内容，代码块高亮，生成目录导航
3. 文章详情页显示阅读数、点赞数、发布时间，评论列表可加载
4. 标签归档页展示该标签下所有文章，URL 可分享
5. 访客可匿名评论，登录用户实名评论，评论实时显示

**Requirements:** ARTC-01, ARTC-02, ARTC-03, ARTC-04, ARTC-05, ARTC-06

**UI hint:** yes

---

### Phase 4: Note Frontend
**Goal:** 实现笔记看板、详情和文集聚合的前端展示
**Mode:** mvp
**Success Criteria**:
1. 笔记看板页以瀑布流/网格展示笔记卡片
2. 笔记卡片支持多种视觉样式（短文、代码片段、引用、待办）
3. 笔记详情页 Markdown 渲染正确，代码高亮
4. 笔记文集页按主题聚合，展示系列笔记导航

**Requirements:** NOTE-01, NOTE-02, NOTE-03, NOTE-04

**UI hint:** yes

---

### Phase 5: Home Dashboard
**Goal:** 实现数据驱动的完整首页，所有模块从后端 API 获取实时数据
**Mode:** mvp
**Success Criteria**:
1. Banner 轮播展示后端配置的精选内容，支持自动/手动切换
2. 最新文章列表调用 API 渲染真实数据（标题、摘要、标签、阅读数）
3. 精选项目卡片展示后端返回的项目数据
4. 个人资料卡、标签云、时间轴、阅读统计图表均动态渲染
5. 邮件订阅表单提交后后端接收并存入数据库
6. 首页在 2s 内完成首屏渲染（ Lighthouse FCP < 2s ）

**Requirements:** HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, HOME-06, HOME-07, HOME-08, HOME-09

**UI hint:** yes

---

### Phase 6: Project System
**Goal:** 实现项目展示画廊和项目详情页
**Mode:** mvp
**Success Criteria**:
1. 项目展示页以响应式卡片画廊呈现所有项目
2. 项目卡片包含真实封面、名称、简介、技术栈标签、状态标签
3. 状态筛选（开发中/已完成/维护中）实时过滤卡片
4. 项目详情页展示完整描述、多图截图、外部链接、技术细节

**Requirements:** PROJ-01, PROJ-02, PROJ-03, PROJ-04

**UI hint:** yes

---

### Phase 7: Timeline & About
**Goal:** 实现时间轴、年度总结、关于我和联系页面
**Mode:** mvp
**Success Criteria**:
1. 时间轴页按月份分组展示动态和里程碑，支持滚动加载
2. 年度总结页展示当年文章数、阅读量、项目数等数据可视化图表
3. 关于我页面展示个人简介、技能栈、经历时间线、社交链接
4. 联系合作页表单可提交，后端接收并记录（或发送邮件通知）

**Requirements:** TIML-01, TIML-02, ABOT-01, ABOT-02

**UI hint:** yes

---

### Phase 8: Community & Search
**Goal:** 实现友链系统、留言板和全文搜索
**Mode:** mvp
**Success Criteria**:
1. 友链展示页按分类展示已审核友链，点击可跳转
2. 友链申请表单提交后进入待审核状态，博主后台可审核
3. 留言板支持富文本留言（文字、表情、图片、链接）
4. 留言支持楼中楼回复，嵌套层级正确渲染
5. 博主可置顶、删除、回复留言；用户可查看"我的留言"
6. 全局搜索框输入关键词时展示实时搜索建议
7. 搜索结果页展示文章/项目/笔记的综合结果，支持按类型过滤
8. Elasticsearch IK 分词正确索引和搜索中文内容

**Requirements:** FRND-01, FRND-02, FRND-03, GSTB-01, GSTB-02, GSTB-03, GSTB-04, SRCH-01, SRCH-02, SRCH-03, SRCH-04

**UI hint:** yes

---

### Phase 9: Admin Dashboard & Polish
**Goal:** 完成后台仪表盘、数据统计、邮件订阅和部署验证
**Mode:** mvp
**Success Criteria**:
1. 管理后台仪表盘展示站点概览（内容统计、访问趋势、最新动态）
2. 阅读统计系统记录每篇文章 PV/UV，活跃日历展示发布频率
3. 成长趋势图表展示博主内容产出和阅读增长趋势
4. 邮件订阅系统收集邮箱并发送确认邮件（Bull 队列异步）
5. 新文章发布时自动通知已确认订阅的用户
6. `docker-compose up -d` 后全站可用，所有页面可访问，README 完善
7. 全站端到端手动验证通过（核心用户流程无阻塞）

**Requirements:** ADMN-02, DATA-01, DATA-02, DATA-03, SUBS-01, SUBS-02

**UI hint:** yes

---

## Execution Notes

- **Phase 依赖：** 必须按顺序执行（1 → 2 → 3 → ... → 9），后续 phase 依赖前置 phase 的 API 和数据模型
- **MVP 骨架：** Phase 2 是核心转折点。完成后博主已经拥有独立的内容生产能力（后台 + 内容 API），后续 phase 均是在此骨架上迭代前端展示和消费端功能
- **设计稿驱动：** Phase 2-8 的所有前端页面必须严格对照 `ui-drafts/` 和 `home-ui-design/` 中的 PNG 设计稿实现
- **参考文档：** 每个 phase 的详细任务分解可参考 `docs/superpowers/plans/sorablog/phase-*.md`（注意 phase 编号已重新编排，内容需对应映射）
