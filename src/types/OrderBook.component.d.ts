import type { Order, Trade } from '@/types/order.stores'

export type OrderBookType = 'BTCPFC' | 'ETHPFC'

import type { QuotePriceArray, NewQuoteSize } from '@/types/order.stores'

export interface OrderBookComponentProps {
  asks?: Order[]
  bids?: Order[]
  type: OrderBookType
  currency: string
  forwardTrade: Trade | null
  lastTrade: Trade | null
  tradeTotal: number
  highlightPrice: {
    asks: QuotePriceArray
    bids: QuotePriceArray
  }
  highlightQuoteSize: {
    asks: NewQuoteSize[]
    bids: NewQuoteSize[]
  }
}

export interface OrderBookTabsInterface {
  label: string
  id: string
}
