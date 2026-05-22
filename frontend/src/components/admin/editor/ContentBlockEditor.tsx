import '@blocknote/mantine/style.css'
import { BlockNoteView } from '@blocknote/mantine'
import { useCreateBlockNote } from '@blocknote/react'
import type { Dictionary, PartialBlock } from '@blocknote/core'
import { zh } from '@blocknote/core/locales'
import { useEffect, useRef, useMemo } from 'react'
import type { BlockContent } from '../../../types/content'
import { useThemeStore } from '../../../stores/themeStore'

interface ContentBlockEditorProps {
  value?: BlockContent
  onChange?: (value: BlockContent) => void
  emptyPrompt?: string
  readOnly?: boolean
  onUploadImage?: (file: File) => Promise<string>
}

export function ContentBlockEditor({
  value,
  onChange,
  emptyPrompt = '开始输入内容…',
  readOnly = false,
  onUploadImage,
}: ContentBlockEditorProps) {
  const initialContent = useMemo<PartialBlock[] | undefined>(() => {
    if (!value || value.length === 0) return undefined
    return value as PartialBlock[]
    // Intentionally stable: useCreateBlockNote only reads initialContent once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const dictionary = useMemo<Dictionary>(
    () => ({
      ...zh,
      placeholders: {
        ...zh.placeholders,
        emptyDocument: emptyPrompt,
        default: emptyPrompt,
      },
    }),
    [emptyPrompt],
  )

  const { isDark } = useThemeStore()

  const editor = useCreateBlockNote(
    {
      initialContent,
      uploadFile: onUploadImage
        ? async (file: File) => {
            const url = await onUploadImage(file)
            return url
          }
        : undefined,
      dictionary,
      pasteHandler: ({ defaultPasteHandler }) => {
        return defaultPasteHandler({
          prioritizeMarkdownOverHTML: true,
          plainTextAsMarkdown: true,
        })
      },
    },
    [dictionary],
  )

  const isInternalChange = useRef(false)

  useEffect(() => {
    if (!value || isInternalChange.current) {
      isInternalChange.current = false
      return
    }
    const current = editor.document as BlockContent
    if (JSON.stringify(current) !== JSON.stringify(value)) {
      editor.replaceBlocks(
        editor.document.map((b) => b.id),
        value as PartialBlock[],
      )
    }
  }, [value, editor])

  return (
    <div className="admin-block-editor">
      <BlockNoteView
        editor={editor}
        editable={!readOnly}
        theme={isDark ? 'dark' : 'light'}
        onChange={() => {
          isInternalChange.current = true
          onChange?.(editor.document as BlockContent)
        }}
        linkToolbar
        slashMenu
        sideMenu
        filePanel
        tableHandles
      />
    </div>
  )
}
