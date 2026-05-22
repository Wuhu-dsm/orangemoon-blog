# Debug: Article body not persisted on update

**Reported:** 2026-05-23
**Status:** ✅ Resolved

## Symptom

编辑文章时前端请求体中正确携带了 `body: { blocks: [...] }`，但保存后数据库中不存在该字段。

## Root Cause

**`backend/dist/` 目录中的编译代码与 `src/` 源代码严重不同步。**

`dist/modules/article/schemas/article.schema.js` 仍使用 Phase 1 的旧 schema：
| 旧 schema (dist/) | 新 schema (src/) |
|---|---|
| `content` (Object) | `body` (Object) |
| `cover` (String) | `coverImage` (String) |
| `author` (ObjectId) | **removed** |
| `viewCount` (Number) | **removed** |
| `isPrivate` (Boolean) | **removed** |
| — | `deletedAt` (Date) |
| — | `deletedBy` (String) |

当运行中的服务加载旧 `dist/` 代码时，Mongoose schema 不认识 `body` 字段。前端发送的 `body: { blocks: [...] }` 被 `findByIdAndUpdate` 当作未知字段静默丢弃。

## Fix Applied

```bash
cd backend && npm run build
```

`dist/` 已重新编译，现在包含与 `src/` 一致的 schema 和 service 实现。

## Action Required

**重启后端服务**使新编译代码生效：

- **本地开发（非 Docker）**：`Ctrl+C` 停止后重新运行 `npm run start`
- **Docker 开发模式**：`docker-compose -f docker-compose.dev.yml restart backend`
- **Docker 生产模式**：`docker-compose down && docker-compose up --build -d`

## Verification

1. 打开管理后台 → 文章 → 编辑一篇文章
2. 在编辑器中输入内容（标题、段落、图片等）
3. 点击「保存草稿」
4. 重新打开该文章 → 内容应正常显示
5. （可选）进入 MongoDB shell：`db.articles.findOne({ _id: ObjectId("...") })` → 确认存在 `body.blocks` 数组
