import type { BlockContent } from '../../../types/content'

/**
 * Fixture covering all required first-version block kinds:
 * paragraph, heading, bullet list, numbered list, check list,
 * quote, code block, image, divider, hyperlink, external video/embed, table.
 */
export const fullFixture: BlockContent = [
  {
    id: 'heading-1',
    type: 'heading',
    props: { level: 1, textAlignment: 'left' },
    content: [
      { type: 'text', text: 'Content Editor Fixture', styles: {} },
    ],
    children: [],
  },
  {
    id: 'para-1',
    type: 'paragraph',
    props: { textAlignment: 'left' },
    content: [
      { type: 'text', text: 'This is a paragraph with ', styles: {} },
      {
        type: 'link',
        href: 'https://example.com',
        content: [
          { type: 'text', text: 'a hyperlink', styles: { bold: true } },
        ],
      },
      { type: 'text', text: ' inside it.', styles: {} },
    ],
    children: [],
  },
  {
    id: 'heading-2',
    type: 'heading',
    props: { level: 2, textAlignment: 'left' },
    content: [{ type: 'text', text: 'Lists', styles: {} }],
    children: [],
  },
  {
    id: 'bullet-1',
    type: 'bulletListItem',
    props: { textAlignment: 'left' },
    content: [
      { type: 'text', text: 'First bullet item', styles: {} },
    ],
    children: [],
  },
  {
    id: 'bullet-2',
    type: 'bulletListItem',
    props: { textAlignment: 'left' },
    content: [
      { type: 'text', text: 'Second bullet item', styles: {} },
    ],
    children: [
      {
        id: 'bullet-2-1',
        type: 'bulletListItem',
        props: { textAlignment: 'left' },
        content: [
          { type: 'text', text: 'Nested bullet', styles: {} },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'numbered-1',
    type: 'numberedListItem',
    props: { textAlignment: 'left' },
    content: [
      { type: 'text', text: 'First numbered item', styles: {} },
    ],
    children: [],
  },
  {
    id: 'check-1',
    type: 'checkListItem',
    props: { checked: false, textAlignment: 'left' },
    content: [
      { type: 'text', text: 'Incomplete task', styles: {} },
    ],
    children: [],
  },
  {
    id: 'check-2',
    type: 'checkListItem',
    props: { checked: true, textAlignment: 'left' },
    content: [
      { type: 'text', text: 'Completed task', styles: {} },
    ],
    children: [],
  },
  {
    id: 'quote-1',
    type: 'quote',
    props: { textAlignment: 'left' },
    content: [
      {
        type: 'text',
        text: 'Design is not just what it looks like and feels like. Design is how it works.',
        styles: { italic: true },
      },
    ],
    children: [],
  },
  {
    id: 'code-1',
    type: 'codeBlock',
    props: { language: 'typescript' },
    content: [
      {
        type: 'text',
        text: "const greeting = 'Hello, BlockNote!';\nconsole.log(greeting);",
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: 'image-1',
    type: 'image',
    props: {
      url: 'https://picsum.photos/seed/blocknote/800/400',
      caption: 'A sample image block',
      name: 'sample.jpg',
    },
    content: [],
    children: [],
  },
  {
    id: 'divider-1',
    type: 'divider',
    props: {},
    content: [],
    children: [],
  },
  {
    id: 'heading-3',
    type: 'heading',
    props: { level: 2, textAlignment: 'left' },
    content: [
      { type: 'text', text: 'External Video / Embed', styles: {} },
    ],
    children: [],
  },
  {
    id: 'video-1',
    type: 'video',
    props: {
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      caption: 'YouTube embed example',
      name: '',
    },
    content: [],
    children: [],
  },
  {
    id: 'heading-4',
    type: 'heading',
    props: { level: 2, textAlignment: 'left' },
    content: [{ type: 'text', text: 'Table', styles: {} }],
    children: [],
  },
  {
    id: 'table-1',
    type: 'table',
    props: {},
    content: {
      type: 'tableContent',
      rows: [
        {
          cells: [
            [
              {
                type: 'text',
                text: 'Feature',
                styles: { bold: true },
              },
            ],
            [
              {
                type: 'text',
                text: 'Status',
                styles: { bold: true },
              },
            ],
          ],
        },
        {
          cells: [
            [{ type: 'text', text: 'Paragraph', styles: {} }],
            [{ type: 'text', text: 'Supported', styles: {} }],
          ],
        },
        {
          cells: [
            [{ type: 'text', text: 'Table', styles: {} }],
            [{ type: 'text', text: 'Supported', styles: {} }],
          ],
        },
        {
          cells: [
            [{ type: 'text', text: 'Video Embed', styles: {} }],
            [{ type: 'text', text: 'Supported', styles: {} }],
          ],
        },
      ],
    },
    children: [],
  },
]

export const emptyFixture: BlockContent = []

export const minimalFixture: BlockContent = [
  {
    id: 'p1',
    type: 'paragraph',
    props: { textAlignment: 'left' },
    content: [
      { type: 'text', text: 'Minimal fixture paragraph.', styles: {} },
    ],
    children: [],
  },
]
