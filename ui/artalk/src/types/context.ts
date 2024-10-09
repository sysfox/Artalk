import type { Marked } from 'marked'
import type {
  SidebarShowPayload,
  EventPayloadMap,
  ArtalkConfigPartial,
  ArtalkConfig,
  CommentData,
  DataManagerApi,
  ListFetchParams,
  NotifyLevel,
} from '.'
import type { CheckerCaptchaPayload, CheckerPayload } from '@/components/checker'
import type { InjectionContainerMethods } from '@/lib/injection'
import type { EventManagerFuncs } from '@/lib/event-manager'
import type { I18n } from '@/i18n'
import type { Api, ApiHandlers } from '@/api'
import type { CommentNode } from '@/comment'
import EventManager from '@/lib/event-manager'

/**
 * Artalk Context
 */
export interface ContextApi extends EventManagerFuncs<EventPayloadMap>, InjectionContainerMethods {
  /** Artalk 根元素对象 */
  $root: HTMLElement

  /**
   * Inject a dependency object
   *
   * @deprecated Use `inject()` instead
   */
  get<T extends keyof InjectDeps>(key: T): InjectDeps[T]

  /**
   * Get config object
   *
   * @deprecated Use `getConf()` and `updateConf()` instead
   */
  conf: ArtalkConfig

  getEvents(): EventManager<EventPayloadMap>

  /** marked 依赖对象 */
  getMarked(): Marked | undefined

  /** 获取 API 以供 HTTP 请求 */
  getApi(): Api

  /** Get API handlers */
  getApiHandlers(): ApiHandlers

  /** 获取数据管理器对象 */
  getData(): DataManagerApi

  /** 评论回复 */
  replyComment(commentData: CommentData, $comment: HTMLElement): void

  /** 编辑评论 */
  editComment(commentData: CommentData, $comment: HTMLElement): void

  /** 获取评论数据 */
  fetch(params: Partial<ListFetchParams>): void

  /** 重载评论数据 */
  reload(): void

  /** 列表滚动到第一个评论的位置 */
  listGotoFirst(): void

  /** Get the comment data list */
  getComments(): CommentData[]

  /** Get the comment node list */
  getCommentNodes(): CommentNode[]

  /**
   * Get the comment data list
   * @deprecated Use `getComments()` instead
   */
  getCommentDataList(): CommentData[]

  /**
   * Get the comment node list
   * @deprecated Use `getCommentNodes()` instead
   */
  getCommentList(): CommentNode[]

  /** 显示侧边栏 */
  showSidebar(payload?: SidebarShowPayload): void

  /** 隐藏侧边栏 */
  hideSidebar(): void

  /** 编辑器 - 显示加载 */
  editorShowLoading(): void

  /** 编辑器 - 隐藏加载 */
  editorHideLoading(): void

  /** 编辑器 - 显示提示消息 */
  editorShowNotify(msg: string, type: NotifyLevel): void

  /** 评论框 - 复原状态 */
  editorResetState(): void

  /** 验证码检测 */
  checkCaptcha(payload: CheckerCaptchaPayload): Promise<void>

  /** 管理员检测 */
  checkAdmin(payload: CheckerPayload): Promise<void>

  /** i18n 翻译 */
  $t(key: keyof I18n, args?: { [key: string]: string }): string

  /** 设置夜间模式 */
  setDarkMode(darkMode: boolean | 'auto'): void

  /** 获取配置 */
  getConf(): ArtalkConfig

  /** 获取挂载元素 */
  getEl(): HTMLElement

  /** 更新配置 */
  updateConf(conf: ArtalkConfigPartial): void

  /** 监听配置更新 */
  watchConf<T extends (keyof ArtalkConfig)[]>(
    keys: T,
    effect: (val: Pick<ArtalkConfig, T[number]>) => void,
  ): void
}
