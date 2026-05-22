import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowLeft, Eye, ImagePlus, Save, Send, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { uploadImage, type UploadPurpose } from '@/api/upload'
import type {
  Article,
  Note,
  NoteType,
  Project,
  ProjectStatus,
} from '@/api/adminContent'
import { ProjectForm } from '@/components/admin/content/ProjectForm'
import { ContentBlockEditor } from '@/components/admin/editor/ContentBlockEditor'
import { ContentBlockPreview } from '@/components/admin/editor/ContentBlockPreview'
import type { BlockContent, ContentKind } from '@/types/content'

export type ContentEditorValue = {
  title: string
  slug?: string
  summary?: string
  coverImage?: string
  tags: string[]
  body: BlockContent
  category?: string
  noteType?: NoteType
  screenshots: string[]
  techStack: string[]
  projectStatus?: ProjectStatus
  repositoryUrl?: string
  demoUrl?: string
}

type EditableContent = Article | Note | Project

interface AdminContentEditorProps {
  kind: ContentKind
  mode: 'create' | 'edit'
  initialValue?: EditableContent
  isLoading?: boolean
  isSaving?: boolean
  isPublishing?: boolean
  isDeleting?: boolean
  onBack: () => void
  onSaveDraft: (value: ContentEditorValue) => void | Promise<void>
  onPublish: (value: ContentEditorValue) => void | Promise<void>
  onSoftDelete?: () => void | Promise<void>
}

const kindLabels: Record<ContentKind, string> = {
  article: '文章',
  note: '笔记',
  project: '项目',
}

const coverPurpose: Record<ContentKind, UploadPurpose> = {
  article: 'article-cover',
  note: 'note-image',
  project: 'project-cover',
}

const bodyPurpose: Record<ContentKind, UploadPurpose> = {
  article: 'article-image',
  note: 'note-image',
  project: 'project-screenshot',
}

const selectClassName =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

export function AdminContentEditor({
  kind,
  mode,
  initialValue,
  isLoading = false,
  isSaving = false,
  isPublishing = false,
  isDeleting = false,
  onBack,
  onSaveDraft,
  onPublish,
  onSoftDelete,
}: AdminContentEditorProps) {
  const initialEditorValue = toEditorValue(initialValue)
  const [title, setTitle] = useState(() => initialEditorValue.title)
  const [slug, setSlug] = useState(() => initialEditorValue.slug ?? '')
  const [summary, setSummary] = useState(() => initialEditorValue.summary ?? '')
  const [coverImage, setCoverImage] = useState(
    () => initialEditorValue.coverImage ?? '',
  )
  const [tagsText, setTagsText] = useState(() =>
    initialEditorValue.tags.join(', '),
  )
  const [category, setCategory] = useState(
    () => initialEditorValue.category ?? '',
  )
  const [noteType, setNoteType] = useState<NoteType>(
    () => initialEditorValue.noteType ?? 'short',
  )
  const [screenshotsText, setScreenshotsText] = useState(() =>
    initialEditorValue.screenshots.join(', '),
  )
  const [techStackText, setTechStackText] = useState(() =>
    initialEditorValue.techStack.join(', '),
  )
  const [projectStatus, setProjectStatus] =
    useState<ProjectStatus>(() => initialEditorValue.projectStatus ?? 'pending')
  const [repositoryUrl, setRepositoryUrl] = useState(
    () => initialEditorValue.repositoryUrl ?? '',
  )
  const [demoUrl, setDemoUrl] = useState(() => initialEditorValue.demoUrl ?? '')
  const [body, setBody] = useState<BlockContent>(() => initialEditorValue.body)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const label = kindLabels[kind]
  const isBusy = isSaving || isPublishing || isDeleting || isUploading
  const currentValue = useMemo(
    () => buildValue({
      title,
      slug,
      summary,
      coverImage,
      tagsText,
      body,
      category,
      noteType,
      screenshotsText,
      techStackText,
      projectStatus,
      repositoryUrl,
      demoUrl,
    }),
    [
      body,
      category,
      coverImage,
      demoUrl,
      noteType,
      projectStatus,
      repositoryUrl,
      screenshotsText,
      slug,
      summary,
      tagsText,
      techStackText,
      title,
    ],
  )

  async function handleCoverUpload(file?: File) {
    if (!file) return
    setIsUploading(true)
    try {
      const uploaded = await uploadImage(file, coverPurpose[kind])
      setCoverImage(uploaded.url)
    } finally {
      setIsUploading(false)
    }
  }

  async function handleScreenshotUpload(file?: File) {
    if (!file) return
    setIsUploading(true)
    try {
      const uploaded = await uploadImage(file, 'project-screenshot')
      setScreenshotsText((current) =>
        splitList(current).concat(uploaded.url).join(', '),
      )
    } finally {
      setIsUploading(false)
    }
  }

  async function handleBodyImageUpload(file: File) {
    const uploaded = await uploadImage(file, bodyPurpose[kind])
    return uploaded.url
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-dashed border-gray-200 py-12 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
        正在加载{label}...
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="返回列表"
              title="返回列表"
              onClick={onBack}
            >
              <ArrowLeft />
            </Button>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {mode === 'create' ? `新建${label}` : `编辑${label}`}
              </h2>
              <p className="text-xs text-gray-500">
                {kind === 'project' ? '项目封面、详情、技术栈和截图等信息。' : '正文由块编辑器产出，并以 JSON 保存。'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => setPreviewOpen(true)}
            >
              <Eye className="size-4" />
              预览内容
            </Button>
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              disabled={isBusy || !title.trim()}
              onClick={() => void onSaveDraft(currentValue)}
            >
              <Save className="size-4" />
              保存草稿
            </Button>
            <Button
              type="button"
              className="gap-2"
              disabled={isBusy || !title.trim()}
              onClick={() => void onPublish(currentValue)}
            >
              <Send className="size-4" />
              {mode === 'create' ? '发布内容' : '更新发布'}
            </Button>
            {mode === 'edit' && onSoftDelete && (
              <Button
                type="button"
                variant="destructive"
                className="gap-2"
                disabled={isBusy}
                onClick={() => void onSoftDelete()}
              >
                <Trash2 className="size-4" />
                移入回收站
              </Button>
            )}
          </div>
        </div>

        {kind === 'project' ? (
          <ProjectForm
            title={title}
            onTitleChange={setTitle}
            slug={slug}
            onSlugChange={setSlug}
            summary={summary}
            onSummaryChange={setSummary}
            coverImage={coverImage}
            onCoverImageChange={setCoverImage}
            onCoverUpload={handleCoverUpload}
            isUploading={isUploading}
            projectStatus={projectStatus}
            onProjectStatusChange={setProjectStatus}
            techStackText={techStackText}
            onTechStackTextChange={setTechStackText}
            repositoryUrl={repositoryUrl}
            onRepositoryUrlChange={setRepositoryUrl}
            demoUrl={demoUrl}
            onDemoUrlChange={setDemoUrl}
            screenshotsText={screenshotsText}
            onScreenshotsTextChange={setScreenshotsText}
            onScreenshotUpload={handleScreenshotUpload}
            tagsText={tagsText}
            onTagsTextChange={setTagsText}
          />
        ) : (
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <Card>
            <CardHeader>
              <CardTitle>正文内容</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[420px] rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-950">
                <ContentBlockEditor
                  value={body}
                  onChange={setBody}
                  onUploadImage={handleBodyImageUpload}
                  emptyPrompt={`开始编写${label}内容...`}
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>基础信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Field label="标题">
                  <Input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder={`${label}标题`}
                  />
                </Field>
                <Field label="Slug">
                  <Input
                    value={slug}
                    onChange={(event) => setSlug(event.target.value)}
                    placeholder="留空则自动生成"
                  />
                </Field>
                <Field label="摘要">
                  <Textarea
                    value={summary}
                    onChange={(event) => setSummary(event.target.value)}
                    placeholder="用于列表和预览的简短描述"
                  />
                </Field>
                <Field label="封面图">
                  <div className="flex gap-2">
                    <Input
                      value={coverImage}
                      onChange={(event) => setCoverImage(event.target.value)}
                      placeholder="https://..."
                    />
                    <label className="inline-flex h-8 cursor-pointer items-center justify-center rounded-lg border border-input px-2 text-sm hover:bg-muted">
                      <ImagePlus className="size-4" />
                      <span className="sr-only">上传封面图</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) =>
                          void handleCoverUpload(event.target.files?.[0])
                        }
                      />
                    </label>
                  </div>
                </Field>
                <Field label="标签">
                  <Input
                    value={tagsText}
                    onChange={(event) => setTagsText(event.target.value)}
                    placeholder="React, 旅行, 随想"
                  />
                </Field>
              </CardContent>
            </Card>

            {kind === 'article' && (
              <Card>
                <CardHeader>
                  <CardTitle>文章设置</CardTitle>
                </CardHeader>
                <CardContent>
                  <Field label="分类">
                    <Input
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      placeholder="技术 / 生活 / 旅行"
                    />
                  </Field>
                </CardContent>
              </Card>
            )}

            {kind === 'note' && (
              <Card>
                <CardHeader>
                  <CardTitle>笔记设置</CardTitle>
                </CardHeader>
                <CardContent>
                  <Field label="类型">
                    <select
                      value={noteType}
                      onChange={(event) =>
                        setNoteType(event.target.value as NoteType)
                      }
                      className={selectClassName}
                    >
                      <option value="short">短笔记</option>
                      <option value="code">代码</option>
                      <option value="quote">摘录</option>
                      <option value="todo">待办</option>
                    </select>
                  </Field>
                </CardContent>
              </Card>
            )}

        </div>
      </div>
      )}
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{title || `未命名${label}`}</DialogTitle>
            <DialogDescription>{summary || '暂无摘要'}</DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
            <ContentBlockPreview value={body} />
          </div>
        </DialogContent>
      </Dialog>
    </>
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

function toEditorValue(value?: EditableContent): ContentEditorValue {
  return {
    title: value?.title ?? '',
    slug: value?.slug ?? '',
    summary: value?.summary ?? '',
    coverImage: value?.coverImage ?? '',
    tags: value?.tags ?? [],
    body: value?.body?.blocks ?? [],
    category: value && 'category' in value ? value.category : '',
    noteType: value && 'noteType' in value ? value.noteType : 'short',
    screenshots: value && 'screenshots' in value ? value.screenshots : [],
    techStack: value && 'techStack' in value ? value.techStack : [],
    projectStatus:
      value && 'projectStatus' in value ? value.projectStatus : 'pending',
    repositoryUrl:
      value && 'repositoryUrl' in value ? value.repositoryUrl : '',
    demoUrl: value && 'demoUrl' in value ? value.demoUrl : '',
  }
}

function buildValue(value: {
  title: string
  slug: string
  summary: string
  coverImage: string
  tagsText: string
  body: BlockContent
  category: string
  noteType: NoteType
  screenshotsText: string
  techStackText: string
  projectStatus: ProjectStatus
  repositoryUrl: string
  demoUrl: string
}): ContentEditorValue {
  return {
    title: value.title.trim(),
    slug: value.slug.trim() || undefined,
    summary: value.summary.trim() || undefined,
    coverImage: value.coverImage.trim() || undefined,
    tags: splitList(value.tagsText),
    body: value.body,
    category: value.category.trim() || undefined,
    noteType: value.noteType,
    screenshots: splitList(value.screenshotsText),
    techStack: splitList(value.techStackText),
    projectStatus: value.projectStatus,
    repositoryUrl: value.repositoryUrl.trim() || undefined,
    demoUrl: value.demoUrl.trim() || undefined,
  }
}

function splitList(value: string) {
  return value
    .split(/[,，\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
}
