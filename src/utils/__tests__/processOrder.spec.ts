import { processOrderBook } from '@/utils/processOrder'
import type { Order } from '@/types/order.stores'
import { describe, expect, test, beforeEach } from 'vitest'

describe('processOrderBook', () => {
  let mockOrders: Map<string, Order>

  beforeEach(() => {
    const ordersData = [["96098.8",{"total":120213,"timestamp":1739460442786,"size":120213,"price":96098.8}],["96098.2",{"total":13878,"timestamp":1739460442786,"size":13878,"price":96098.2}],["96097.5",{"total":109296,"timestamp":1739460442786,"size":109296,"price":96097.5}],["96096.7",{"total":182160,"timestamp":1739460442786,"size":182160,"price":96096.7}],["96096.5",{"total":1100,"timestamp":1739460442786,"size":1100,"price":96096.5}],["96095.5",{"total":71392,"timestamp":1739460442786,"size":71392,"price":96095.5}],["96093.6",{"total":7009,"timestamp":1739460442786,"size":7009,"price":96093.6}],["96093.4",{"total":61333,"timestamp":1739460442786,"size":61333,"price":96093.4}],["96091.8",{"total":36064,"timestamp":1739460442786,"size":36064,"price":96091.8}],["96091.6",{"total":47595,"timestamp":1739460442786,"size":47595,"price":96091.6}],["96089.9",{"total":24288,"timestamp":1739460442786,"size":24288,"price":96089.9}],["96089.0",{"total":12267,"timestamp":1739460442786,"size":12267,"price":96089}],["96083.9",{"total":73076,"timestamp":1739460442786,"size":73076,"price":96083.9}],["96083.5",{"total":120550,"timestamp":1739460442786,"size":120550,"price":96083.5}],["96082.4",{"total":111851,"timestamp":1739460442786,"size":111851,"price":96082.4}],["96081.5",{"total":1100,"timestamp":1739460442786,"size":1100,"price":96081.5}],["96081.1",{"total":99423,"timestamp":1739460442786,"size":99423,"price":96081.1}],["96081.0",{"total":86995,"timestamp":1739460442786,"size":86995,"price":96081}],["96079.0",{"total":60896,"timestamp":1739460442786,"size":60896,"price":96079}],["96077.6",{"total":49711,"timestamp":1739460442786,"size":49711,"price":96077.6}],["96076.9",{"total":89255,"timestamp":1739460442786,"size":89255,"price":96076.9}],["96076.6",{"total":37284,"timestamp":1739460442786,"size":37284,"price":96076.6}],["96076.2",{"total":102006,"timestamp":1739460442786,"size":102006,"price":96076.2}],["96075.7",{"total":76504,"timestamp":1739460442786,"size":76504,"price":96075.7}],["96075.1",{"total":24607,"timestamp":1739460442786,"size":24607,"price":96075.1}],["96074.5",{"total":12428,"timestamp":1739460442786,"size":12428,"price":96074.5}],["96074.4",{"total":51529,"timestamp":1739460442786,"size":51529,"price":96074.4}],["96073.5",{"total":65068,"timestamp":1739460442786,"size":65068,"price":96073.5}],["96073.0",{"total":38647,"timestamp":1739460442786,"size":38647,"price":96073}],["96071.6",{"total":117123,"timestamp":1739460442786,"size":117123,"price":96071.6}],["96070.4",{"total":78871,"timestamp":1739460442786,"size":78871,"price":96070.4}],["96070.3",{"total":13145,"timestamp":1739460442786,"size":13145,"price":96070.3}],["96069.3",{"total":63754,"timestamp":1739460442786,"size":63754,"price":96069.3}],["96068.2",{"total":52055,"timestamp":1739460442786,"size":52055,"price":96068.2}],["96067.0",{"total":39436,"timestamp":1739460442786,"size":39436,"price":96067}],["96066.2",{"total":26028,"timestamp":1739460442786,"size":26028,"price":96066.2}],["96065.2",{"total":48095,"timestamp":1739460442786,"size":48095,"price":96065.2}],["96064.8",{"total":13145,"timestamp":1739460442786,"size":13145,"price":96064.8}],["96064.3",{"total":38868,"timestamp":1739460442786,"size":38868,"price":96064.3}],["96063.4",{"total":29446,"timestamp":1739460442786,"size":29446,"price":96063.4}],["96062.2",{"total":19238,"timestamp":1739460442786,"size":19238,"price":96062.2}],["96061.7",{"total":9815,"timestamp":1739460442786,"size":9815,"price":96061.7}],["96060.8",{"total":73616,"timestamp":1739460442786,"size":73616,"price":96060.8}],["96060.0",{"total":49077,"timestamp":1739460442786,"size":49077,"price":96060}],["96058.3",{"total":24539,"timestamp":1739460442786,"size":24539,"price":96058.3}],["96057.9",{"total":140223,"timestamp":1739460442786,"size":140223,"price":96057.9}],["96057.6",{"total":173174,"timestamp":1739460442786,"size":173174,"price":96057.6}],["96056.9",{"total":35055,"timestamp":1739460442786,"size":35055,"price":96056.9}],["96056.1",{"total":19145,"timestamp":1739460442786,"size":19145,"price":96056.1}],["96054.0",{"total":47503,"timestamp":1739460442786,"size":47503,"price":96054}]]

    mockOrders = new Map()
    ordersData.forEach((order) => {
      mockOrders.set(order[0] as string, order[1] as Order)
    })
  })

  test('Should sort in ascending order correctly', () => {
    const result = processOrderBook(mockOrders, 'asc')
    
    expect(result.length).toBe(50)
    expect(result[0].price).toBe(96098.8)
    expect(result[result.length - 1].price).toBe(96054)
    
    // Verify accumulated totals
    let expectedTotal = 0
    result.forEach((order) => {
      expectedTotal += order.size
      expect(order.total).toBe(expectedTotal)
    })
  })

  test('Should sort in descending order correctly', () => {
    const result = processOrderBook(mockOrders, 'desc')

    // Sort back in ascending order to verify the sorting
    const sortResult = result.sort((a, b) => a.price - b.price)
    
    expect(sortResult.length).toBe(50)
    expect(sortResult[0].price).toBe(96054)
    expect(sortResult[sortResult.length - 1].price).toBe(96098.8)
    
    let expectedTotal = 0
    sortResult.forEach((order) => {
      expectedTotal += order.size
      expect(order.total).toBe(expectedTotal)
    })
  })

  test('Should return empty array when the initial map is empty', () => {
    const emptyOrders = new Map()
    const result = processOrderBook(emptyOrders, 'asc')
    expect(result).toEqual([])
  })

  test('Should not change the original map', () => {
    const originalOrders = new Map(mockOrders)
    processOrderBook(mockOrders, 'asc')

    expect(mockOrders).toEqual(originalOrders)
  })
})