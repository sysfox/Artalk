import ListHTML from './list.html?raw'
import { ListLayout } from './layout'
import { createCommentNode } from './comment'
import { initListPaginatorFunc } from './page'
import type { CommentData, ContextApi, DataManagerApi, EventPayloadMap } from '@/types'
import type EventManager from '@/lib/event-manager'
import * as Utils from '@/lib/utils'
import { CommentNode } from '@/comment'
import type { ConfigHelper } from '@/plugins/services/config'
import type { Api } from '@/api'

export interface ListOptions {
  getApi: () => Api
  getEvents: () => EventManager<EventPayloadMap>
  getConf: () => ConfigHelper
  getData: () => DataManagerApi

  replyComment: (c: CommentData, $el: HTMLElement) => void
  editComment: (c: CommentData, $el: HTMLElement) => void
}

export default class List {
  opts: ListOptions
  $el: HTMLElement

  /** 列表评论集区域元素 */
  $commentsWrap!: HTMLElement
  public getCommentsWrapEl() {
    return this.$commentsWrap
  }

  protected commentNodes: CommentNode[] = []
  getCommentNodes() {
    return this.commentNodes
  }

  constructor(opts: ListOptions) {
    this.opts = opts

    // Init base element
    this.$el = Utils.createElement(ListHTML)
    this.$commentsWrap = this.$el.querySelector('.atk-list-comments-wrap')!

    // Init paginator
    initListPaginatorFunc({
      getList: () => this,
      ...opts,
    })

    // Bind events
    this.initCrudEvents()
  }

  getListLayout({ forceFlatMode }: { forceFlatMode?: boolean } = {}) {
    return new ListLayout({
      $commentsWrap: this.$commentsWrap,
      nestSortBy: this.opts.getConf().get().nestSort,
      nestMax: this.opts.getConf().get().nestMax,
      flatMode:
        typeof forceFlatMode === 'boolean'
          ? forceFlatMode
          : (this.opts.getConf().get().flatMode as boolean),
      // flatMode must be boolean because it had been handled when Artalk.init
      createCommentNode: (d, r) => {
        const node = createCommentNode({ forceFlatMode, ...this.opts }, d, r)
        this.commentNodes.push(node) // store node instance
        return node
      },
      findCommentNode: (id) => this.commentNodes.find((c) => c.getID() === id),
    })
  }

  private initCrudEvents() {
    this.opts.getEvents().on('list-load', (comments) => {
      // 导入数据
      this.getListLayout().import(comments)
    })

    this.opts.getEvents().on('list-loaded', (comments) => {
      if (comments.length === 0) {
        this.commentNodes = []
        this.$commentsWrap.innerHTML = ''
      }
    })

    // When comment insert
    this.opts.getEvents().on('comment-inserted', (comment) => {
      const replyComment = comment.rid
        ? this.commentNodes.find((c) => c.getID() === comment.rid)?.getData()
        : undefined
      this.getListLayout().insert(comment, replyComment)
    })

    // When comment delete
    this.opts.getEvents().on('comment-deleted', (comment) => {
      const node = this.commentNodes.find((c) => c.getID() === comment.id)
      if (!node) {
        console.error(`comment node id=${comment.id} not found`)
        return
      }
      node.remove()
      this.commentNodes = this.commentNodes.filter((c) => c.getID() !== comment.id)
      // TODO: remove child nodes
    })

    // When comment update
    this.opts.getEvents().on('comment-updated', (comment) => {
      const node = this.commentNodes.find((c) => c.getID() === comment.id)
      node && node.setData(comment)
    })
  }
}
