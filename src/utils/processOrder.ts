import type { Order } from '@/types/order.stores'

export const processOrderBook = (orders: Map<string, Order>, direction: 'asc' | 'desc') => {
  if (orders.size === 0) return []

  const sortedArray = Array.from(orders.values())

  sortedArray.sort((a, b) => b.price - a.price)

  let accumulatedTotal = 0
  const arrayToProcess = direction === 'asc' ? sortedArray : [...sortedArray].reverse()

  const processedArray = arrayToProcess.map((order) => {
    accumulatedTotal += order.total
    return { ...order, total: accumulatedTotal }
  })

  return direction === 'asc' ? processedArray : processedArray.reverse()
}
