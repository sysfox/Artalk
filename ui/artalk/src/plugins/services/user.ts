import type { ArtalkPlugin } from '@/types'
import User from '@/lib/user'

export const UserService: ArtalkPlugin = (ctx) => {
  const user = new User({
    onUserChanged: (data) => {
      ctx.trigger('user-changed', data)
    },
  })

  ctx.provide('user', () => user)
}
