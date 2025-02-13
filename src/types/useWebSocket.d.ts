import type { Ref } from 'vue'

export interface UseWebSocketParams {
  url?: string
  key?: string
}

export interface UseWebSocketExportInterface {
  ws: Ref<WebSocket | null>
  isConnected: Ref<boolean>
  reconnectAttempts: Ref<number>
  send: (data: any) => void
  connect: () => void
  disconnect: () => void
  subscribe: (callback: (data: any) => void) => () => void
}
