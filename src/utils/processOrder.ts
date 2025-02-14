import type { Order } from '@/types/order.stores'

export const mapToOrderArray = (orders: Map<string, Order>) => {
  if (orders.size === 0) return []

  return Array.from(orders.values()).sort((a, b) => b.price - a.price)
}

export const sumOrderTotal = (
  orders: Order[],
  direction: 'asc' | 'desc' = 'asc'
) => {
  const sortedOrders = [...orders].sort((a, b) => b.price - a.price)

  const calculateAccumulated = (orders: Order[]) => {
    let accumulatedTotal = 0
    return orders.map(order => {
      accumulatedTotal += order.total
      return {
        ...order,
        total: accumulatedTotal
      }
    })
  }

  if (direction === 'desc') {
    return calculateAccumulated(sortedOrders)
  } else {
    return calculateAccumulated([...sortedOrders].reverse()).reverse()
  }
}