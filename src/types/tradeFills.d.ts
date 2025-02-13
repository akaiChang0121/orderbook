// WebSocket 基礎消息接口
export interface WSMessage {
  op: string
  args: string[]
}

// 交易歷史訂閱請求
export interface TradeHistorySubscription extends WSMessage {
  op: 'subscribe'
  args: [`tradeHistoryApi:${string}`]
}

// 交易數據接口
export interface TradeData {
  symbol: string
  side: 'BUY' | 'SELL'
  size: number
  price: number
  tradeId: number
  timestamp: number
}

// 交易歷史響應
export interface TradeHistoryResponse {
  topic: string
  data: TradeData[]
}

// 認證請求
export interface AuthRequest extends WSMessage {
  op: 'authKeyExpires'
  args: [string, string, string]
}
