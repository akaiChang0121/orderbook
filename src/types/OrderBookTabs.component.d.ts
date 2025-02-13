import type { OrderBookTabsInterface } from '@/types/OrderBook.component.d'

export interface OrderBookTabsComponentProps {
  tabs: OrderBookTabsInterface[]
  active: string | null
}
