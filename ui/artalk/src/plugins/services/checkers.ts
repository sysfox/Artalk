import type { ArtalkPlugin } from '@/types'
import CheckerLauncher from '@/components/checker'

export const CheckersService: ArtalkPlugin = (ctx) => {
  // Stateless instance
  ctx.provide(
    'checkers',
    (api, layers, user) => {
      return new CheckerLauncher({
        getApi: () => api,
        getLayers: () => layers,
        getUser: () => user,
        onReload: () => ctx.reload(),

        // make sure suffix with a slash, because it will be used as a base url when call `fetch`
        getCaptchaIframeURL: () => `${ctx.conf.server}/api/v2/captcha/?t=${+new Date()}`,
      })
    },
    ['api', 'layers', 'user'] as const,
  )
}
