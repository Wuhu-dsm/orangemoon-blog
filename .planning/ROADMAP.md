# Roadmap: SoraBlog

**Created:** 2026-05-21
**Phases:** 9
**Requirements:** 62 v1 requirements mapped

---

## Phase Overview

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Infrastructure | 完善基础设施与认证体系 | INFR-01~04, AUTH-01~05 | 5 |
| 2 | Home Dashboard | 实现完整动态首页 | HOME-01~09 | 5 |
| 3 | Article System | 文章列表、详情、归档、评论 | ARTC-01~07 | 5 |
| 4 | Project System | 项目展示与详情 | PROJ-01~05 | 4 |
| 5 | Note System | 笔记看板、详情、文集 | NOTE-01~05 | 4 |
| 6 | Timeline & About | 时间轴、年度总结、关于我 | TIML-01~02, ABOT-01~02 | 4 |
| 7 | Community | 友链、留言板、我的留言 | FRND-01~03, GSTB-01~04 | 7 |
| 8 | Search & Admin | 全文搜索与管理后台 | SRCH-01~04, ADMN-01~06, DATA-01~03 | 10 |
| 9 | Deployment & Polish | 部署验证、订阅、收尾 | SUBS-01~02 | 3 |

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

### Phase 2: Home Dashboard
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

### Phase 3: Article System
**Goal:** 实现文章列表、详情、标签归档和评论系统
**Mode:** mvp
**Success Criteria**:
1. 文章列表页支持分页、标签筛选、分类筛选、排序（时间/热度）
2. 文章详情页正确渲染 Markdown 内容，代码块高亮，生成目录导航
3. 文章详情页显示阅读数、点赞数、发布时间，评论列表可加载
4. 标签归档页展示该标签下所有文章，URL 可分享
5. 访客可匿名评论，登录用户实名评论，评论实时显示
6. 后端文章 CRUD API 完整，支持封面图上传和内容编辑

**Requirements:** ARTC-01, ARTC-02, ARTC-03, ARTC-04, ARTC-05, ARTC-06, ARTC-07

**UI hint:** yes

---

### Phase 4: Project System
**Goal:** 实现项目展示画廊和项目详情页
**Mode:** mvp
**Success Criteria**:
1. 项目展示页以响应式卡片画廊呈现所有项目
2. 项目卡片包含真实封面、名称、简介、技术栈标签、状态标签
3. 状态筛选（开发中/已完成/维护中）实时过滤卡片
4. 项目详情页展示完整描述、多图截图、外部链接、技术细节
5. 后端项目 CRUD API 完整，支持封面图和截图上传

**Requirements:** PROJ-01, PROJ-02, PROJ-03, PROJ-04, PROJ-05

**UI hint:** yes

---

### Phase 5: Note System
**Goal:** 实现笔记看板、详情和文集聚合
**Mode:** mvp
**Success Criteria**:
1. 笔记看板页以瀑布流/网格展示笔记卡片
2. 笔记卡片支持多种视觉样式（短文、代码片段、引用、待办）
3. 笔记详情页 Markdown 渲染正确，代码高亮
4. 笔记文集页按主题聚合，展示系列笔记导航
5. 后端笔记 CRUD API 完整

**Requirements:** NOTE-01, NOTE-02, NOTE-03, NOTE-04, NOTE-05

**UI hint:** yes

---

### Phase 6: Timeline & About
**Goal:** 实现时间轴、年度总结、关于我和联系页面
**Mode:** mvp
**Success Criteria**:
1. 时间轴页按月份分组展示动态和里程碑，支持滚动加载
2. 年度总结页展示当年文章数、阅读量、项目数等数据可视化图表
3. 关于我页面展示个人简介、技能栈、经历时间线、社交链接
4. 联系合作页表单可提交，后端接收并记录（或发送邮件通知）
5. 所有页面数据从后端 API 获取

**Requirements:** TIML-01, TIML-02, ABOT-01, ABOT-02

**UI hint:** yes

---

### Phase 7: Community
**Goal:** 实现友链系统和留言板完整互动功能
**Mode:** mvp
**Success Criteria**:
1. 友链展示页按分类展示已审核友链，点击可跳转
2. 友链申请表单提交后进入待审核状态，博主后台可审核
3. 留言板支持富文本留言（文字、表情、图片、链接）
4. 留言支持楼中楼回复，嵌套层级正确渲染
5. 博主可置顶、删除、回复留言
6. 用户可在"我的留言"页面查看自己发过的所有留言

**Requirements:** FRND-01, FRND-02, FRND-03, GSTB-01, GSTB-02, GSTB-03, GSTB-04

**UI hint:** yes

---

### Phase 8: Search & Admin
**Goal:** 实现全文搜索和管理后台
**Mode:** mvp
**Success Criteria**:
1. 全局搜索框输入关键词时展示实时搜索建议
2. 搜索结果页展示文章/项目/笔记的综合结果，支持按类型过滤
3. Elasticsearch IK 分词正确索引和搜索中文内容
4. 管理后台 `/admin` 需管理员角色登录，非管理员重定向
5. 后台仪表盘展示内容统计、访问趋势、最新动态概览
6. 后台支持文章/项目/笔记的完整 CRUD（含富文本编辑器）
7. 后台支持友链审核、留言管理、用户管理
8. 阅读统计系统记录每篇文章 PV/UV，活跃日历展示发布频率

**Requirements:** SRCH-01, SRCH-02, SRCH-03, SRCH-04, ADMN-01, ADMN-02, ADMN-03, ADMN-04, ADMN-05, ADMN-06, DATA-01, DATA-02, DATA-03

**UI hint:** yes

---

### Phase 9: Deployment & Polish
**Goal:** 完成部署验证、邮件订阅和最终收尾
**Mode:** mvp
**Success Criteria**:
1. `docker-compose up -d` 后全站可用，所有 18 个页面可访问
2. 邮件订阅系统收集邮箱并发送确认邮件（Bull 队列异步）
3. 新文章发布时自动通知已确认订阅的用户
4. README 完善，包含部署指南和环境变量说明
5. 全站端到端手动验证通过（核心用户流程无阻塞）

**Requirements:** SUBS-01, SUBS-02

**UI hint:** no

---

## Execution Notes

- **Phase 依赖：** 必须按顺序执行（1 → 2 → 3 → ... → 9），后续 phase 依赖前置 phase 的 API 和数据模型
- **Brownfield 起点：** Phase 1 部分基础设施（NestJS、MongoDB、Redis、ES、JWT、Docker）已实现，本 phase 聚焦补齐缺口（限流、文件上传、前端登录态持久化、API 联调）
- **设计稿驱动：** Phase 2-8 的所有前端页面必须严格对照 `ui-drafts/` 和 `home-ui-design/` 中的 PNG 设计稿实现
- **参考文档：** 每个 phase 的详细任务分解可参考 `docs/superpowers/plans/sorablog/phase-*.md`
