import { setActivePinia, createPinia } from 'pinia'
import { describe, beforeEach, it, expect } from 'vitest'
import useOrder from '@/stores/order.store'

import type { Quote, orderBookType, OrderBookResponse } from '@/types/orderBooks'

describe('Order Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Check initial state', () => {
    it('Should have correct initial state', () => {
      const store = useOrder()

      expect(store.orderBooks.asks).toBeInstanceOf(Map)
      expect(store.orderBooks.bids).toBeInstanceOf(Map)
      expect(store.newQuote).toEqual({
        asks: [],
        bids: [],
      })
      expect(store.newQuoteSize).toEqual({
        asks: [],
        bids: [],
      })
      expect(store.forwardTrade).toBeNull()
      expect(store.lastTrade).toBeNull()
    })
  })

  describe('updateOrderBook action', () => {
    it('Should correctly update order book', () => {
      const store = useOrder()
      const mockOrderBookResponse = {
        data: {
          timestamp: 1234567890,
          asks: [['100.00', '10'] as Quote],
          bids: [['99.00', '5'] as Quote],
          seqNum: 1,
          prevSeqNum: 0,
          type: 'snapshot' as orderBookType,
          symbol: 'BTCUSDT'
        },
        topic: 'orderBookL2_25',
      }

      store.updateOrderBook(mockOrderBookResponse)

      // 驗證 asks
      expect(store.orderBooks.asks.get('100.00')).toEqual({
        total: 10,
        timestamp: 1234567890,
        size: 10,
        price: 100.0,
      })

      // 驗證 bids
      expect(store.orderBooks.bids.get('99.00')).toEqual({
        total: 5,
        timestamp: 1234567890,
        size: 5,
        price: 99.0,
      })
    })

    it('should delete order when size is 0', () => {
      const store = useOrder()
      const mockOrderBookResponse = {
        data: {
          timestamp: 1234567890,
          asks: [['100.00', '0'] as Quote],
          bids: [],
          seqNum: 1,
          prevSeqNum: 0,
          type: 'snapshot' as orderBookType,
          symbol: 'BTCUSDT'
        },
        topic: 'orderBookL2_25',
      }

      store.updateOrderBook(mockOrderBookResponse)
      expect(store.orderBooks.asks.has('100.00')).toBe(false)
    })
  })

  describe('updateOrderTradeFill action', () => {
    it('should correctly update latest trade', () => {
      const store = useOrder()
      const mockTradeResponse = {
        data: [
          {
            price: 100.0,
            size: 10,
            timestamp: 1234567890,
            side: 'BUY' as 'BUY' | 'SELL',
            symbol: 'BTCUSDT',
            tradeId: 1234567890,
          },
        ],
        topic: 'orderBookL2_25',
      }

      store.updateOrderTradeFill(mockTradeResponse)

      expect(store.lastTrade).toEqual({
        price: 100,
        size: 10,
        timestamp: 1234567890,
        side: 'BUY',
      })
    })
  })

  describe('getters', () => {
    it('latestAsks should return correctly sorted ask orders', () => {
      const store = useOrder()
      const mockOrderBookResponse = {
        data: {
          timestamp: 1234567890,
          asks: [
            ['101.00', '10'] as Quote,
            ['100.00', '5'] as Quote,
          ],
          bids: [],
          seqNum: 1,
          prevSeqNum: 0,
          type: 'snapshot' as orderBookType,
          symbol: 'BTCUSDT'
        },
        topic: 'orderBookL2_25',
      }

      store.updateOrderBook(mockOrderBookResponse)
      const asks = store.latestAsks

      expect(asks).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ price: 100.0 }),
          expect.objectContaining({ price: 101.0 }),
        ]),
      )
    })
  })

  describe('Order Store - Sequential Updates', () => {
    it('should handle sequential order book updates correctly', () => {
      const store = useOrder()

      const snapshot: OrderBookResponse = {
        topic: 'orderBookL2_25',
        data: {
          timestamp: 1739461818725,
          asks: [
            ['96396.3', '86995'] as Quote,
            ['96395.6', '7510'] as Quote
          ],
          bids: [
            ['96320.4', '50643'] as Quote,
            ['96320.3', '4825'] as Quote
          ],
          seqNum: 8365800,
          prevSeqNum: 8365799,
          type: 'snapshot',
          symbol: 'BTCPFC'
        }
      }

      store.updateOrderBook(snapshot)

      // Verify initial snapshot
      expect(store.orderBooks.asks.get('96396.3')).toEqual({
        total: 86995,
        timestamp: 1739461818725,
        size: 86995,
        price: 96396.3
      })
      expect(store.orderBooks.bids.get('96320.4')).toEqual({
        total: 50643,
        timestamp: 1739461818725,
        size: 50643,
        price: 96320.4
      })

      // Second update - delta update, including price deletion (size = 0)
      const delta1: OrderBookResponse = {
        topic: 'orderBookL2_25',
        data: {
          timestamp: 1739461818769,
          asks: [
            ['96396.3', '0'] as Quote,  // Delete this price
            ['96388.7', '144256'] as Quote  // New price
          ],
          bids: [
            ['96320.4', '0'] as Quote,  // Delete this price
            ['96325.6', '50643'] as Quote  // New price
          ],
          seqNum: 8365801,
          prevSeqNum: 8365800,
          type: 'delta',
          symbol: 'BTCPFC'
        }
      }

      store.updateOrderBook(delta1)

      // Verify first delta update
      expect(store.orderBooks.asks.has('96396.3')).toBe(false)  // Should be deleted
      expect(store.orderBooks.asks.get('96388.7')).toEqual({
        total: 144256,
        timestamp: 1739461818769,
        size: 144256,
        price: 96388.7
      })
      expect(store.orderBooks.bids.has('96320.4')).toBe(false)  // Should be deleted
      expect(store.orderBooks.bids.get('96325.6')).toEqual({
        total: 50643,
        timestamp: 1739461818769,
        size: 50643,
        price: 96325.6
      })

      // Third update - delta update, price updates
      const delta2: OrderBookResponse = {
        topic: 'orderBookL2_25',
        data: {
          timestamp: 1739461818856,
          asks: [
            ['96388.7', '150000'] as Quote  // Update quantity
          ],
          bids: [
            ['96325.6', '60000'] as Quote  // Update quantity
          ],
          seqNum: 8365802,
          prevSeqNum: 8365801,
          type: 'delta',
          symbol: 'BTCPFC'
        }
      }

      store.updateOrderBook(delta2)

      // Verify order book updates
      expect(store.orderBooks.asks.get('96388.7')).toEqual({
        total: 150000,
        timestamp: 1739461818856,
        size: 150000,
        price: 96388.7
      })
      expect(store.orderBooks.bids.get('96325.6')).toEqual({
        total: 60000,
        timestamp: 1739461818856,
        size: 60000,
        price: 96325.6
      })

      // newQuote should be empty as no new prices were added
      expect(store.newQuote).toEqual({
        asks: [],
        bids: []
      })

      // newQuoteSize verification remains unchanged as quantities were updated
      expect(store.newQuoteSize).toEqual({
        asks: [{
          price: '96388.7',
          size: 150000,
          isSizeGrowing: true
        }],
        bids: [{
          price: '96325.6',
          size: 60000,
          isSizeGrowing: true
        }]
      })
    })
  })
})
