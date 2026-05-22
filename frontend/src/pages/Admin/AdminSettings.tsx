import { useEffect, useRef, useState } from 'react'
import { Save, Plus, Trash2, ImagePlus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useSettings, useUpdateSettings } from '@/hooks/useSetting'
import type { SiteProfile, SiteProfileStat, SiteProfileSocial } from '@/api/setting'

const DEFAULT_PROFILE: SiteProfile = {
  nickname: 'Sora',
  avatar: '/images/home/avatar.png',
  title: '前端开发 & 设计爱好者',
  bio: '热爱技术，喜欢设计，也热爱生活。\n这里是我的数字花园 🌱',
  level: 5,
  stats: [
    { label: '文章', value: '0' },
    { label: '项目', value: '0' },
    { label: '笔记', value: '0' },
    { label: '访客量', value: '0' },
  ],
  socials: [
    { icon: 'Github', label: 'GitHub', href: '#' },
    { icon: 'Twitter', label: '知乎', href: '#' },
    { icon: 'Twitter', label: '微博', href: '#' },
    { icon: 'Mail', label: '邮箱', href: '#' },
  ],
}

export default function AdminSettings() {
  const settingsQuery = useSettings()
  const updateSettings = useUpdateSettings()

  const [banners, setBanners] = useState<string[]>([])
  const [profile, setProfile] = useState<SiteProfile>(DEFAULT_PROFILE)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (settingsQuery.data && !initializedRef.current) {
      initializedRef.current = true
      setBanners(settingsQuery.data.banners ?? [])
      setProfile(settingsQuery.data.profile ?? DEFAULT_PROFILE)
    }
  }, [settingsQuery.data])

  async function handleSave() {
    await updateSettings.mutateAsync({ banners, profile })
  }

  function addBanner() {
    setBanners((prev) => [...prev, ''])
  }

  function updateBanner(index: number, value: string) {
    setBanners((prev) => prev.map((b, i) => (i === index ? value : b)))
  }

  function removeBanner(index: number) {
    setBanners((prev) => prev.filter((_, i) => i !== index))
  }

  function updateStat(index: number, field: keyof SiteProfileStat, value: string) {
    setProfile((prev) => ({
      ...prev,
      stats: prev.stats.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }))
  }

  function addStat() {
    setProfile((prev) => ({
      ...prev,
      stats: [...prev.stats, { label: '', value: '' }],
    }))
  }

  function removeStat(index: number) {
    setProfile((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index),
    }))
  }

  function updateSocial(index: number, field: keyof SiteProfileSocial, value: string) {
    setProfile((prev) => ({
      ...prev,
      socials: prev.socials.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }))
  }

  function addSocial() {
    setProfile((prev) => ({
      ...prev,
      socials: [...prev.socials, { icon: 'Link', label: '', href: '#' }],
    }))
  }

  function removeSocial(index: number) {
    setProfile((prev) => ({
      ...prev,
      socials: prev.socials.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            首页配置
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            配置首页 Banner 轮播图和个人信息卡片内容。
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={updateSettings.isPending}
          className="gap-2"
        >
          <Save size={16} />
          {updateSettings.isPending ? '保存中...' : '保存配置'}
        </Button>
      </div>

      {/* Banner 配置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ImagePlus size={18} />
            Banner 轮播图
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {banners.map((url, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Input
                placeholder="图片 URL"
                value={url}
                onChange={(e) => updateBanner(idx, e.target.value)}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeBanner(idx)}
                title="删除"
              >
                <Trash2 size={16} className="text-red-500" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addBanner} className="gap-2">
            <Plus size={16} />
            添加 Banner
          </Button>
        </CardContent>
      </Card>

      {/* 个人信息配置 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">个人信息卡片</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>昵称</Label>
              <Input
                value={profile.nickname}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, nickname: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>等级</Label>
              <Input
                type="number"
                value={profile.level}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    level: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>头像 URL</Label>
            <Input
              value={profile.avatar}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, avatar: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>头衔</Label>
            <Input
              value={profile.title}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>简介</Label>
            <Textarea
              rows={3}
              value={profile.bio}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, bio: e.target.value }))
              }
            />
          </div>

          {/* Stats */}
          <div className="space-y-2">
            <Label>统计数据</Label>
            {profile.stats.map((stat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  placeholder="标签"
                  value={stat.label}
                  onChange={(e) => updateStat(idx, 'label', e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="数值"
                  value={stat.value}
                  onChange={(e) => updateStat(idx, 'value', e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStat(idx)}
                  title="删除"
                >
                  <Trash2 size={16} className="text-red-500" />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={addStat} className="gap-2">
              <Plus size={16} />
              添加统计项
            </Button>
          </div>

          {/* Socials */}
          <div className="space-y-2">
            <Label>社交链接</Label>
            {profile.socials.map((social, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  placeholder="图标名"
                  value={social.icon}
                  onChange={(e) => updateSocial(idx, 'icon', e.target.value)}
                  className="w-28"
                />
                <Input
                  placeholder="名称"
                  value={social.label}
                  onChange={(e) => updateSocial(idx, 'label', e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="链接"
                  value={social.href}
                  onChange={(e) => updateSocial(idx, 'href', e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSocial(idx)}
                  title="删除"
                >
                  <Trash2 size={16} className="text-red-500" />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={addSocial} className="gap-2">
              <Plus size={16} />
              添加社交链接
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
