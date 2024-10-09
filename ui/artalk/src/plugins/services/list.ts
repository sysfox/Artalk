import type { ArtalkPlugin } from '@/types'
import List from '@/list/list'

export const ListService: ArtalkPlugin = (ctx) => {
  let list: List | null = null

  ctx.provide(
    'list',
    (api, events, config, data) => {
      if (!list) {
        list = new List({
          getApi: () => api,
          getEvents: () => events,
          getConf: () => config,
          getData: () => data,

          replyComment: (c, $el) => ctx.replyComment(c, $el),
          editComment: (c, $el) => ctx.editComment(c, $el),
        })
        ctx.$root.appendChild(list.$el)
      }

      return list
    },
    ['api', 'events', 'config', 'data'] as const,
  )
}
