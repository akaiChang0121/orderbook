import type { OrderBookTabsInterface } from '@/types/orderbook-index.component.d'

export interface OrderBookTabsComponentProps {
  tabs: OrderBookTabsInterface[]
  active: string | null
}
