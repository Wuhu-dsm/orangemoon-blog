# Phase 3: 文章系统

> **目标:** 实现文章列表页、文章详情页、标签归档页
> **UI 稿参考:** 02-articles-list.png, 09-article-detail-nextjs-rebuild.png, 10-tag-nextjs-archive.png
> **前置条件:** Phase 2 完成
> **验收标准:** 文章列表可筛选/排序、详情页渲染完整、标签归档正常

---

## Task 3.1: 后端 - 文章列表增强（筛选/排序/分页）

**Files:**
- Modify: `backend/src/modules/article/article.service.ts`
- Modify: `backend/src/modules/article/article.controller.ts`

- [ ] **Step 1: 增强 findAll 方法**

```typescript
async findAll(query: any = {}): Promise<{ items: ArticleDocument[]; total: number }> {
  const filter: any = { status: 'published' }
  if (query.category) filter.category = query.category
  if (query.tag) filter.tags = { $in: [query.tag] }

  const page = parseInt(query.page) || 1
  const limit = parseInt(query.limit) || 10
  const skip = (page - 1) * limit

  let sort: any = { isPinned: -1 }
  if (query.sort === 'views') sort = { ...sort, views: -1 }
  else if (query.sort === 'likes') sort = { ...sort, likes: -1 }
  else sort = { ...sort, publishedAt: -1 }

  const [items, total] = await Promise.all([
    this.articleModel.find(filter).sort(sort).skip(skip).limit(limit).populate('author', 'username avatar').exec(),
    this.articleModel.countDocuments(filter),
  ])

  return { items, total }
}
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/modules/article/article.service.ts
git commit -m "feat(backend): enhance article list with pagination and sorting"
```

---

## Task 3.2: 后端 - 标签归档 API

**Files:**
- Modify: `backend/src/modules/tag/tag.controller.ts`
- Modify: `backend/src/modules/tag/tag.service.ts`

- [ ] **Step 1: 标签详情 + 关联文章**

```typescript
// tag.service.ts
async findBySlugWithArticles(slug: string): Promise<{ tag: TagDocument | null; articles: any[] }> {
  const tag = await this.tagModel.findOne({ slug }).exec()
  if (!tag) return { tag: null, articles: [] }
  const articles = await this.articleModel.find({ tags: tag.name, status: 'published' }).sort({ publishedAt: -1 }).exec()
  return { tag, articles }
}
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/modules/tag/tag.service.ts backend/src/modules/tag/tag.controller.ts
git commit -m "feat(backend): add tag archive with articles"
```

---

## Task 3.3: 前端 - 文章列表页

**Files:**
- Create: `frontend/src/pages/Articles/Articles.tsx`
- Create: `frontend/src/pages/Articles/components/ArticleFilter.tsx`
- Create: `frontend/src/pages/Articles/components/ArticleListView.tsx`

**UI 参考:** 02-articles-list.png（分类筛选标签、排序下拉框、视图切换、文章卡片列表）

- [ ] **Step 1: Articles 页面**

```tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { articlesApi } from '../../api/articles'
import ArticleCard from '../../components/common/ArticleCard'
import ArticleFilter from './components/ArticleFilter'

const categories = ['全部', '技术', '生活', '思考', '设计', '旅行', '随笔']

export default function Articles() {
  const [activeCategory, setActiveCategory] = useState('全部')
  const [sortBy, setSortBy] = useState('latest')
  const { data, isLoading } = useQuery({
    queryKey: ['articles', activeCategory, sortBy],
    queryFn: () => articlesApi.getList({
      category: activeCategory === '全部' ? undefined : activeCategory,
      sort: sortBy,
      limit: 12,
    }),
  })

  const articles = (data as any)?.data?.items || []

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          文章 <span className="text-primary-500 text-lg">✦</span>
        </h1>
        <p className="text-gray-500">记录灵感，分享思考，让文字成为连接世界的桥梁。</p>
      </div>

      <ArticleFilter
        categories={categories}
        active={activeCategory}
        onChange={setActiveCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {isLoading ? (
        <div className="text-center py-12">加载中...</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mt-6">
          {articles.map((article: any) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: ArticleFilter**

```tsx
interface ArticleFilterProps {
  categories: string[]
  active: string
  onChange: (category: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
}

export default function ArticleFilter({ categories, active, onChange, sortBy, onSortChange }: ArticleFilterProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        {categories.map((cat) => (
          <button key={cat} onClick={() => onChange(cat)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              active === cat
                ? 'bg-primary-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 hover:bg-gray-100'
            }`}>
            {cat} {cat === '全部' ? '56' : ''}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg text-sm border border-gray-200">
          <option value="latest">最新发布</option>
          <option value="views">最多阅读</option>
          <option value="likes">最多点赞</option>
        </select>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/Articles/
git commit -m "feat(frontend): add articles list page with filter"
```

---

## Task 3.4: 前端 - 文章详情页

**Files:**
- Create: `frontend/src/pages/ArticleDetail/ArticleDetail.tsx`
- Create: `frontend/src/pages/ArticleDetail/components/ArticleToc.tsx`
- Create: `frontend/src/pages/ArticleDetail/components/ArticleMeta.tsx`

**UI 参考:** 09-article-detail-nextjs-rebuild.png（面包屑、标题、封面图、作者信息、文章内容、右侧目录、相关标签）

- [ ] **Step 1: ArticleDetail**

```tsx
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { articlesApi } from '../../api/articles'
import ArticleMeta from './components/ArticleMeta'
import ArticleToc from './components/ArticleToc'

export default function ArticleDetail() {
  const { slug } = useParams()
  const { data, isLoading } = useQuery({ queryKey: ['article', slug], queryFn: () => articlesApi.getBySlug(slug!) })
  const article = (data as any)?.data

  if (isLoading) return <div className="text-center py-12">加载中...</div>
  if (!article) return <div className="text-center py-12">文章不存在</div>

  return (
    <div className="grid grid-cols-4 gap-6">
      <article className="col-span-3">
        {/* 面包屑 */}
        <nav className="text-sm text-gray-500 mb-4">
          <a href="/" className="hover:text-primary-500">首页</a>
          <span className="mx-2">/</span>
          <a href="/articles" className="hover:text-primary-500">文章</a>
          <span className="mx-2">/</span>
          <span>{article.title}</span>
        </nav>

        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        <p className="text-gray-500 mb-4">{article.summary}</p>

        <ArticleMeta article={article} />

        {article.coverImage && (
          <img src={article.coverImage} alt={article.title} className="w-full rounded-xl mb-6" />
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl p-8">
          <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      </article>

      <aside className="col-span-1">
        <div className="sticky top-6 space-y-6">
          <ArticleToc content={article.content} />

          {/* 相关标签 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold mb-4">相关标签</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags?.map((tag: string) => (
                <a key={tag} href={`/articles/tags/${tag}`}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm hover:bg-primary-100 hover:text-primary-700">
                  {tag}
                </a>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
```

- [ ] **Step 2: ArticleMeta**

```tsx
import { Clock, Eye, Heart } from 'lucide-react'

export default function ArticleMeta({ article }: { article: any }) {
  return (
    <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
      <div className="flex items-center gap-2">
        <img src={article.author?.avatar || '/default-avatar.png'} alt={article.author?.username} className="w-8 h-8 rounded-full" />
        <span>{article.author?.username}</span>
      </div>
      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
      <span className="flex items-center gap-1"><Clock size={14} /> 阅读约 {article.readTime || 12} 分钟</span>
      <span className="flex items-center gap-1"><Eye size={14} /> {article.views}</span>
      <span className="flex items-center gap-1"><Heart size={14} /> {article.likes}</span>
    </div>
  )
}
```

- [ ] **Step 3: ArticleToc**

```tsx
import { useEffect, useState } from 'react'

export default function ArticleToc({ content }: { content: string }) {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([])

  useEffect(() => {
    // 从 HTML 内容中提取标题
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const hElements = doc.querySelectorAll('h1, h2, h3')
    const items = Array.from(hElements).map((el, i) => ({
      id: `heading-${i}`,
      text: el.textContent || '',
      level: parseInt(el.tagName[1]),
    }))
    setHeadings(items)
  }, [content])

  if (headings.length === 0) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200">
      <h3 className="font-semibold mb-4">文章目录</h3>
      <nav className="space-y-2">
        {headings.map((heading) => (
          <a key={heading.id} href={`#${heading.id}`}
            className={`block text-sm hover:text-primary-500 ${
              heading.level === 1 ? 'font-medium' : heading.level === 2 ? 'pl-3' : 'pl-6'
            }`}>
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/ArticleDetail/
git commit -m "feat(frontend): add article detail page with toc"
```

---

## Task 3.5: 前端 - 标签归档页

**Files:**
- Create: `frontend/src/pages/TagArchive/TagArchive.tsx`

**UI 参考:** 10-tag-nextjs-archive.png（标签头图、文章数量统计、子分类筛选、文章列表、右侧相关标签和热门文章）

- [ ] **Step 1: TagArchive**

```tsx
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { tagsApi } from '../../api/tags'
import { articlesApi } from '../../api/articles'
import ArticleCard from '../../components/common/ArticleCard'

export default function TagArchive() {
  const { tag } = useParams()
  const { data: tagData } = useQuery({ queryKey: ['tag', tag], queryFn: () => tagsApi.getBySlug(tag!) })
  const { data: articlesData } = useQuery({ queryKey: ['tagArticles', tag], queryFn: () => articlesApi.getList({ tag, limit: 20 }) })

  const tagInfo = (tagData as any)?.data
  const articles = (articlesData as any)?.data?.items || []

  return (
    <div>
      {/* 标签头图区域 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-6 flex items-center gap-6">
        <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
          {tag?.[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-bold">#{tag}</h1>
          <p className="text-gray-500 mt-2">收录与 {tag} 相关的文章、实践与心得</p>
          <div className="flex gap-6 mt-4 text-sm">
            <div><span className="font-semibold">{articles.length}</span> <span className="text-gray-500">篇文章</span></div>
            <div><span className="font-semibold">12.4k</span> <span className="text-gray-500">次阅读</span></div>
          </div>
        </div>
      </div>

      {/* 子分类筛选 */}
      <div className="flex gap-2 mb-6">
        {['全部', '教程', '性能优化', '架构', '经验总结'].map((sub) => (
          <button key={sub}
            className="px-4 py-2 rounded-full text-sm bg-white dark:bg-gray-800 hover:bg-primary-50 hover:text-primary-700 transition-colors">
            {sub}
          </button>
        ))}
      </div>

      {/* 文章列表 */}
      <div className="grid grid-cols-2 gap-4">
        {articles.map((article: any) => <ArticleCard key={article._id} article={article} />)}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/TagArchive/
git commit -m "feat(frontend): add tag archive page"
```

---

## Task 3.6: Phase 3 验收

- [ ] **Step 1: 验证文章列表**

```bash
# 打开 http://localhost:5173/articles
# 检查: 分类筛选切换时列表更新
# 检查: 排序下拉框工作正常
```

- [ ] **Step 2: 验证文章详情**

```bash
# 点击文章卡片进入详情页
# 检查: 面包屑导航显示正确
# 检查: 文章目录渲染
# 检查: 相关标签显示
```

- [ ] **Step 3: 验证标签归档**

```bash
# 访问 /articles/tags/Next.js
# 检查: 标签头图和统计信息
# 检查: 文章列表筛选正确
```

- [ ] **Step 4: UI 对照检查**

对照 02-articles-list.png、09-article-detail-nextjs-rebuild.png、10-tag-nextjs-archive.png 检查：
- [ ] 文章卡片样式一致
- [ ] 筛选标签圆角和颜色
- [ ] 详情页布局（左侧内容 + 右侧目录）

- [ ] **Step 5: Commit**

```bash
git commit --allow-empty -m "checkpoint: phase 3 article system complete"
```
