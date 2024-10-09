import { getScrollbarHelper } from './scrollbar-helper'
import { LayerWrap } from './wrap'

export class LayerManager {
  private wrap = new LayerWrap()

  constructor() {
    // 记录页面原始 CSS 属性
    getScrollbarHelper().init()
  }

  getEl() {
    return this.wrap.getWrap()
  }

  create(name: string, el?: HTMLElement) {
    return this.wrap.createItem(name, el)
  }

  destroy() {
    this.wrap.getWrap().remove()
  }
}
