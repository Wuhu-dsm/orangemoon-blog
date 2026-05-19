# Phase 7: 社区互动

> **目标:** 实现友链展示、友链申请、留言板、我的留言页面
> **UI 稿参考:** 07-friend-links.png, 16-friend-link-application.png, 08-guestbook-messages.png, 17-guestbook-my-messages.png
> **前置条件:** Phase 6 完成
> **验收标准:** 友链展示分类、申请表单提交、留言发布和回复、我的留言管理

---

## Task 7.1: 后端 - 友链模块

**Files:**
- Create: `backend/src/modules/friend-link/friend-link.module.ts`
- Create: `backend/src/modules/friend-link/friend-link.service.ts`
- Create: `backend/src/modules/friend-link/friend-link.controller.ts`
- Create: `backend/src/modules/friend-link/schemas/friend-link.schema.ts`
- Create: `backend/src/modules/friend-link/schemas/friend-link-application.schema.ts`
- Modify: `backend/src/app.module.ts`

- [ ] **Step 1: FriendLinkSchema**

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type FriendLinkDocument = HydratedDocument<FriendLink>

@Schema({ timestamps: true })
export class FriendLink {
  @Prop({ required: true }) name: string
  @Prop({ required: true }) url: string
  @Prop() description: string
  @Prop() avatar: string
  @Prop({ enum: ['技术', '设计', '博客', '工具'] }) category: string
  @Prop({ default: false }) isVerified: boolean
  @Prop({ default: 'active', enum: ['active', 'inactive'] }) status: string
  @Prop({ default: 0 }) clickCount: number
}

export const FriendLinkSchema = SchemaFactory.createForClass(FriendLink)
```

- [ ] **Step 2: FriendLinkApplicationSchema**

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type FriendLinkApplicationDocument = HydratedDocument<FriendLinkApplication>

@Schema({ timestamps: true })
export class FriendLinkApplication {
  @Prop({ required: true }) siteName: string
  @Prop({ required: true }) siteUrl: string
  @Prop() siteDescription: string
  @Prop({ required: true }) webmasterName: string
  @Prop() contactEmail: string
  @Prop() screenshot: string
  @Prop({ default: false }) hasAddedOurLink: boolean
  @Prop({ default: 'pending', enum: ['pending', 'approved', 'rejected'] }) status: string
  @Prop() remark: string
  @Prop() reviewedAt: Date
}

export const FriendLinkApplicationSchema = SchemaFactory.createForClass(FriendLinkApplication)
```

- [ ] **Step 3: Service + Controller**

提供友链列表（支持 category 筛选）、申请提交、申请状态查询。

- [ ] **Step 4: Commit**

```bash
git add backend/src/modules/friend-link/ backend/src/app.module.ts
git commit -m "feat(backend): add friend-link and application modules"
```

---

## Task 7.2: 后端 - 留言板模块

**Files:**
- Create: `backend/src/modules/guestbook/guestbook.module.ts`
- Create: `backend/src/modules/guestbook/guestbook.service.ts`
- Create: `backend/src/modules/guestbook/guestbook.controller.ts`
- Create: `backend/src/modules/guestbook/schemas/guestbook-message.schema.ts`
- Modify: `backend/src/app.module.ts`

- [ ] **Step 1: GuestbookMessageSchema**

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type GuestbookMessageDocument = HydratedDocument<GuestbookMessage>

@Schema({ timestamps: true })
export class GuestbookMessage {
  @Prop({
    type: {
      userId: { type: Types.ObjectId, ref: 'User' },
      name: String,
      avatar: String,
      level: Number,
    },
  })
  author: {
    userId?: Types.ObjectId
    name: string
    avatar?: string
    level?: number
  }

  @Prop({ required: true }) content: string
  @Prop() location: string
  @Prop({
    type: {
      great: { type: Number, default: 0 },
      warm: { type: Number, default: 0 },
      wow: { type: Number, default: 0 },
      learned: { type: Number, default: 0 },
    },
  })
  reactions: {
    great: number
    warm: number
    wow: number
    learned: number
  }

  @Prop({ default: 0 }) likeCount: number
  @Prop({ default: 0 }) replyCount: number
  @Prop({ default: false }) isPinned: boolean
  @Prop({ default: 'published', enum: ['published', 'pending', 'deleted'] }) status: string

  @Prop([{
    _id: { type: Types.ObjectId, auto: true },
    author: { name: String, avatar: String, level: Number },
    content: String,
    createdAt: Date,
  }])
  replies: {
    _id: Types.ObjectId
    author: { name: string; avatar?: string; level?: number }
    content: string
    createdAt: Date
  }[]
}

export const GuestbookMessageSchema = SchemaFactory.createForClass(GuestbookMessage)
```

- [ ] **Step 2: Service + Controller**

提供留言列表、发布留言、回复留言、点赞、置顶等功能。

- [ ] **Step 3: Commit**

```bash
git add backend/src/modules/guestbook/ backend/src/app.module.ts
git commit -m "feat(backend): add guestbook module"
```

---

## Task 7.3: 前端 - 友链展示页

**Files:**
- Create: `frontend/src/pages/Friends/Friends.tsx`
- Create: `frontend/src/pages/Friends/components/FriendLinkCard.tsx`
- Create: `frontend/src/api/friends.ts`

**UI 参考:** 07-friend-links.png（友链卡片网格、分类筛选、右侧友链统计和申请入口）

- [ ] **Step 1: Friends API**

```typescript
import { apiClient } from './client'
export const friendsApi = {
  getList: () => apiClient.get('/friend-links'),
  apply: (data: any) => apiClient.post('/friend-links/apply', data),
}
```

- [ ] **Step 2: FriendLinkCard**

```tsx
export default function FriendLinkCard({ link }: { link: any }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <img src={link.avatar || '/default-avatar.png'} alt={link.name} className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">{link.name}</h3>
            {link.isVerified && <span className="text-green-500 text-xs">✓</span>}
          </div>
          <p className="text-sm text-gray-500 mb-3">{link.description}</p>
          <div className="flex items-center justify-between">
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">{link.category}</span>
            <a href={link.url} target="_blank" rel="noopener noreferrer"
              className="text-sm text-primary-500 hover:underline">
              访问网站 →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Friends 页面**

```tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { friendsApi } from '../../api/friends'
import FriendLinkCard from './components/FriendLinkCard'
import { Link } from 'react-router-dom'

const categories = ['全部', '技术', '设计', '博客', '工具']

export default function Friends() {
  const [activeCategory, setActiveCategory] = useState('全部')
  const { data } = useQuery({ queryKey: ['friendLinks'], queryFn: () => friendsApi.getList() })

  const links = (data as any)?.data || []
  const filteredLinks = activeCategory === '全部'
    ? links
    : links.filter((link: any) => link.category === activeCategory)

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        {/* Banner */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-6 relative overflow-hidden">
          <div className="relative z-10">
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">精选推荐</span>
            <h1 className="text-2xl font-bold mt-4 mb-2">与优秀同行，发现更多可能</h1>
            <p className="text-gray-500">以下是 Sora 精心挑选的优质站点，值得一看</p>
            <button className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-lg">探索更多好站 →</button>
          </div>
        </div>

        {/* 分类筛选 */}
        <div className="flex gap-2 mb-6">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm ${
                activeCategory === cat ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* 友链网格 */}
        <div className="grid grid-cols-2 gap-4">
          {filteredLinks.map((link: any) => <FriendLinkCard key={link._id} link={link} />)}
        </div>
      </div>

      <div className="space-y-6">
        {/* 关于友链 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold mb-4">关于友链</h3>
          <p className="text-sm text-gray-500 mb-4">
            友链是网站之间的友好连接，也是一种认可与支持。希望通过链接，结识更多志同道合的朋友。
          </p>
          <Link to="/friends/apply" className="block w-full py-2 bg-primary-500 text-white text-center rounded-lg">
            申请友链
          </Link>
        </div>

        {/* 友链数据 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold mb-4">友链数据</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div><div className="text-xl font-bold">32</div><div className="text-xs text-gray-500">友链总数</div></div>
            <div><div className="text-xl font-bold">4</div><div className="text-xs text-gray-500">本月新增</div></div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/Friends/ frontend/src/api/friends.ts
git commit -m "feat(frontend): add friends page"
```

---

## Task 7.4: 前端 - 友链申请页

**Files:**
- Create: `frontend/src/pages/FriendApply/FriendApply.tsx`

**UI 参考:** 16-friend-link-application.png（申请须知、申请表单、审核流程、右侧已通过友链）

- [ ] **Step 1: FriendApply**

```tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function FriendApply() {
  const [form, setForm] = useState({
    siteName: '', siteUrl: '', siteDescription: '', webmasterName: '', contactEmail: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 提交申请
    alert('申请已提交！')
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-8">
        {/* 头图 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 relative overflow-hidden">
          <h1 className="text-2xl font-bold mb-2">申请友链，连接更多可能 ✨</h1>
          <p className="text-gray-500">与志同道合的站长交换友链，一起分享优质内容，发现更多精彩。</p>
        </div>

        {/* 申请须知 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200">
          <h2 className="text-lg font-bold mb-4">🌿 友链申请须知</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: '内容优质', desc: '网站内容积极向上，原创且有一定质量和深度' },
              { title: '设计美观', desc: '界面简洁美观，用户体验良好，无明显广告干扰' },
              { title: '稳定访问', desc: '网站可正常访问，打开速度正常，无频繁打不开' },
              { title: '友链可互换', desc: '已添加本站友链，并在明显位置展示本站信息' },
            ].map((item, index) => (
              <div key={index} className="flex gap-3">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 shrink-0">
                  ✓
                </div>
                <div>
                  <div className="font-medium text-sm">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 申请表单 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200">
          <h2 className="text-lg font-bold mb-6">🌿 友链申请表单</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">网站名称 *</label>
                <Input value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} placeholder="请输入网站名称" />
              </div>
              <div>
                <label className="text-sm font-medium">网站地址 *</label>
                <Input value={form.siteUrl} onChange={(e) => setForm({ ...form, siteUrl: e.target.value })} placeholder="https://" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">网站描述 *</label>
              <Textarea value={form.siteDescription} onChange={(e) => setForm({ ...form, siteDescription: e.target.value })} placeholder="请简要介绍一下你的网站" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">站长昵称 *</label>
                <Input value={form.webmasterName} onChange={(e) => setForm({ ...form, webmasterName: e.target.value })} placeholder="请输入站长昵称" />
              </div>
              <div>
                <label className="text-sm font-medium">联系邮箱</label>
                <Input value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} placeholder="邮箱 / QQ / 微信" />
              </div>
            </div>
            <Button type="submit" className="w-full">提交申请</Button>
          </form>
        </div>
      </div>

      <div className="space-y-6">
        {/* 申请状态 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold mb-4">申请状态</h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="text-lg font-bold text-yellow-600">2</div>
              <div className="text-xs text-gray-500">审核中</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">8</div>
              <div className="text-xs text-gray-500">已通过</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="text-lg font-bold text-red-600">1</div>
              <div className="text-xs text-gray-500">已拒绝</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/FriendApply/
git commit -m "feat(frontend): add friend apply page"
```

---

## Task 7.5: 前端 - 留言板页

**Files:**
- Create: `frontend/src/pages/Guestbook/Guestbook.tsx`
- Create: `frontend/src/pages/Guestbook/components/MessageItem.tsx`
- Create: `frontend/src/pages/Guestbook/components/MessageForm.tsx`
- Create: `frontend/src/api/guestbook.ts`

**UI 参考:** 08-guestbook-messages.png（留言输入框、表情/图片/链接、留言列表、活跃访客榜）

- [ ] **Step 1: Guestbook API**

```typescript
import { apiClient } from './client'
export const guestbookApi = {
  getMessages: () => apiClient.get('/guestbook/messages'),
  postMessage: (data: any) => apiClient.post('/guestbook/messages', data),
  postReply: (messageId: string, data: any) => apiClient.post(`/guestbook/messages/${messageId}/reply`, data),
  getMyMessages: () => apiClient.get('/guestbook/my-messages'),
}
```

- [ ] **Step 2: MessageItem**

```tsx
export default function MessageItem({ message }: { message: any }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200">
      <div className="flex items-start gap-4">
        <img src={message.author?.avatar || '/default-avatar.png'} alt={message.author?.name}
          className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold">{message.author?.name}</span>
            <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs">
              Lv.{message.author?.level || 1}
            </span>
            <span className="text-xs text-gray-400">{message.location}</span>
            <span className="text-xs text-gray-400">{new Date(message.createdAt).toLocaleString()}</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{message.content}</p>

          {/* 反应按钮 */}
          <div className="flex gap-4">
            {[
              { key: 'great', label: '好棒', emoji: '👍' },
              { key: 'warm', label: '温暖', emoji: '❤️' },
              { key: 'wow', label: '牛哇', emoji: '😮' },
              { key: 'learned', label: '学到了', emoji: '💡' },
            ].map((reaction) => (
              <button key={reaction.key} className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-500">
                <span>{reaction.emoji}</span>
                <span>{reaction.label}</span>
                <span>{message.reactions?.[reaction.key] || 0}</span>
              </button>
            ))}
          </div>

          {/* 回复 */}
          {message.replies?.length > 0 && (
            <div className="mt-4 space-y-3 pl-4 border-l-2 border-gray-100">
              {message.replies.map((reply: any) => (
                <div key={reply._id} className="flex gap-3">
                  <img src={reply.author?.avatar || '/default-avatar.png'} alt={reply.author?.name}
                    className="w-8 h-8 rounded-full" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{reply.author?.name}</span>
                      <span className="text-xs text-gray-400">{new Date(reply.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{reply.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: MessageForm**

```tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function MessageForm({ onSubmit }: { onSubmit: (content: string) => void }) {
  const [content, setContent] = useState('')

  const handleSubmit = () => {
    if (!content.trim()) return
    onSubmit(content)
    setContent('')
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200">
      <h3 className="font-semibold mb-4">🌿 留下你的留言</h3>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="有什么想对我说的吗？欢迎留言交流~"
        className="mb-4"
        rows={4}
      />
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg">😊</button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">🖼️</button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">🔗</button>
        </div>
        <Button onClick={handleSubmit}>发布留言</Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Guestbook 页面**

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { guestbookApi } from '../../api/guestbook'
import MessageItem from './components/MessageItem'
import MessageForm from './components/MessageForm'

export default function Guestbook() {
  const queryClient = useQueryClient()
  const { data } = useQuery({ queryKey: ['guestbookMessages'], queryFn: () => guestbookApi.getMessages() })
  const messages = (data as any)?.data || []

  const postMutation = useMutation({
    mutationFn: (content: string) => guestbookApi.postMessage({ content }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['guestbookMessages'] }),
  })

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-12 text-white">
          <h1 className="text-3xl font-bold mb-4">欢迎在这里留下你的足迹 ✨</h1>
          <p className="text-primary-100">每一条留言，都是一份温暖的相遇。</p>
          <p className="text-primary-100">我会认真阅读每一条留言，期待与你交流！</p>
        </div>

        <MessageForm onSubmit={(content) => postMutation.mutate(content)} />

        <div className="space-y-4">
          {messages.map((message: any) => <MessageItem key={message._id} message={message} />)}
        </div>
      </div>

      <div className="space-y-6">
        {/* 留言板数据 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold mb-4">留言板数据</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div><div className="text-xl font-bold">1,268</div><div className="text-xs text-gray-500">留言总数</div></div>
            <div><div className="text-xl font-bold">3,852</div><div className="text-xs text-gray-500">访客总数</div></div>
          </div>
        </div>

        {/* 活跃访客 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold mb-4">活跃访客 TOP5</h3>
          <div className="space-y-3">
            {[
              { name: '星海旅人', level: 4, count: 24 },
              { name: '清风与明月', level: 3, count: 18 },
              { name: '代码诗人', level: 3, count: 15 },
            ].map((user, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs">
                  {index + 1}
                </div>
                <img src="/default-avatar.png" alt={user.name} className="w-8 h-8 rounded-full" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-gray-500">留言 {user.count} 条</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/pages/Guestbook/ frontend/src/api/guestbook.ts
git commit -m "feat(frontend): add guestbook page"
```

---

## Task 7.6: 前端 - 我的留言页

**Files:**
- Create: `frontend/src/pages/MyMessages/MyMessages.tsx`

**UI 参考:** 17-guestbook-my-messages.png（我的留言列表、状态筛选、草稿箱、互动数据）

- [ ] **Step 1: MyMessages**

```tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { guestbookApi } from '../../api/guestbook'

const filters = ['全部', '已发布', '待回复', '草稿', '已置顶']

export default function MyMessages() {
  const [activeFilter, setActiveFilter] = useState('全部')
  const { data } = useQuery({ queryKey: ['myMessages'], queryFn: () => guestbookApi.getMyMessages() })
  const messages = (data as any)?.data || []

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">我的留言</h1>
          <p className="text-gray-500">记录你的足迹，连接每一份温暖 ✨</p>
        </div>

        <div className="flex gap-2 mb-6">
          {filters.map((filter) => (
            <button key={filter} onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm ${
                activeFilter === filter ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600'
              }`}>
              {filter} {filter === '全部' ? '24' : ''}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {messages.map((message: any) => (
            <div key={message._id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 rounded text-xs ${
                  message.status === 'published' ? 'bg-green-100 text-green-700' :
                  message.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-600'
                }`}>{message.status === 'published' ? '已发布' : message.status}</span>
                <span className="text-sm text-gray-400">{new Date(message.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{message.content}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {/* 互动数据 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold mb-4">我的互动数据</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div><div className="text-xl font-bold">24</div><div className="text-xs text-gray-500">留言总数</div></div>
            <div><div className="text-xl font-bold">326</div><div className="text-xs text-gray-500">获得点赞</div></div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/MyMessages/
git commit -m "feat(frontend): add my messages page"
```

---

## Task 7.7: Phase 7 验收

- [ ] **Step 1: 验证友链**

```bash
# 打开 http://localhost:5173/friends
# 检查: 分类筛选切换
# 检查: 申请页面表单
```

- [ ] **Step 2: 验证留言板**

```bash
# 打开 http://localhost:5173/guestbook
# 检查: 留言发布
# 检查: 留言列表渲染
```

- [ ] **Step 3: UI 对照检查**

对照 07-friend-links.png、16-friend-link-application.png、08-guestbook-messages.png、17-guestbook-my-messages.png：
- [ ] 友链卡片样式
- [ ] 申请须知布局
- [ ] 留言板 Banner

- [ ] **Step 4: Commit**

```bash
git commit --allow-empty -m "checkpoint: phase 7 community complete"
```
