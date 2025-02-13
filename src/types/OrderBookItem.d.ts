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
}

export enum OrderBookItemType {
  ASKS = 'asks',
  BIDS = 'bids',
}
