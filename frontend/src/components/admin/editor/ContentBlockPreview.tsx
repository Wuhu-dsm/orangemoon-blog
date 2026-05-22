import '@blocknote/react/style.css'
import { useCreateBlockNote } from '@blocknote/react'
import type { PartialBlock } from '@blocknote/core'
import { useMemo } from 'react'
import type { BlockContent } from '../../../types/content'

interface ContentBlockPreviewProps {
  value?: BlockContent
}

export function ContentBlockPreview({ value }: ContentBlockPreviewProps) {
  const serializedValue = JSON.stringify(value ?? [])
  const initialContent = useMemo<PartialBlock[] | undefined>(() => {
    if (!value || value.length === 0) return undefined
    return value as PartialBlock[]
    // Recreate the headless editor only when block content actually changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedValue])

  const editor = useCreateBlockNote(
    {
      initialContent,
    },
    [serializedValue],
  )

  const html = useMemo(
    () => editor.blocksToFullHTML(initialContent),
    [editor, initialContent],
  )

  return (
    <div
      className="prose prose-sm max-w-none rounded-lg border border-gray-100 bg-white p-4 text-gray-800 dark:prose-invert dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 [&_a]:text-primary-600 [&_blockquote]:border-l-4 [&_blockquote]:border-primary-200 [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-sm [&_code]:text-gray-800 [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-gray-950 [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-gray-100 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-gray-200 [&_td]:p-2 [&_th]:border [&_th]:border-gray-200 [&_th]:p-2 [&_ul]:list-disc [&_ul]:pl-5 dark:[&_code]:bg-gray-800 dark:[&_code]:text-gray-100 dark:[&_td]:border-gray-700 dark:[&_th]:border-gray-700"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
