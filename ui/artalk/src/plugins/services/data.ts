import { ArtalkPlugin, EventPayloadMap } from "@/types"
import { DataManager } from "@/data"

export const DataService: ArtalkPlugin = (ctx) => {
  // Singleton instance
  let dataManager: DataManager | null = null
  ctx.provide('data', (events) => {
    if (!dataManager) dataManager = new DataManager(events)
    return dataManager
  }, ['events'])
}
