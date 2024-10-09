import { ArtalkPlugin, EventPayloadMap } from "@/types"
import EventManager from "@/lib/event-manager"

export const EventsService: ArtalkPlugin = (ctx) => {
  // Singleton instance
  const events = new EventManager<EventPayloadMap>()
  ctx.provide('events', () => events)
}
