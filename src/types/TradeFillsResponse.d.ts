export interface WSMessage {
  op: string
  args: string[]
}

export interface TradeHistorySubscription extends WSMessage {
  op: 'subscribe'
  args: [`tradeHistoryApi:${string}`]
}

export interface TradeData {
  symbol: string
  side: 'BUY' | 'SELL'
  size: number
  price: number
  tradeId: number
  timestamp: number
}

export interface TradeHistoryResponse {
  topic: string
  data: TradeData[]
}

export interface AuthRequest extends WSMessage {
  op: 'authKeyExpires'
  args: [string, string, string]
}
