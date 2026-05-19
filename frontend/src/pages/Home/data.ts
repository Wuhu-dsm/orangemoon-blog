import {
  BadgeCheck,
  Bell,
  BookOpen,
  Clock,
  FileText,
  FolderOpen,
  Gift,
  Home,
  Link as LinkIcon,
  Mail,
  MessageSquare,
  Moon,
  Rss,
  Settings,
  User,
} from 'lucide-react'
import type {
  ArticlePreview,
  DockAction,
  NavItem,
  ProjectPreview,
  ReadingMetric,
  StatItem,
  TagSummary,
  TimelineItem,
} from './types'

export const navItems: NavItem[] = [
  { icon: Home, label: '首页', path: '/' },
  { icon: FileText, label: '文章', path: '/articles' },
  { icon: FolderOpen, label: '项目', path: '/projects' },
  { icon: BookOpen, label: '笔记', path: '/notes' },
  { icon: Clock, label: '时间轴', path: '/timeline' },
  { icon: User, label: '关于我', path: '/about' },
  { icon: LinkIcon, label: '友链', path: '/friends' },
  { icon: MessageSquare, label: '留言板', path: '/guestbook' },
]

export const dockActions: DockAction[] = [
  { icon: Moon, label: '切换主题' },
  { icon: Settings, label: '设置' },
  { icon: Bell, label: '通知' },
  { icon: MessageSquare, label: '菜单' },
]

export const topActions: DockAction[] = [
  { icon: Gift, label: '礼物' },
  { icon: Bell, label: '通知' },
]

export const profileStats: StatItem[] = [
  { label: '文章', value: '56' },
  { label: '项目', value: '12' },
  { label: '笔记', value: '89' },
  { label: '粉丝', value: '1.2k' },
]

export const socialActions: DockAction[] = [
  { icon: BadgeCheck, label: '作品集' },
  { icon: BookOpen, label: '知乎' },
  { icon: Rss, label: 'RSS' },
  { icon: Mail, label: '邮箱' },
]

export const articles: ArticlePreview[] = [
  {
    id: 'next-blog',
    title: '我用 Next.js 14 重构了个人博客',
    excerpt: '记录一次从零到一重构博客的过程，性能提升 60%，体验更丝滑。',
    category: '技术',
    date: '2024/06/01',
    views: '1.2k',
    tone: 'studio',
  },
  {
    id: 'kamakura-sea',
    title: '去镰仓吧！吹吹海风看看海',
    excerpt: '日本镰仓旅行小记，镰仓高校前的海，真的会让人治愈。',
    category: '生活',
    date: '2024/05/28',
    views: '982',
    tone: 'ocean',
  },
  {
    id: 'persistence',
    title: '为什么我们总是很难坚持？',
    excerpt: '从习惯养成的底层逻辑出发，聊聊如何建立属于自己的系统。',
    category: '思考',
    date: '2024/05/20',
    views: '1.5k',
    tone: 'room',
  },
]

export const projects: ProjectPreview[] = [
  {
    id: 'soraui',
    title: 'SoraUI 组件库',
    description: '基于 React + TS 的轻量级组件库',
    status: '进行中',
    tone: 'library',
  },
  {
    id: 'windy',
    title: 'Windy 团队管理系统',
    description: '一款简洁美观的团队管理工具',
    status: '已完成',
    tone: 'system',
  },
  {
    id: 'animejs',
    title: 'Anime.js 动画集',
    description: '收集整理的动画效果与实战示例',
    status: '已完成',
    tone: 'anime',
  },
]

export const readingMetrics: ReadingMetric[] = [
  { label: '文章阅读', value: '12.4k', delta: '18.6%' },
  { label: '独立访客', value: '3.2k', delta: '12.8%' },
  { label: '阅读时长', value: '28.6h', delta: '9.7%' },
]

export const tagCloud: TagSummary[] = [
  { name: '前端开发', count: 23, tone: 'mint' },
  { name: '生活', count: 18, tone: 'blue' },
  { name: '设计', count: 15, tone: 'mint' },
  { name: '随笔', count: 12, tone: 'cyan' },
  { name: 'Next.js', count: 10, tone: 'blue' },
  { name: 'TypeScript', count: 9, tone: 'mint' },
  { name: '旅行', count: 8, tone: 'blue' },
  { name: '动画', count: 7, tone: 'mint' },
  { name: '工具', count: 6, tone: 'blue' },
  { name: '思考', count: 6, tone: 'cyan' },
]

export const timelineItems: TimelineItem[] = [
  { month: '2024-06', content: '发布了新文章《我用 Next.js 14 重构了个人博客》' },
  { month: '2024-05', content: '完成了 Windy 团队管理系统' },
  { month: '2024-04', content: '新增了 3 篇笔记' },
  { month: '2024-03', content: '博客访问量突破 10,000 🎉' },
]
