import * as I18n from '@/i18n'
import type { ArtalkPlugin } from "@/types"

export const I18nService: ArtalkPlugin = (ctx) => {
  I18n.setLocale(ctx.conf.locale)

  ctx.watchConf(['locale'], (conf) => {
    I18n.setLocale(conf.locale)
  })
}
