# Phase 5: 笔记系统

> **目标:** 实现笔记看板页、笔记详情页、笔记文集页
> **UI 稿参考:** 04-notes-board.png, 12-note-detail-nextjs-app-router.png, 13-notes-collection-frontend-growth.png
> **前置条件:** Phase 4 完成
> **验收标准:** 笔记卡片多样式渲染、详情页代码高亮、文集展示正常

---

## Task 5.1: 后端 - 笔记模块

**Files:**
- Create: `backend/src/modules/note/note.module.ts`
- Create: `backend/src/modules/note/note.service.ts`
- Create: `backend/src/modules/note/note.controller.ts`
- Create: `backend/src/modules/note/schemas/note.schema.ts`
- Create: `backend/src/modules/note/schemas/note-collection.schema.ts`
- Modify: `backend/src/app.module.ts`

- [ ] **Step 1: NoteSchema**

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type NoteDocument = HydratedDocument<Note>

@Schema({ timestamps: true })
export class Note {
  @Prop({ required: true }) title: string
  @Prop({ required: true, unique: true }) slug: string
  @Prop({ required: true }) content: string
  @Prop({ enum: ['技术笔记', '读书摘录', '灵感', '清单'], default: '技术笔记' }) type: string
  @Prop() coverImage: string
  @Prop([String]) tags: string[]
  @Prop({ type: Types.ObjectId, ref: 'NoteCollection' }) collectionId: Types.ObjectId
  @Prop({ default: false }) isFavorite: boolean
  @Prop({ default: 0 }) likes: number
  @Prop({ default: 0 }) views: number
  @Prop({ enum: ['published', 'draft'], default: 'draft' }) status: string
  @Prop([{ text: String, done: Boolean }]) todoItems: { text: string; done: boolean }[]
  @Prop([{ type: Types.ObjectId, ref: 'Note' }]) relatedNotes: Types.ObjectId[]
  @Prop() publishedAt: Date
}

export const NoteSchema = SchemaFactory.createForClass(Note)
```

- [ ] **Step 2: NoteCollectionSchema**

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type NoteCollectionDocument = HydratedDocument<NoteCollection>

@Schema({ timestamps: true })
export class NoteCollection {
  @Prop({ required: true }) title: string
  @Prop() description: string
  @Prop() coverImage: string
  @Prop() category: string
  @Prop({ default: 0 }) noteCount: number
  @Prop({ default: 0 }) followerCount: number
  @Prop({ default: 0 }) order: number
}

export const NoteCollectionSchema = SchemaFactory.createForClass(NoteCollection)
```

- [ ] **Step 3: NoteService + NoteController**

提供 findAll（支持 type 筛选）、findBySlug、create、update、delete、按 collection 查询。

- [ ] **Step 4: Commit**

```bash
git add backend/src/modules/note/ backend/src/app.module.ts
git commit -m "feat(backend): add note and note-collection modules"
```

---

## Task 5.2: 后端 - 笔记种子数据

**Files:**
- Modify: `backend/src/seed.ts`

- [ ] **Step 1: 添加笔记种子**

```typescript
// 在 seed.ts 中添加
const noteService = app.get(NoteService)

await noteService.create({
  title: 'Next.js 14 App Router 最佳实践小结',
  slug: 'nextjs-14-app-router-best-practices',
  content: '# 内容概要\n\n本文总结了在 Next.js 14 App Router 中的关键实践...',
  type: '技术笔记',
  tags: ['Next.js', 'React'],
  status: 'published',
})

await noteService.create({
  title: '所有的伟大，都源于一个勇敢开始的瞬间',
  slug: 'greatness-begins-with-courage',
  content: '> 所有的伟大，都源于一个勇敢开始的瞬间。\n\n——《深夜的结果》',
  type: '读书摘录',
  status: 'published',
})

await noteService.create({
  title: '周末计划清单',
  slug: 'weekend-plan-checklist',
  content: '',
  type: '清单',
  todoItems: [
    { text: '整理博客文章', done: false },
    { text: '健身 30 分钟', done: false },
    { text: '读书《人间值得》', done: false },
  ],
  status: 'published',
})
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/seed.ts
git commit -m "chore(backend): add note seed data"
```

---

## Task 5.3: 前端 - 笔记看板页

**Files:**
- Create: `frontend/src/pages/Notes/Notes.tsx`
- Create: `frontend/src/pages/Notes/components/NoteCard.tsx`
- Create: `frontend/src/pages/Notes/components/NoteFilter.tsx`
- Create: `frontend/src/api/notes.ts`

**UI 参考:** 04-notes-board.png（笔记类型筛选、多样式卡片网格、右侧统计面板）

- [ ] **Step 1: Notes API**

```typescript
import { apiClient } from './client'
export const notesApi = {
  getList: (params?: any) => apiClient.get('/notes', { params }),
  getBySlug: (slug: string) => apiClient.get(`/notes/${slug}`),
  getCollections: () => apiClient.get('/note-collections'),
}
```

- [ ] **Step 2: NoteCard（多样式）**

```tsx
import { Link } from 'react-router-dom'
import { Heart, Eye } from 'lucide-react'

export default function NoteCard({ note }: { note: any }) {
  // 根据笔记类型渲染不同样式
  if (note.type === '读书摘录') {
    return (
      <Link to={`/notes/${note.slug}`} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
        <div className="text-4xl text-primary-500 mb-4">"</div>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{note.content.replace(/^>\s*/, '')}</p>
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>{new Date(note.createdAt).toLocaleDateString()}</span>
          <span className="flex items-center gap-1"><Heart size={14} /> {note.likes}</span>
        </div>
      </Link>
    )
  }

  if (note.type === '清单') {
    return (
      <Link to={`/notes/${note.slug}`} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">清单</span>
          <h3 className="font-semibold">{note.title}</h3>
        </div>
        <div className="space-y-2">
          {note.todoItems?.map((item: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <input type="checkbox" checked={item.done} readOnly className="rounded" />
              <span className={`text-sm ${item.done ? 'line-through text-gray-400' : ''}`}>{item.text}</span>
            </div>
          ))}
        </div>
      </Link>
    )
  }

  // 默认：技术笔记 / 灵感
  return (
    <Link to={`/notes/${note.slug}`} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      {note.coverImage && (
        <div className="aspect-video">
          <img src={note.coverImage} alt={note.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-1 rounded text-xs ${
            note.type === '技术笔记' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}>{note.type}</span>
        </div>
        <h3 className="font-semibold mb-2">{note.title}</h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-3">{note.content?.substring(0, 100)}...</p>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1"><Eye size={14} /> {note.views}</span>
          <span className="flex items-center gap-1"><Heart size={14} /> {note.likes}</span>
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 3: Notes 页面**

```tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { notesApi } from '../../api/notes'
import NoteCard from './components/NoteCard'

const noteTypes = ['全部', '技术笔记', '读书摘录', '灵感', '清单']

export default function Notes() {
  const [activeType, setActiveType] = useState('全部')
  const { data } = useQuery({
    queryKey: ['notes', activeType],
    queryFn: () => notesApi.getList({ type: activeType === '全部' ? undefined : activeType }),
  })

  const notes = (data as any)?.data?.items || []

  return (
    <div className="grid grid-cols-4 gap-6">
      <div className="col-span-3">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
            我的笔记 <span className="text-primary-500">🌿</span>
          </h1>
          <p className="text-gray-500">记录灵感，沉淀知识，构建属于自己的知识花园</p>
        </div>

        <div className="flex gap-2 mb-6">
          {noteTypes.map((type) => (
            <button key={type} onClick={() => setActiveType(type)}
              className={`px-4 py-2 rounded-full text-sm ${
                activeType === type ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600'
              }`}>
              {type} {type === '全部' ? '128' : ''}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {notes.map((note: any) => <NoteCard key={note._id} note={note} />)}
        </div>
      </div>

      <div className="space-y-6">
        {/* 笔记统计 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold mb-4">笔记统计</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">128</div>
              <div className="text-xs text-gray-500">笔记总数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">56</div>
              <div className="text-xs text-gray-500">技术笔记</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/Notes/ frontend/src/api/notes.ts
git commit -m "feat(frontend): add notes board with multi-type cards"
```

---

## Task 5.4: 前端 - 笔记详情页

**Files:**
- Create: `frontend/src/pages/NoteDetail/NoteDetail.tsx`

**UI 参考:** 12-note-detail-nextjs-app-router.png（类型标签、标题、内容概要、核心收获、代码块、关联笔记图谱）

- [ ] **Step 1: NoteDetail**

```tsx
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { notesApi } from '../../api/notes'

export default function NoteDetail() {
  const { slug } = useParams()
  const { data, isLoading } = useQuery({ queryKey: ['note', slug], queryFn: () => notesApi.getBySlug(slug!) })
  const note = (data as any)?.data

  if (isLoading) return <div>加载中...</div>
  if (!note) return <div>笔记不存在</div>

  return (
    <div className="grid grid-cols-4 gap-6">
      <div className="col-span-3">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm ${
              note.type === '技术笔记' ? 'bg-green-100 text-green-700' :
              note.type === '读书摘录' ? 'bg-blue-100 text-blue-700' :
              note.type === '灵感' ? 'bg-yellow-100 text-yellow-700' :
              'bg-purple-100 text-purple-700'
            }`}>{note.type}</span>
            {note.tags?.map((tag: string) => (
              <span key={tag} className="px-2 py-1 bg-gray-100 rounded text-xs">{tag}</span>
            ))}
          </div>

          <h1 className="text-3xl font-bold mb-4">{note.title}</h1>

          {/* 内容概要 */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
            <h3 className="font-semibold mb-2">📋 内容概要</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">本文总结了在 Next.js 14 App Router 中的关键实践...</p>
          </div>

          {/* 核心收获 */}
          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-primary-700 mb-2">💡 核心收获</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">✅ 掌握 App Router 的项目结构与约定</li>
              <li className="flex items-center gap-2">✅ 高效的数据获取与缓存策略</li>
              <li className="flex items-center gap-2">✅ 合理使用 Server Component 与 Client Component</li>
            </ul>
          </div>

          {/* 正文 */}
          <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: note.content }} />
        </div>
      </div>

      <aside className="col-span-1 space-y-6">
        {/* 笔记数据 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold mb-4">笔记数据</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div><div className="text-lg font-bold">1.2k</div><div className="text-xs text-gray-500">浏览</div></div>
            <div><div className="text-lg font-bold">189</div><div className="text-xs text-gray-500">点赞</div></div>
          </div>
        </div>

        {/* 分类标签 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold mb-4">分类标签</h3>
          <div className="flex flex-wrap gap-2">
            {note.tags?.map((tag: string) => (
              <span key={tag} className="px-2 py-1 bg-gray-100 rounded text-xs">{tag}</span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/NoteDetail/
git commit -m "feat(frontend): add note detail page"
```

---

## Task 5.5: 前端 - 笔记文集页

**Files:**
- Create: `frontend/src/pages/NoteCollection/NoteCollection.tsx`

**UI 参考:** 13-notes-collection-frontend-growth.png（文集头图、分类章节、笔记列表网格）

- [ ] **Step 1: NoteCollection**

```tsx
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { notesApi } from '../../api/notes'

const chapters = [
  { title: '基础 · 夯实根基', description: '打好基础，才能走得更远', notes: 4 },
  { title: '工程化 · 提效利器', description: '工具创造效率，规范保障质量', notes: 4 },
  { title: '框架 · 构建应用', description: '掌握主流框架，构建高质量应用', notes: 4 },
  { title: '性能优化 · 极致体验', description: '让页面更快，让体验更好', notes: 4 },
]

export default function NoteCollectionPage() {
  const { id } = useParams()

  return (
    <div>
      {/* 文集头图 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-6 relative overflow-hidden">
        <div className="flex items-center gap-4 mb-4">
          <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">公开文集</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">前端成长之路 <span className="text-yellow-500">⭐</span></h1>
        <p className="text-gray-500 mb-6">从基础到进阶，记录我的前端学习、踩坑与思考。</p>
        <div className="flex gap-6 text-sm">
          <div><span className="font-semibold">128</span> <span className="text-gray-500">笔记总数</span></div>
          <div><span className="font-semibold">2024/06/10</span> <span className="text-gray-500">最近更新</span></div>
          <div><span className="font-semibold">2.6k</span> <span className="text-gray-500">收藏数</span></div>
        </div>
      </div>

      {/* 章节列表 */}
      <div className="space-y-8">
        {chapters.map((chapter, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold">{chapter.title}</h2>
                <p className="text-sm text-gray-500">{chapter.description}</p>
              </div>
              <a href="#" className="text-sm text-primary-500">查看全部 {chapter.notes} 篇 →</a>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {/* 占位笔记卡片 */}
              {Array.from({ length: chapter.notes }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="w-full h-24 bg-gray-100 rounded-lg mb-3" />
                  <h3 className="font-medium text-sm mb-1">笔记标题 {i + 1}</h3>
                  <p className="text-xs text-gray-500">2024/05/18</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/NoteCollection/
git commit -m "feat(frontend): add note collection page"
```

---

## Task 5.6: Phase 5 验收

- [ ] **Step 1: 验证笔记看板**

```bash
# 打开 http://localhost:5173/notes
# 检查: 四种笔记类型筛选
# 检查: 读书摘录卡片显示引用样式
# 检查: 清单卡片显示复选框
```

- [ ] **Step 2: 验证笔记详情**

```bash
# 点击笔记卡片
# 检查: 内容概要和核心收获区域
# 检查: 代码块渲染
```

- [ ] **Step 3: UI 对照检查**

对照 04-notes-board.png、12-note-detail-nextjs-app-router.png、13-notes-collection-frontend-growth.png：
- [ ] 笔记卡片多样式
- [ ] 右侧统计面板
- [ ] 文集章节布局

- [ ] **Step 4: Commit**

```bash
git commit --allow-empty -m "checkpoint: phase 5 note system complete"
```
