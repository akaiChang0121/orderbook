export interface Order {
  total: number
  size: number
  timestamp: number
  price: number
}

export type Orders = Map<string, Order>

export interface Trade {
  price: number
  size: number
  timestamp: number
  side: 'BUY' | 'SELL'
}

export type QuotePriceArray = string[]

export interface NewQuoteSize {
  price: string
  size: number
  isSizeGrowing: boolean
}

export interface State {
  orderBooks: {
    bids: Orders
    asks: Orders
  }
  newQuote: {
    bids: QuotePriceArray
    asks: QuotePriceArray
  }
  newQuoteSize: {
    bids: NewQuoteSize[]
    asks: NewQuoteSize[]
  }
  forwardTrade: Trade | null
  lastTrade: Trade | null
}
