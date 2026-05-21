# 前端开发规范

本规范适用于 `frontend` 目录下的前端代码修改。当前项目使用 React、TypeScript、Vite、Tailwind CSS，并已经有 `components/ui`、`components/home`、`pages`、`stores`、`api`、`lib` 等基础分层。

## 修改前先判断

修改代码前先阅读相关文件，确认现有结构和复用点，不要直接在单个文件里堆实现。

- 先查是否已有可复用组件、样式工具、store、api client 或工具函数。
- 判断新增逻辑是页面专属，还是未来可能被多个组件复用。
- 判断重复 UI 是否应该抽成组件，重复状态/副作用/事件逻辑是否应该抽成 hook。
- 页面文件优先只负责路由页面的组合与编排，避免把复杂 UI、请求逻辑、状态流转都写在页面里。

## 目录职责

- `src/components/ui`：通用基础组件，保持无业务或弱业务耦合。
- `src/components/<feature>`：业务展示组件，例如首页相关组件放在 `components/home`。
- `src/pages`：路由页面和页面级组合，负责组织组件，不承载过多细节实现。
- `src/stores`：跨页面共享状态，使用 Zustand 时保持状态边界清晰。
- `src/api`：统一封装请求、拦截器和接口调用，不在组件里重复写 axios/fetch 细节。
- `src/lib`：通用工具函数，例如 className 合并工具 `cn`。
- `src/hooks`：需要时新增，用于存放可复用的交互逻辑、数据逻辑、浏览器事件逻辑和复杂状态流转。

## 组件化原则

- 同一类 UI 结构重复出现 2 次以上，优先抽为组件。
- 组件应职责单一：展示组件负责渲染，容器或页面负责组合，复杂业务逻辑不要塞进纯展示组件。
- 组件 props 必须使用明确的 TypeScript 类型或接口，避免随手使用 `any`。
- 新组件优先复用 `components/ui` 里的基础组件和已有业务组件。
- 不要为了少写一个文件而复制粘贴大段 JSX、className、事件处理逻辑。
- 组件文件过大时，优先拆出子组件、静态配置、hook 或工具函数，而不是继续追加分支逻辑。

## Hooks 抽离原则

以下逻辑重复出现或明显可复用时，优先抽到 `src/hooks`：

- 分页、轮播、筛选、排序、表单状态等可复用状态流转。
- `useEffect` 中的事件监听、定时器、媒体查询、滚动监听、键盘监听等副作用。
- 数据请求、加载态、错误态、重试逻辑等可复用数据逻辑。
- 与浏览器 API 交互的逻辑，例如 localStorage、resize、visibility、clipboard。

hook 命名使用 `useXxx`，只暴露调用方需要的状态和方法。hook 内部不要直接渲染 UI，UI 交给组件处理。

## 状态与 API

- 局部状态优先放在组件内部，跨组件或跨页面共享状态再放进 `stores`。
- store 只保存真正需要共享的状态，不把临时表单字段、hover 状态等短生命周期状态放进去。
- 接口请求统一经过 `src/api`，复用已有 `apiClient`、拦截器和错误处理策略。
- 请求结果需要缓存、同步或失效控制时，优先使用项目已有的 React Query 能力。

## Tailwind 与样式

- className 合并优先使用 `cn`，避免手写易冲突的字符串拼接。
- 长 className 不要在多个文件复制粘贴；重复样式应抽组件、抽变量或封装成可复用写法。
- 保持响应式、暗色模式和 hover/focus/disabled 状态一致。
- 图标按钮优先使用 `lucide-react` 已有图标，并提供 `aria-label` 或 `title`。
- 不要让文本、按钮、卡片内容在移动端或窄容器中溢出、重叠或遮挡。

## 提交前检查

修改前端代码后，至少确认以下问题：

- 是否减少了重复，而不是新增重复。
- 是否保持页面、组件、hook、store、api 的职责边界清晰。
- 是否复用了现有 UI 组件、store、api client 和 `lib` 工具。
- 是否给新增组件和 hook 写了明确类型。
- 是否考虑了响应式、暗色模式和可访问性。
- 修改前端代码后运行 `npm run lint`。
- 影响构建、路由、依赖或类型边界时运行 `npm run build`。

---

# GSD 工作流指南

本项目使用 GSD (Get Shit Done) 工作流管理开发和规划。以下指引适用于所有代码修改。

## 项目规划文件

所有规划文档位于 `.planning/` 目录：

| 文件 | 用途 |
|------|------|
| `PROJECT.md` | 项目上下文、核心价值、需求状态、约束和决策记录 |
| `REQUIREMENTS.md` | v1/v2 需求清单，含 REQ-ID 和可追踪性矩阵 |
| `ROADMAP.md` | 9 个 phase 的路线图，含目标、成功标准、需求映射 |
| `STATE.md` | 当前项目状态、phase 进度、阻塞项和风险 |
| `config.json` | 工作流配置（模式、粒度、并行化、agents） |

## 开发节奏

- **Phase 驱动：** 开发按 ROADMAP.md 中的 phase 顺序推进（1 → 2 → ... → 9）
- **需求追踪：** 每个功能实现对应 REQUIREMENTS.md 中的一个 REQ-ID，完成后更新 checkbox
- **Phase 边界：** 每个 phase 完成后更新 STATE.md 和 PROJECT.md 中的需求状态
- **Brownfield 起点：** Phase 1 部分基础设施已实现，开发时复用现有代码，不重复造轮子

## 关键决策

- **设计稿优先：** 所有前端页面必须与 `ui-drafts/` 和 `home-ui-design/` 中的 PNG 设计稿视觉一致
- **技术栈锁定：** React 18 + Vite + NestJS 11 + MongoDB + Redis + Elasticsearch，不改变基础架构
- **API 规范：** 后端全局前缀 `api/v1`，统一响应格式由 TransformInterceptor 处理
- **复用现有：** 修改前先检查 `.planning/codebase/` 中的架构和约定文档

## 参考文档

- 详细设计文档：`docs/superpowers/specs/2026-05-19-blog-design.md`
- Phase 详细计划：`docs/superpowers/plans/sorablog/phase-*.md`
- 代码库映射：`.planning/codebase/`（ARCHITECTURE.md, STACK.md, CONVENTIONS.md 等）

## 下一步

当前 focus：Phase 1 — Infrastructure

执行命令：
- `$gsd-discuss-phase 1` — 讨论 Phase 1 细节
- `$gsd-plan-phase 1` — 制定 Phase 1 计划
- `$gsd-execute-phase 1` — 执行 Phase 1
