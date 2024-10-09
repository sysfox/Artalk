import type { ArtalkPlugin } from '@/types'
import { Api } from '@/api'
import { convertApiOptions, createNewApiHandlers } from '@/config'

export const ApiService: ArtalkPlugin = (ctx) => {
  // Singleton instance: keep the same handlers for the whole app
  const apiHandlers = createNewApiHandlers(ctx)
  ctx.provide('apiHandlers', () => apiHandlers)

  // Stateless instance: create a new instance for each injection
  ctx.provide('api', () => new Api(convertApiOptions(ctx.conf, ctx)))
}
