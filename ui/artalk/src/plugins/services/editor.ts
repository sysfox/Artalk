import type { ArtalkPlugin } from '@/types'
import Editor from '@/editor/editor'

export const EditorService: ArtalkPlugin = (ctx) => {
  // Singleton instance
  const editor = new Editor(ctx)
  ctx.$root.appendChild(editor.$el)

  ctx.provide('editor', () => editor)
}
