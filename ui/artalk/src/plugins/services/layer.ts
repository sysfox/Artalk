import type { ArtalkPlugin } from '@/types'
import { LayerManager } from '@/layer'

export const LayersService: ArtalkPlugin = (ctx) => {
  // Singleton instance
  let layerManager: LayerManager | null = null

  ctx.provide('layers', () => {
    if (!layerManager) {
      // lazy load only once
      layerManager = new LayerManager()
      document.body.appendChild(layerManager.getEl())

      ctx.on('unmounted', () => {
        layerManager?.destroy()
      })
    }
    return layerManager
  })
}
