import type CheckerLauncher from '../components/checker'
import type SidebarLayer from '../layer/sidebar-layer'
import type List from '../list/list'
import type { PlugManager } from '../plugins/editor-kit'
import type { LayerManager } from '../layer/layer-manager'
import type User from '../lib/user'
import type { Api, ApiHandlers } from '../api'
import type { ConfigHelper } from '../plugins/services/config'
import type { DataManagerApi, EditorApi, EventPayloadMap } from '@/types'
import type EventManager from '@/lib/event-manager'

export interface InjectDeps {
  config: ConfigHelper
  events: EventManager<EventPayloadMap>
  data: DataManagerApi
  api: Api
  apiHandlers: ApiHandlers
  editor: EditorApi
  editorPlugs: PlugManager | undefined
  list: List
  sidebar: SidebarLayer
  checkers: CheckerLauncher
  layers: LayerManager
  user: User
}

type _InjectDeps = InjectDeps

declare global {
  type InjectDeps = _InjectDeps
}
