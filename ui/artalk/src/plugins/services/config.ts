import type { ArtalkConfig, ArtalkPlugin, ContextApi } from '@/types'

export interface ConfigHelper {
  watchConf: ContextApi['watchConf']
  get: () => ArtalkConfig
}

// TODO: migrate ArtalkConfig to ConfigService
export const ConfigService: ArtalkPlugin = (ctx) => {
  ctx.provide('config', () => {
    return {
      watchConf: ctx.watchConf,
      get: () => ctx.conf,
    }
  })
}
