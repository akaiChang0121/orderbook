import { ref, onUnmounted } from 'vue'

import type { UseWebSocketExportInterface } from '@/types/useWebSocket'

export const useWebsocket = (url?: string): UseWebSocketExportInterface => {
  const ws = ref<WebSocket | null>(null)
  const pingInterval = ref<number>()
  const pingTimeout = ref<number>()
  const isConnected = ref(false)
  const reconnectAttempts = ref(0)
  const handlers = new Set<(data: any) => void>()
  const maxReconnectAttempts = 5
  const reconnectDelay = 3000
  let reconnectTimeout: number

  if (!url) {
    throw new Error('url is required')
  }

  const heartbeat = () => {
    clearTimeout(pingTimeout.value)

    pingTimeout.value = window.setTimeout(() => {
      disconnect()
      if (reconnectAttempts.value < maxReconnectAttempts) {
        reconnectTimeout = window.setTimeout(() => {
          reconnectAttempts.value++
          connect()
        }, reconnectDelay)
      }
    }, 30000)
  }

  const connect = () => {
    if (ws.value?.readyState === WebSocket.OPEN) return

    ws.value = new WebSocket(url)

    ws.value.onopen = () => {
      isConnected.value = true
      reconnectAttempts.value = 0
      heartbeat()
      pingInterval.value = window.setInterval(() => {
        if (ws.value?.readyState === WebSocket.OPEN) {
          ws.value?.send('ping')
        }
      }, 15000)
    }

    ws.value.onmessage = (event) => {
      if (event.data === 'pong') {
        heartbeat()
      } else {
        try {
          const response = typeof event.data === 'string' ? JSON.parse(event.data) : event.data

          handlers.forEach((handler) => handler(response))
        } catch (error) {
          console.error('WebSocket error:', error)
        }
      }
    }

    ws.value.onclose = () => {
      isConnected.value = false
      disconnect()
      debounceReconnect()
    }

    ws.value.onerror = (error) => {
      console.error('WebSocket error:', error)
      disconnect()
    }
  }

  const subscribe = (callback: (data: any) => void) => {
    handlers.add(callback)
    return () => handlers.delete(callback)
  }

  const disconnect = () => {
    clearInterval(pingInterval.value)
    clearTimeout(pingTimeout.value)
    clearTimeout(reconnectTimeout)
    if (ws.value) {
      ws.value.close()
      ws.value = null
    }
    isConnected.value = false
  }

  const send = (data: any) => {
    if (ws.value?.readyState === WebSocket.OPEN) {
      ws.value.send(JSON.stringify(data))
    } else {
      console.warn('WebSocket is not connected')
    }
  }

  const debounceReconnect = () => {
    clearTimeout(reconnectTimeout)
    if (reconnectAttempts.value < maxReconnectAttempts) {
      reconnectTimeout = window.setTimeout(() => {
        reconnectAttempts.value++
        connect()
      }, reconnectDelay)
    }
  }

  onUnmounted(() => {
    disconnect()
  })

  return {
    ws,
    isConnected,
    reconnectAttempts,
    connect,
    disconnect,
    send,
    subscribe,
  }
}
