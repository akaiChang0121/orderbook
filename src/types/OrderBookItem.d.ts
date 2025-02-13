import type { NewQuoteSize } from '@/types/order.stores'

export interface OrderBookItemProps {
  price: number
  size: number
  total: number
  type: OrderBookItemType
  index: number
  isHovered: boolean
  labelsWidthPercentage: string[]
  tradeTotal: number
  isHighlight: boolean
  quoteSizeStatus: NewQuoteSize | null
}

export enum OrderBookItemType {
  ASKS = 'asks',
  BIDS = 'bids',
}
