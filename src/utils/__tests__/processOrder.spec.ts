import { mapToOrderArray, sumOrderTotal } from '@/utils/processOrder'
import type { Order } from '@/types/order.stores'
import { describe, expect, test, beforeEach } from 'vitest'

describe('Order Processing Functions', () => {
  let mockOrders: Map<string, Order>

  beforeEach(() => {
    const ordersData = [["96098.8",{"total":120213,"timestamp":1739460442786,"size":120213,"price":96098.8}],["96098.2",{"total":13878,"timestamp":1739460442786,"size":13878,"price":96098.2}],["96097.5",{"total":109296,"timestamp":1739460442786,"size":109296,"price":96097.5}]]
    
    mockOrders = new Map()
    ordersData.forEach((order) => {
      mockOrders.set(order[0] as string, order[1] as Order)
    })
  })

  describe('mapToOrderArray', () => {
    test('should correctly convert Map to array', () => {
      const result = mapToOrderArray(mockOrders)
      
      expect(result).toHaveLength(3)
      expect(result[0]).toEqual({
        total: 120213,
        timestamp: 1739460442786,
        size: 120213,
        price: 96098.8
      })
    })

    test('should return empty array when Map is empty', () => {
      const emptyMap = new Map()
      const result = mapToOrderArray(emptyMap)
      expect(result).toEqual([])
    })
  })

  describe('sumOrderTotal', () => {
    test('should correctly calculate ascending cumulative total', () => {
      const orders = mapToOrderArray(mockOrders)
      const result = sumOrderTotal(orders, 'asc')

      expect(result).toHaveLength(3)
      
      expect(result[0].price).toBe(96098.8)
      expect(result[1].price).toBe(96098.2)
      expect(result[2].price).toBe(96097.5)

      expect(result[0].total).toBe(243387)
      expect(result[1].total).toBe(123174)
      expect(result[2].total).toBe(109296)
    })

    test('should correctly calculate descending cumulative total', () => {
      const orders = mapToOrderArray(mockOrders)
      const result = sumOrderTotal(orders, 'desc')

      expect(result).toHaveLength(3)
      
      expect(result[0].price).toBe(96098.8)
      expect(result[1].price).toBe(96098.2)
      expect(result[2].price).toBe(96097.5)

      expect(result[0].total).toBe(120213)
      expect(result[1].total).toBe(134091)
      expect(result[2].total).toBe(243387)
    })

    test('should use default ascending sort', () => {
      const orders = mapToOrderArray(mockOrders)
      const result = sumOrderTotal(orders)

      expect(result).toHaveLength(3)
      expect(result[0].price).toBe(96098.8)
      expect(result[1].price).toBe(96098.2)
      expect(result[2].price).toBe(96097.5)
    })

    test('should return empty array for empty input', () => {
      const result = sumOrderTotal([])
      expect(result).toEqual([])
    })

    test('should not modify original data', () => {
      const orders = mapToOrderArray(mockOrders)
      const originalOrders = [...orders]
      sumOrderTotal(orders)

      expect(orders).toEqual(originalOrders)
    })
  })
})