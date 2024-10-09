import * as marked from './lib/marked'
import { mergeDeep } from './lib/merge-deep'
import type { CheckerCaptchaPayload, CheckerPayload } from './components/checker'

import { DataManager } from './data'
import * as I18n from './i18n'

import { handelCustomConf } from './config'
import { watchConf } from './lib/watch-conf'
import { createInjectionContainer, InjectionContainerMethods, Constructor } from './lib/injection'

import {
  type ArtalkConfig,
  type ArtalkConfigPartial,
  type CommentData,
  type ListFetchParams,
  type ContextApi,
  type EventPayloadMap,
  type SidebarShowPayload,
  type DataManagerApi,
} from '@/types'

/**
 * Artalk Context
 */
class Context implements ContextApi {
  /* 运行参数 */
  conf!: ArtalkConfig
  $root!: HTMLElement

  constructor(conf: ArtalkConfig, $root: HTMLElement) {
    this.conf = conf
    this.$root = $root
  }

  /* Event Manager */
  private deps: InjectionContainerMethods = createInjectionContainer()

  mounted = false

  getEvents() {
    return this.deps.inject('events')
  }

  provide<
    K extends keyof InjectDeps,
    T extends InjectDeps[K] = any,
    D extends readonly (keyof InjectDeps)[] = [],
  >(key: K, impl: Constructor<T, D>, deps?: D): void {
    this.deps.provide(key, impl, deps)
  }

  inject<T = undefined, K extends keyof InjectDeps = any>(
    key: K,
  ): T extends undefined ? InjectDeps[K] : T {
    return this.deps.inject(key)
  }

  get = this.inject

  getApi() {
    return this.inject('api')
  }

  getApiHandlers() {
    return this.inject('apiHandlers')
  }

  getData() {
    return this.inject('data')
  }

  replyComment(commentData: CommentData, $comment: HTMLElement): void {
    this.inject('editor').setReply(commentData, $comment)
  }

  editComment(commentData: CommentData, $comment: HTMLElement): void {
    this.inject('editor').setEditComment(commentData, $comment)
  }

  fetch(params: Partial<ListFetchParams>): void {
    this.getData().fetchComments(params)
  }

  reload(): void {
    this.getData().fetchComments({ offset: 0 })
  }

  /* List */
  listGotoFirst(): void {
    this.getEvents().trigger('list-goto-first')
  }

  getCommentNodes() {
    return this.inject('list').getCommentNodes()
  }

  getComments() {
    return this.getData().getComments()
  }

  getCommentList = this.getCommentNodes
  getCommentDataList = this.getComments

  /* Editor */
  editorShowLoading(): void {
    this.inject('editor').showLoading()
  }

  editorHideLoading(): void {
    this.inject('editor').hideLoading()
  }

  editorShowNotify(msg, type): void {
    this.inject('editor').showNotify(msg, type)
  }

  editorResetState(): void {
    this.inject('editor').resetState()
  }

  /* Sidebar */
  showSidebar(payload?: SidebarShowPayload): void {
    this.inject('sidebar').show(payload)
  }

  hideSidebar(): void {
    this.inject('sidebar').hide()
  }

  /* Checker */
  checkAdmin(payload: CheckerPayload): Promise<void> {
    return this.inject('checkers').checkAdmin(payload)
  }

  checkCaptcha(payload: CheckerCaptchaPayload): Promise<void> {
    return this.inject('checkers').checkCaptcha(payload)
  }

  /* Events */
  on(name: any, handler: any) {
    this.getEvents().on(name, handler)
  }

  off(name: any, handler: any) {
    this.getEvents().off(name, handler)
  }

  trigger(name: any, payload?: any) {
    this.getEvents().trigger(name, payload)
  }

  /* i18n */
  $t(key: I18n.I18nKeys, args: { [key: string]: string } = {}): string {
    return I18n.t(key, args)
  }

  setDarkMode(darkMode: boolean | 'auto'): void {
    this.updateConf({ darkMode })
  }

  updateConf(nConf: ArtalkConfigPartial): void {
    this.conf = mergeDeep(this.conf, handelCustomConf(nConf, false))
    this.mounted && this.getEvents().trigger('updated', this.conf)
  }

  getConf(): ArtalkConfig {
    return this.conf
  }

  getEl(): HTMLElement {
    return this.$root
  }

  getMarked() {
    return marked.getInstance()
  }

  watchConf<T extends (keyof ArtalkConfig)[]>(
    keys: T,
    effect: (conf: Pick<ArtalkConfig, T[number]>) => void,
  ): void {
    watchConf(this, keys, effect)
  }
}

export default Context
