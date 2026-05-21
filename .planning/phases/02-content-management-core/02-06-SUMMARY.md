# 02-06 Summary: Block Editor & Upload Adapter Layer

## What Was Built

Added the frontend block-editor adapter layer and aligned upload purposes with the content-editing workflow defined in Phase 2.

### Task 1: Install and isolate the block editor dependency

- Installed `@blocknote/core@0.51.2` and `@blocknote/react@0.51.2`.
- Created `frontend/src/types/content.ts` with project-owned types (no vendor imports):
  - `BlockContent` — vendor-agnostic JSON array for editor-native block output
  - `ContentStatus` — `'draft' | 'published' | 'archived'`
  - `ContentKind` — `'article' | 'note' | 'project'`
  - `ContentSummary` and `ContentListItem` — shared list/summary shapes

### Task 2: Create editor and preview components

Created `frontend/src/components/admin/editor/`:

- **`ContentBlockEditor.tsx`** — adapter wrapper around BlockNote.
  - Props: `value`, `onChange`, `emptyPrompt`, `readOnly`, optional `onUploadImage`
  - Enables: paragraph, heading, list, quote, code block, image, divider, hyperlink, external video/embed, table, todo/task blocks
  - Bridges `BlockContent` to BlockNote `PartialBlock[]` internally
  - Handles external `value` updates without infinite loops via an internal-change guard
  - Image upload wired through BlockNote's `uploadFile` option

- **`ContentBlockPreview.tsx`** — read-only renderer for admin preview.
  - Renders saved `BlockContent` with all UI chrome disabled (`editable={false}`)

- **`contentBlockFixtures.ts`** — fixtures exercising every required block kind:
  - paragraph with inline link
  - heading (levels 1–2)
  - bullet list (with nested child)
  - numbered list
  - check list (checked & unchecked)
  - quote
  - code block (TypeScript)
  - image
  - divider
  - external video (YouTube embed)
  - table

### Task 3: Align frontend upload purposes with content editing

- Updated `frontend/src/api/upload.ts`:
  - Added `'article-image'`, `'note-image'`, `'project-cover'`, `'project-screenshot'` to `UploadPurpose`
  - Kept `uploadImage` as the single helper function
  - No video upload purpose added (out of scope per requirements)
  - Frontend purpose values match backend enum values exactly

## Key Files

| File | Purpose |
|------|---------|
| `frontend/package.json` | BlockNote dependencies |
| `frontend/src/types/content.ts` | Project-owned content types |
| `frontend/src/components/admin/editor/ContentBlockEditor.tsx` | Block editor adapter |
| `frontend/src/components/admin/editor/ContentBlockPreview.tsx` | Read-only preview adapter |
| `frontend/src/components/admin/editor/contentBlockFixtures.ts` | Block JSON fixtures |
| `frontend/src/api/upload.ts` | Updated upload purposes |

## Verification Results

| Task | Lint | Build | Notes |
|------|------|-------|-------|
| Task 1 | ✅ Pass | ✅ Pass | Types only, no runtime impact |
| Task 2 | ✅ Pass | ✅ Pass | BlockNote bundled; chunk size warning pre-existing |
| Task 3 | ✅ Pass | ✅ Pass | API type expansion only |

- **No `@blocknote` imports in route page files** — verified via grep; only adapter components under `components/admin/editor/` import the vendor packages.

## Decisions

- **Vendor isolation**: `BlockContent` is intentionally a loose `Array<Record<string, unknown>>` rather than importing BlockNote's `PartialBlock` type into the project types layer. This keeps the door open for a future editor switch with minimal churn.
- **Placeholder handling**: BlockNote 0.51's `dictionary` type is very strict (`typeof en`). We pass a minimal placeholders object with an intentional adapter-boundary cast rather than dragging the full dictionary type into our codebase.
- **Initial content stability**: `useMemo` for `initialContent` uses an empty dependency array (with an eslint-disable comment) because `useCreateBlockNote` only consumes `initialContent` during editor instantiation. External value changes are synced via `editor.replaceBlocks` in a `useEffect`.
- **No dynamic import for BlockNote (yet)**: The build produces a single ~537 kB chunk. A future optimization could lazy-load the editor adapter, but that is deferred until admin routes are actually mounted.
