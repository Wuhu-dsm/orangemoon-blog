import '@blocknote/react/style.css'
import { useCreateBlockNote, BlockNoteViewRaw } from '@blocknote/react'
import type { PartialBlock } from '@blocknote/core'
import { useEffect, useRef, useMemo } from 'react'
import type { BlockContent } from '../../../types/content'

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

  const editor = useCreateBlockNote(
    {
      initialContent,
      uploadFile: onUploadImage
        ? async (file: File) => {
            const url = await onUploadImage(file)
            return url
          }
        : undefined,
      dictionary: {
        placeholders: {
          emptyDocument: emptyPrompt,
          default: emptyPrompt,
        },
        // BlockNote dictionary type is vendor-specific; cast is intentional at the adapter boundary.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    },
    [],
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
    <div className="bn-container">
      <BlockNoteViewRaw
        editor={editor}
        editable={!readOnly}
        onChange={() => {
          isInternalChange.current = true
          onChange?.(editor.document as BlockContent)
        }}
        formattingToolbar
        linkToolbar
        slashMenu
        sideMenu
        tableHandles
      />
    </div>
  )
}
