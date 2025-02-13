export interface OrderBookRequest {
  op: 'subscribe' | 'unsubscribe'
  args: string[]
}

export type price = string

export type size = string

export type Quote = [price, size]

export type orderBookType = 'snapshot' | 'delta'

export interface OrderBookData {
  bids: Quote[]
  asks: Quote[]
  seqNum: number
  prevSeqNum: number
  type: orderBookType
  timestamp: number
  symbol: string
}

export interface OrderBookResponse {
  topic: string
  data: OrderBookData
}

// 错误响应格式
export interface OrderBookError {
  severity: 'ERROR'
  errors: Array<{
    arg: string
    error: {
      code: number
      message: string
    }
  }>
}

export enum OrderBookErrorCode {
  MARKET_PAIR_NOT_SUPPORTED = 1000,
  OPERATION_NOT_SUPPORTED = 1001,
  INVALID_REQUEST = 1002,
  TOPIC_NOT_EXIST = 1005,
  MESSAGE_BUFFER_FULL = 1007,
  MAX_FAILED_ATTEMPTS = 1008,
}
