import type { ReactNode } from 'react'
import { ImagePlus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { ProjectStatus } from '@/api/adminContent'

export interface ProjectFormProps {
  // Core fields
  title: string
  onTitleChange: (value: string) => void
  slug: string
  onSlugChange: (value: string) => void
  summary: string
  onSummaryChange: (value: string) => void

  // Cover image
  coverImage: string
  onCoverImageChange: (value: string) => void
  onCoverUpload: (file?: File) => Promise<void>
  isUploading: boolean

  // Project-specific fields
  projectStatus: ProjectStatus
  onProjectStatusChange: (value: ProjectStatus) => void
  techStackText: string
  onTechStackTextChange: (value: string) => void
  repositoryUrl: string
  onRepositoryUrlChange: (value: string) => void
  demoUrl: string
  onDemoUrlChange: (value: string) => void
  screenshotsText: string
  onScreenshotsTextChange: (value: string) => void
  onScreenshotUpload: (file?: File) => Promise<void>

  // Tags (shared)
  tagsText: string
  onTagsTextChange: (value: string) => void
}

const selectClassName =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

export function ProjectForm({
  title,
  onTitleChange,
  slug,
  onSlugChange,
  summary,
  onSummaryChange,
  coverImage,
  onCoverImageChange,
  onCoverUpload,
  isUploading,
  projectStatus,
  onProjectStatusChange,
  techStackText,
  onTechStackTextChange,
  repositoryUrl,
  onRepositoryUrlChange,
  demoUrl,
  onDemoUrlChange,
  screenshotsText,
  onScreenshotsTextChange,
  onScreenshotUpload,
  tagsText,
  onTagsTextChange,
}: ProjectFormProps) {
  return (
    <div className="space-y-4">
      {/* 封面图 */}
      <Card>
        <CardHeader>
          <CardTitle>封面图</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={coverImage}
              onChange={(event) => onCoverImageChange(event.target.value)}
              placeholder="https://..."
            />
            <label className={`inline-flex h-8 cursor-pointer items-center justify-center rounded-lg border border-input px-2 text-sm hover:bg-muted ${isUploading ? 'pointer-events-none opacity-50' : ''}`}>
              <ImagePlus className="size-4" />
              <span className="sr-only">上传封面图</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) =>
                  void onCoverUpload(event.target.files?.[0])
                }
              />
            </label>
          </div>
          {coverImage && (
            <img
              src={coverImage}
              alt="封面预览"
              className="mt-3 max-h-48 w-full rounded-lg border object-cover"
            />
          )}
        </CardContent>
      </Card>

      {/* 基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Field label="标题">
            <Input
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder="项目标题"
            />
          </Field>
          <Field label="Slug">
            <Input
              value={slug}
              onChange={(event) => onSlugChange(event.target.value)}
              placeholder="留空则自动生成"
            />
          </Field>
          <Field label="摘要">
            <Textarea
              value={summary}
              onChange={(event) => onSummaryChange(event.target.value)}
              placeholder="用于列表和预览的简短描述"
              className="min-h-24"
            />
          </Field>
        </CardContent>
      </Card>

      {/* 项目详情 */}
      <Card>
        <CardHeader>
          <CardTitle>项目详情</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Field label="状态">
            <select
              value={projectStatus}
              onChange={(event) =>
                onProjectStatusChange(event.target.value as ProjectStatus)
              }
              className={selectClassName}
            >
              <option value="pending">待启动</option>
              <option value="developing">开发中</option>
              <option value="updating">更新中</option>
              <option value="archived">已归档</option>
            </select>
          </Field>
          <Field label="技术栈">
            <Input
              value={techStackText}
              onChange={(event) => onTechStackTextChange(event.target.value)}
              placeholder="React, NestJS, MongoDB"
            />
          </Field>
          <Field label="仓库地址">
            <Input
              value={repositoryUrl}
              onChange={(event) => onRepositoryUrlChange(event.target.value)}
              placeholder="https://github.com/..."
            />
          </Field>
          <Field label="演示地址">
            <Input
              value={demoUrl}
              onChange={(event) => onDemoUrlChange(event.target.value)}
              placeholder="https://..."
            />
          </Field>
        </CardContent>
      </Card>

      {/* 项目截图 */}
      <Card>
        <CardHeader>
          <CardTitle>项目截图</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={screenshotsText}
              onChange={(event) => onScreenshotsTextChange(event.target.value)}
              placeholder="多个地址用逗号分隔"
            />
            <label className={`inline-flex h-8 cursor-pointer items-center justify-center rounded-lg border border-input px-2 text-sm hover:bg-muted ${isUploading ? 'pointer-events-none opacity-50' : ''}`}>
              <ImagePlus className="size-4" />
              <span className="sr-only">上传项目截图</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) =>
                  void onScreenshotUpload(event.target.files?.[0])
                }
              />
            </label>
          </div>
          {screenshotsText && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {screenshotsText
                .split(/[,，\n]/)
                .map((url) => url.trim())
                .filter(Boolean)
                .map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`截图 ${index + 1}`}
                    className="max-h-32 w-full rounded-lg border object-cover"
                  />
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 标签 */}
      <Card>
        <CardHeader>
          <CardTitle>标签</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={tagsText}
            onChange={(event) => onTagsTextChange(event.target.value)}
            placeholder="React, 旅行, 随想"
          />
        </CardContent>
      </Card>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
        {label}
      </span>
      {children}
    </label>
  )
}
