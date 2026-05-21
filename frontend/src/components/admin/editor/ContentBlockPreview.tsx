import '@blocknote/react/style.css'
import { useCreateBlockNote, BlockNoteViewRaw } from '@blocknote/react'
import type { PartialBlock } from '@blocknote/core'
import { useMemo } from 'react'
import type { BlockContent } from '../../../types/content'

interface ContentBlockPreviewProps {
  value?: BlockContent
}

export function ContentBlockPreview({ value }: ContentBlockPreviewProps) {
  const initialContent = useMemo<PartialBlock[] | undefined>(() => {
    if (!value || value.length === 0) return undefined
    return value as PartialBlock[]
  }, [value])

  const editor = useCreateBlockNote(
    {
      initialContent,
    },
    [JSON.stringify(value)],
  )

  return (
    <div className="bn-container">
      <BlockNoteViewRaw
        editor={editor}
        editable={false}
        formattingToolbar={false}
        linkToolbar={false}
        slashMenu={false}
        sideMenu={false}
        tableHandles={false}
      />
    </div>
  )
}
