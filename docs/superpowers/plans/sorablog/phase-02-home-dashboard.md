# Phase 2: 首页 Dashboard

> **目标:** 实现完整首页，含 Banner、最新文章、精选项目、阅读统计、标签云、时间轴、订阅区
> **UI 稿参考:** 01-home-dashboard.png
> **前置条件:** Phase 1 完成
> **验收标准:** 首页完整渲染，数据从后端 API 获取，UI 与稿图风格一致

---

## Task 2.1: 后端 - 文章列表 API

**Files:**
- Create: `backend/src/modules/article/article.module.ts`
- Create: `backend/src/modules/article/article.service.ts`
- Create: `backend/src/modules/article/article.controller.ts`
- Create: `backend/src/modules/article/schemas/article.schema.ts`
- Create: `backend/src/modules/article/dto/create-article.dto.ts`
- Modify: `backend/src/app.module.ts`

- [ ] **Step 1: ArticleSchema**

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type ArticleDocument = HydratedDocument<Article>

@Schema({ timestamps: true })
export class Article {
  @Prop({ required: true }) title: string
  @Prop({ required: true, unique: true }) slug: string
  @Prop() summary: string
  @Prop() coverImage: string
  @Prop({ required: true }) content: string
  @Prop({ type: Types.ObjectId, ref: 'User' }) author: Types.ObjectId
  @Prop({ enum: ['技术', '生活', '思考', '设计', '旅行', '随笔'] }) category: string
  @Prop([String]) tags: string[]
  @Prop({ enum: ['published', 'draft'], default: 'draft' }) status: string
  @Prop({ default: false }) isPinned: boolean
  @Prop({ default: 0 }) views: number
  @Prop({ default: 0 }) likes: number
  @Prop({ default: 0 }) readTime: number
  @Prop() publishedAt: Date
}

export const ArticleSchema = SchemaFactory.createForClass(Article)
```

- [ ] **Step 2: CreateArticleDto**

```typescript
import { IsString, IsOptional, IsEnum, IsArray, IsBoolean } from 'class-validator'
export class CreateArticleDto {
  @IsString() title: string
  @IsString() slug: string
  @IsOptional() @IsString() summary?: string
  @IsOptional() @IsString() coverImage?: string
  @IsString() content: string
  @IsEnum(['技术', '生活', '思考', '设计', '旅行', '随笔']) category: string
  @IsOptional() @IsArray() tags?: string[]
  @IsOptional() @IsBoolean() isPinned?: boolean
}
```

- [ ] **Step 3: ArticleService**

```typescript
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Article, ArticleDocument } from './schemas/article.schema'
import { CreateArticleDto } from './dto/create-article.dto'

@Injectable()
export class ArticleService {
  constructor(@InjectModel(Article.name) private articleModel: Model<ArticleDocument>) {}
  async findAll(query: any = {}): Promise<ArticleDocument[]> {
    const filter: any = { status: 'published' }
    if (query.category) filter.category = query.category
    if (query.tag) filter.tags = { $in: [query.tag] }
    return this.articleModel.find(filter).sort({ isPinned: -1, publishedAt: -1 }).exec()
  }
  async findBySlug(slug: string): Promise<ArticleDocument | null> {
    return this.articleModel.findOne({ slug, status: 'published' }).populate('author', 'username avatar').exec()
  }
  async create(authorId: string, dto: CreateArticleDto): Promise<ArticleDocument> {
    return new this.articleModel({ ...dto, author: authorId, publishedAt: new Date() }).save()
  }
  async update(id: string, dto: Partial<CreateArticleDto>): Promise<ArticleDocument | null> {
    return this.articleModel.findByIdAndUpdate(id, dto, { new: true }).exec()
  }
  async delete(id: string): Promise<void> { await this.articleModel.findByIdAndDelete(id) }
  async incrementViews(id: string): Promise<void> { await this.articleModel.findByIdAndUpdate(id, { $inc: { views: 1 } }) }
}
```

- [ ] **Step 4: ArticleController**

```typescript
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common'
import { Public } from '../../common/decorators/public.decorator'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { ArticleService } from './article.service'
import { CreateArticleDto } from './dto/create-article.dto'

@Controller('articles')
export class ArticleController {
  constructor(private articleService: ArticleService) {}
  @Public() @Get() async findAll(@Query() query: any) { return this.articleService.findAll(query) }
  @Public() @Get(':slug') async findOne(@Param('slug') slug: string) { return this.articleService.findBySlug(slug) }
  @Post() async create(@CurrentUser() user: any, @Body() dto: CreateArticleDto) { return this.articleService.create(user.userId, dto) }
  @Put(':id') async update(@Param('id') id: string, @Body() dto: Partial<CreateArticleDto>) { return this.articleService.update(id, dto) }
  @Delete(':id') async delete(@Param('id') id: string) { await this.articleService.delete(id); return { success: true } }
}
```

- [ ] **Step 5: ArticleModule + AppModule**

```typescript
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ArticleService } from './article.service'
import { ArticleController } from './article.controller'
import { Article, ArticleSchema } from './schemas/article.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }])],
  providers: [ArticleService], controllers: [ArticleController],
})
export class ArticleModule {}
```

在 AppModule 中导入 ArticleModule。

- [ ] **Step 6: Commit**

```bash
git add backend/src/modules/article/ backend/src/app.module.ts
git commit -m "feat(backend): add article module"
```

---

## Task 2.2: 后端 - 项目列表 API

**Files:**
- Create: `backend/src/modules/project/project.module.ts`
- Create: `backend/src/modules/project/project.service.ts`
- Create: `backend/src/modules/project/project.controller.ts`
- Create: `backend/src/modules/project/schemas/project.schema.ts`
- Create: `backend/src/modules/project/dto/create-project.dto.ts`
- Modify: `backend/src/app.module.ts`

- [ ] **Step 1: ProjectSchema**

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type ProjectDocument = HydratedDocument<Project>

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true }) title: string
  @Prop({ required: true, unique: true }) slug: string
  @Prop() summary: string
  @Prop() description: string
  @Prop() coverImage: string
  @Prop({ enum: ['已发布', '开发中', '实验中'], default: '开发中' }) status: string
  @Prop([String]) techStack: string[]
  @Prop({ enum: ['Web', 'UI', '动画', '实验'] }) category: string
  @Prop([String]) screenshots: string[]
  @Prop({ type: Object }) links: { preview?: string; repo?: string; docs?: string }
  @Prop({ type: Object }) stats: { githubStars?: number; users?: number; views?: number }
  @Prop([{ title: String, description: String, icon: String }]) features: { title: string; description: string; icon: string }[]
  @Prop([{ date: String, title: String, description: String }]) milestones: { date: string; title: string; description: string }[]
  @Prop({ default: 0 }) order: number
}

export const ProjectSchema = SchemaFactory.createForClass(Project)
```

- [ ] **Step 2: ProjectService + ProjectController**

类似 Article，提供 findAll（支持 category/status 筛选）、findBySlug、create、update、delete。

- [ ] **Step 3: Commit**

```bash
git add backend/src/modules/project/ backend/src/app.module.ts
git commit -m "feat(backend): add project module"
```

---

## Task 2.3: 后端 - 标签列表 API

**Files:**
- Create: `backend/src/modules/tag/tag.module.ts`
- Create: `backend/src/modules/tag/tag.service.ts`
- Create: `backend/src/modules/tag/tag.controller.ts`
- Create: `backend/src/modules/tag/schemas/tag.schema.ts`
- Modify: `backend/src/app.module.ts`

- [ ] **Step 1: TagSchema**

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type TagDocument = HydratedDocument<Tag>

@Schema({ timestamps: true })
export class Tag {
  @Prop({ required: true, unique: true }) name: string
  @Prop({ required: true, unique: true }) slug: string
  @Prop() description: string
  @Prop() color: string
  @Prop() icon: string
  @Prop({ enum: ['article', 'project', 'note', 'global'], default: 'global' }) type: string
  @Prop({ default: 0 }) usageCount: number
}

export const TagSchema = SchemaFactory.createForClass(Tag)
```

- [ ] **Step 2: TagService + TagController**

提供 findAll（支持 type 筛选）、findBySlug、create。

- [ ] **Step 3: Commit**

```bash
git add backend/src/modules/tag/ backend/src/app.module.ts
git commit -m "feat(backend): add tag module"
```

---

## Task 2.4: 后端 - 种子数据

**Files:**
- Create: `backend/src/seed.ts`

- [ ] **Step 1: 创建种子数据脚本**

```typescript
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ArticleService } from './modules/article/article.service'
import { ProjectService } from './modules/project/project.service'
import { TagService } from './modules/tag/tag.service'

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule)
  const articleService = app.get(ArticleService)
  const projectService = app.get(ProjectService)
  const tagService = app.get(TagService)

  // Seed tags
  const tags = ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', '设计', '生活', '旅行']
  for (const name of tags) {
    await tagService.create({ name, slug: name.toLowerCase().replace(/\s+/g, '-') })
  }

  // Seed articles
  await articleService.create('admin', {
    title: '我用 Next.js 14 重构了个人博客',
    slug: 'nextjs-14-rebuild-blog',
    summary: '记录一次从零到一重构博客的过程，性能提升 60%，体验更丝滑。',
    content: '# 正文内容...',
    category: '技术',
    tags: ['Next.js', 'React'],
    status: 'published',
  })

  // Seed projects
  await projectService.create({
    title: 'Windy 团队协作平台',
    slug: 'windy-team-platform',
    summary: '为小团队打造的轻量级协作与项目管理工具',
    description: '# 项目详情...',
    status: '已发布',
    category: 'Web',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
  })

  console.log('Seed completed')
  await app.close()
}
bootstrap()
```

- [ ] **Step 2: 运行种子脚本**

```bash
cd backend
npx ts-node src/seed.ts
# 期望: Seed completed
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/seed.ts
git commit -m "chore(backend): add seed data for articles, projects, tags"
```

---

## Task 2.5: 前端 - API 层

**Files:**
- Create: `frontend/src/api/articles.ts`
- Create: `frontend/src/api/projects.ts`
- Create: `frontend/src/api/tags.ts`

- [ ] **Step 1: Articles API**

```typescript
import { apiClient } from './client'
export const articlesApi = {
  getList: (params?: any) => apiClient.get('/articles', { params }),
  getBySlug: (slug: string) => apiClient.get(`/articles/${slug}`),
}
```

- [ ] **Step 2: Projects API**

```typescript
import { apiClient } from './client'
export const projectsApi = {
  getList: (params?: any) => apiClient.get('/projects', { params }),
  getBySlug: (slug: string) => apiClient.get(`/projects/${slug}`),
}
```

- [ ] **Step 3: Tags API**

```typescript
import { apiClient } from './client'
export const tagsApi = {
  getList: (type?: string) => apiClient.get('/tags', { params: { type } }),
  getBySlug: (slug: string) => apiClient.get(`/tags/${slug}`),
}
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/api/articles.ts frontend/src/api/projects.ts frontend/src/api/tags.ts
git commit -m "feat(frontend): add articles, projects, tags api"
```

---

## Task 2.6: 前端 - Banner 组件

**Files:**
- Create: `frontend/src/pages/Home/components/Banner.tsx`

**UI 参考:** 01-home-dashboard.png（顶部 Banner 区域，渐变背景 + 大标题 + 副标题）

- [ ] **Step 1: Banner**

```tsx
export default function Banner() {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 text-white p-12">
      <div className="relative z-10 max-w-2xl">
        <h1 className="text-4xl font-bold mb-4 leading-tight">写代码是热爱<br />写生活是本能</h1>
        <p className="text-primary-100 text-lg">在技术与生活之间，寻找平衡与热爱</p>
        <button className="mt-6 px-6 py-3 bg-white text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors">
          探索我的世界 →
        </button>
      </div>
      {/* 右侧插画占位 */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full" />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/Home/components/Banner.tsx
git commit -m "feat(frontend): add home banner component"
```

---

## Task 2.7: 前端 - 最新文章组件

**Files:**
- Create: `frontend/src/pages/Home/components/LatestArticles.tsx`
- Create: `frontend/src/components/common/ArticleCard.tsx`

**UI 参考:** 01-home-dashboard.png（文章卡片：封面图 + 分类标签 + 标题 + 摘要 + 浏览量/点赞/日期）

- [ ] **Step 1: ArticleCard**

```tsx
import { Link } from 'react-router-dom'
import { Eye, Heart } from 'lucide-react'
import TagBadge from './TagBadge'

export default function ArticleCard({ article }: { article: any }) {
  return (
    <Link to={`/articles/${article.slug}`} className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      {article.coverImage && (
        <div className="aspect-video overflow-hidden">
          <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        </div>
      )}
      <div className="p-4">
        <div className="flex gap-2 mb-2">
          <TagBadge>{article.category}</TagBadge>
          {article.tags?.slice(0, 2).map((tag: string) => <TagBadge key={tag} variant="secondary">{tag}</TagBadge>)}
        </div>
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{article.title}</h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-3">{article.summary}</p>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1"><Eye size={14} /> {article.views}</span>
          <span className="flex items-center gap-1"><Heart size={14} /> {article.likes}</span>
          <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: TagBadge**

```tsx
import { cn } from '@/lib/utils'

interface TagBadgeProps { children: React.ReactNode; variant?: 'default' | 'secondary'; className?: string }

export default function TagBadge({ children, variant = 'default', className }: TagBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      variant === 'default' && 'bg-primary-100 text-primary-700 dark:bg-primary-900/30',
      variant === 'secondary' && 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      className,
    )}>{children}</span>
  )
}
```

- [ ] **Step 3: LatestArticles**

```tsx
import { useQuery } from '@tanstack/react-query'
import { articlesApi } from '../../../api/articles'
import ArticleCard from '../../../components/common/ArticleCard'

export default function LatestArticles() {
  const { data } = useQuery({ queryKey: ['latestArticles'], queryFn: () => articlesApi.getList({ limit: 3 }) })
  const articles = (data as any)?.data || []

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">最新文章</h2>
        <a href="/articles" className="text-sm text-primary-500 hover:underline">查看全部 →</a>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {articles.map((article: any) => <ArticleCard key={article._id} article={article} />)}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/common/ArticleCard.tsx frontend/src/components/common/TagBadge.tsx frontend/src/pages/Home/components/LatestArticles.tsx
git commit -m "feat(frontend): add article card and latest articles component"
```

---

## Task 2.8: 前端 - 精选项目组件

**Files:**
- Create: `frontend/src/pages/Home/components/FeaturedProjects.tsx`
- Create: `frontend/src/components/common/ProjectCard.tsx`

**UI 参考:** 01-home-dashboard.png（项目卡片：封面图 + 状态标签 + 标题 + 技术栈）

- [ ] **Step 1: ProjectCard**

```tsx
import { Link } from 'react-router-dom'

export default function ProjectCard({ project }: { project: any }) {
  return (
    <Link to={`/projects/${project.slug}`} className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="aspect-video overflow-hidden relative">
        <img src={project.coverImage || '/project-placeholder.png'} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        <span className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${
          project.status === '已发布' ? 'bg-green-500 text-white' :
          project.status === '开发中' ? 'bg-blue-500 text-white' :
          'bg-purple-500 text-white'
        }`}>{project.status}</span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-3">{project.summary}</p>
        <div className="flex gap-2">
          {project.techStack?.slice(0, 3).map((tech: string) => (
            <span key={tech} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">{tech}</span>
          ))}
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: FeaturedProjects**

```tsx
import { useQuery } from '@tanstack/react-query'
import { projectsApi } from '../../../api/projects'
import ProjectCard from '../../../components/common/ProjectCard'

export default function FeaturedProjects() {
  const { data } = useQuery({ queryKey: ['featuredProjects'], queryFn: () => projectsApi.getList({ limit: 3 }) })
  const projects = (data as any)?.data || []

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">精选项目</h2>
        <a href="/projects" className="text-sm text-primary-500 hover:underline">查看全部 →</a>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {projects.map((project: any) => <ProjectCard key={project._id} project={project} />)}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/common/ProjectCard.tsx frontend/src/pages/Home/components/FeaturedProjects.tsx
git commit -m "feat(frontend): add project card and featured projects component"
```

---

## Task 2.9: 前端 - 阅读统计组件

**Files:**
- Create: `frontend/src/pages/Home/components/ReadingStats.tsx`

**UI 参考:** 01-home-dashboard.png（右侧统计卡片：文章阅读、独立访客、阅读时长，折线图）

- [ ] **Step 1: ReadingStats**

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: '05-01', views: 400 },
  { name: '05-10', views: 300 },
  { name: '05-20', views: 560 },
  { name: '05-31', views: 480 },
]

export default function ReadingStats() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold mb-4">阅读统计</h3>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <div className="text-sm text-gray-500">文章阅读</div>
          <div className="text-xl font-bold">12.4k</div>
          <div className="text-xs text-green-500">↑ 18.6%</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">独立访客</div>
          <div className="text-xl font-bold">3.2k</div>
          <div className="text-xs text-green-500">↑ 12.8%</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">阅读时长</div>
          <div className="text-xl font-bold">28.6h</div>
          <div className="text-xs text-green-500">↑ 9.7%</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="views" stroke="#22c55e" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/Home/components/ReadingStats.tsx
git commit -m "feat(frontend): add reading stats component with chart"
```

---

## Task 2.10: 前端 - 标签云 + 时间轴 + 订阅区

**Files:**
- Create: `frontend/src/pages/Home/components/TagCloud.tsx`
- Create: `frontend/src/pages/Home/components/TimelineWidget.tsx`
- Create: `frontend/src/pages/Home/components/SubscribeBox.tsx`

**UI 参考:** 01-home-dashboard.png（右侧标签云、时间轴小部件、底部订阅区）

- [ ] **Step 1: TagCloud**

```tsx
import { useQuery } from '@tanstack/react-query'
import { tagsApi } from '../../../api/tags'
import { Link } from 'react-router-dom'

export default function TagCloud() {
  const { data } = useQuery({ queryKey: ['tags'], queryFn: () => tagsApi.getList() })
  const tags = (data as any)?.data || []

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">标签云</h3>
        <Link to="/tags" className="text-sm text-primary-500">更多标签 →</Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag: any) => (
          <Link key={tag.slug} to={`/articles/tags/${tag.slug}`}
            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm hover:bg-primary-100 hover:text-primary-700 transition-colors">
            {tag.name} {tag.usageCount > 0 && <span className="text-xs text-gray-400 ml-1">{tag.usageCount}</span>}
          </Link>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: TimelineWidget**

```tsx
const timelineItems = [
  { date: '2024-06', title: '发布了新文章《我用 Next.js 14 重构了个人博客》' },
  { date: '2024-05', title: '完成了 Windy 团队协作系统' },
  { date: '2024-04', title: '新增了 3 篇笔记' },
  { date: '2024-03', title: '博客访问量突破 10,000' },
]

export default function TimelineWidget() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">时间轴</h3>
        <a href="/timeline" className="text-sm text-primary-500">查看全部 →</a>
      </div>
      <div className="space-y-4">
        {timelineItems.map((item, index) => (
          <div key={index} className="flex gap-3">
            <div className="w-2 h-2 mt-2 rounded-full bg-primary-500 shrink-0" />
            <div>
              <div className="text-xs text-gray-500">{item.date}</div>
              <div className="text-sm mt-1">{item.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: SubscribeBox**

```tsx
export default function SubscribeBox() {
  return (
    <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-8 text-white flex items-center justify-between">
      <div>
        <h3 className="text-xl font-bold mb-2">订阅更新，不错过每一篇精彩内容</h3>
        <p className="text-primary-100">每周发送精选文章与灵感分享</p>
      </div>
      <div className="flex gap-2">
        <input type="email" placeholder="输入你的邮箱地址..."
          className="px-4 py-2 rounded-lg text-gray-900 w-64 focus:outline-none" />
        <button className="px-6 py-2 bg-white text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors">
          订阅
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/Home/components/TagCloud.tsx frontend/src/pages/Home/components/TimelineWidget.tsx frontend/src/pages/Home/components/SubscribeBox.tsx
git commit -m "feat(frontend): add tag cloud, timeline widget, subscribe box"
```

---

## Task 2.11: 前端 - Home 页面整合

**Files:**
- Create: `frontend/src/pages/Home/Home.tsx`

**UI 参考:** 01-home-dashboard.png（整体布局：左侧 2/3 主内容，右侧 1/3 侧边栏，底部订阅区）

- [ ] **Step 1: Home 页面**

```tsx
import Banner from './components/Banner'
import LatestArticles from './components/LatestArticles'
import FeaturedProjects from './components/FeaturedProjects'
import ReadingStats from './components/ReadingStats'
import TagCloud from './components/TagCloud'
import TimelineWidget from './components/TimelineWidget'
import SubscribeBox from './components/SubscribeBox'

export default function Home() {
  return (
    <div className="space-y-8">
      <Banner />
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-8">
          <LatestArticles />
          <FeaturedProjects />
        </div>
        <div className="space-y-6">
          <ReadingStats />
          <TagCloud />
          <TimelineWidget />
        </div>
      </div>
      <SubscribeBox />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/Home/Home.tsx
git commit -m "feat(frontend): integrate home dashboard"
```

---

## Task 2.12: Phase 2 验收

- [ ] **Step 1: 启动后端并验证 API**

```bash
cd backend
npm run start:dev
# 验证文章列表
curl http://localhost:3000/api/v1/articles
# 验证项目列表
curl http://localhost:3000/api/v1/projects
# 验证标签列表
curl http://localhost:3000/api/v1/tags
```

- [ ] **Step 2: 启动前端并验证首页**

```bash
cd frontend
npm run dev
# 打开 http://localhost:5173
# 期望看到: Banner + 3 篇文章卡片 + 3 个项目卡片 + 右侧统计/标签/时间轴 + 底部订阅区
```

- [ ] **Step 3: 对比 UI 稿检查**

对照 01-home-dashboard.png 检查：
- [ ] 配色是否一致（green-500 主色、gray-50 背景）
- [ ] 布局是否正确（左侧 2/3 + 右侧 1/3）
- [ ] 卡片圆角和阴影
- [ ] 标签样式
- [ ] 图表是否显示

- [ ] **Step 4: Commit**

```bash
git commit --allow-empty -m "checkpoint: phase 2 home dashboard complete"
```
