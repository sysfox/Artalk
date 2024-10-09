import UpDownPaginator from './up-down'
import ReadMorePaginator from './read-more'
import type { ContextApi, ListFetchParams } from '@/types'

export interface IPgHolderOpt {
  total: number
  pageSize: number

  readMoreAutoLoad?: boolean
}

export interface Paginator {
  create(opts: IPgHolderOpt): HTMLElement
  setLoading(val: boolean): void
  update(offset: number, total: number): void
  next(): void
  showErr?(msg: string): void
  getHasMore(): boolean
  /** Clear comments when fetch new page data */
  getIsClearComments(params: { offset?: number }): boolean
  dispose(): void
}

export default { UpDownPaginator, ReadMorePaginator }
