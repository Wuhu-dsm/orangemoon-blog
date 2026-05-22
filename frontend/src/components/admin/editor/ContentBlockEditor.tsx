import '@blocknote/react/style.css'
import {
  BlockNoteViewRaw,
  FormattingToolbar,
  FormattingToolbarController,
  getFormattingToolbarItems,
  useBlockNoteEditor,
  useComponentsContext,
  useCreateBlockNote,
  useEditorState,
} from '@blocknote/react'
import type { Block, BlockNoteEditor, PartialBlock } from '@blocknote/core'
import { useEffect, useRef, useMemo } from 'react'
import { Trash2 } from 'lucide-react'
import type { BlockContent } from '../../../types/content'
import { useThemeStore } from '../../../stores/themeStore'

interface ContentBlockEditorProps {
  value?: BlockContent
  onChange?: (value: BlockContent) => void
  emptyPrompt?: string
  readOnly?: boolean
  onUploadImage?: (file: File) => Promise<string>
}

function findSelectedTableBlock(
  editor: BlockNoteEditor,
): Block | undefined {
  const selectedBlocks = editor.getSelection()?.blocks ?? [
    editor.getTextCursorPosition().block,
  ]

  for (const block of selectedBlocks) {
    if (block.type === 'table') return block

    let parent = editor.getParentBlock(block)
    while (parent) {
      if (parent.type === 'table') return parent
      parent = editor.getParentBlock(parent)
    }
  }

  return undefined
}

function DeleteTableButton() {
  const editor = useBlockNoteEditor()
  const Components = useComponentsContext()
  const tableBlock = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor.isEditable) return undefined
      const block = findSelectedTableBlock(editor)
      return block ? { id: block.id } : undefined
    },
    on: 'selection',
  })

  if (!Components || !tableBlock) return null

  return (
    <Components.FormattingToolbar.Button
      className="bn-button"
      label="删除表格"
      mainTooltip="删除整张表格"
      icon={<Trash2 size={16} />}
      onClick={() => {
        editor.focus()
        editor.removeBlocks([tableBlock.id])
      }}
    />
  )
}

function AdminFormattingToolbar() {
  return (
    <FormattingToolbar>
      {getFormattingToolbarItems()}
      <DeleteTableButton />
    </FormattingToolbar>
  )
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
      dictionary: {
        placeholders: {
          emptyDocument: emptyPrompt,
          default: emptyPrompt,
        },
        // BlockNote dictionary type is vendor-specific; cast is intentional at the adapter boundary.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      pasteHandler: ({ defaultPasteHandler }) => {
        return defaultPasteHandler({
          prioritizeMarkdownOverHTML: true,
          plainTextAsMarkdown: true,
        })
      },
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
    <div className="bn-container admin-block-editor">
      <BlockNoteViewRaw
        editor={editor}
        editable={!readOnly}
        theme={isDark ? 'dark' : 'light'}
        onChange={() => {
          isInternalChange.current = true
          onChange?.(editor.document as BlockContent)
        }}
        formattingToolbar={false}
        linkToolbar
        slashMenu
        sideMenu
        tableHandles
      >
        <FormattingToolbarController
          formattingToolbar={AdminFormattingToolbar}
        />
      </BlockNoteViewRaw>
    </div>
  )
}
