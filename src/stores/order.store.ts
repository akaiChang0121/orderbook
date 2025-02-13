import { defineStore } from 'pinia'

import type { State, Orders } from '@/types/order.stores'

import { processOrderBook } from '@/utils/processOrder'

import type { TradeHistoryResponse } from '@/types/tradeFills.d'
import type { OrderBookResponse, Quote } from '@/types/orderBooks.d'

const useOrder = defineStore('orderStore', {
  state: (): State => ({
    orderBooks: {
      asks: new Map(),
      bids: new Map(),
    },
    newQuote: {
      asks: [],
      bids: [],
    },
    newQuoteSize: {
      asks: [],
      bids: [],
    },
    forwardTrade: null,
    lastTrade: null,
  }),
  getters: {
    latestAsks: (state) => {
      const asks = state.orderBooks.asks
      const asksArray = processOrderBook(asks, 'desc')

      return asksArray
    },
    latestBids: (state) => {
      const bids = state.orderBooks.bids
      const bidsArray = processOrderBook(bids, 'asc')

      return bidsArray
    },
  },
  actions: {
    updateOrderBook(orderBookResponse: OrderBookResponse) {
      const { data } = orderBookResponse
      // @TODO 要把 update orders 方法拆出來
      const updateOrders = (orders: Orders, quotes: Quote[], type: 'asks' | 'bids'): void => {
        for (const [price, size] of quotes) {
          const intSize = parseInt(size, 10)

          if (intSize === 0) {
            orders.delete(price)
            continue
          }

          const orderSize = parseInt(size, 10)
          const activePrice = parseFloat(price)

          if (!orders.has(price)) {
            this.newQuote[type].push(price)
          } else {
            const existOrder = orders.get(price)

            if (existOrder) {
              this.newQuoteSize[type].push({
                price,
                size: intSize,
                isSizeGrowing: intSize > existOrder.size,
              })
            }
          }

          orders.set(price, {
            total: intSize,
            timestamp: data.timestamp,
            size: orderSize,
            price: activePrice,
          })
        }
      }

      if (data) {
        // clear new quote
        this.newQuote.asks = []
        this.newQuote.bids = []

        // clear new quote size
        this.newQuoteSize.asks = []
        this.newQuoteSize.bids = []

        updateOrders(this.orderBooks.asks, data.asks, 'asks')
        updateOrders(this.orderBooks.bids, data.bids, 'bids')
      }
    },
    updateOrderTradeFill(tradeResponse: TradeHistoryResponse) {
      const { data } = tradeResponse

      if (data && data.length) {
        const lastTradeIndex = data.length - 1
        const lastTrade = data[lastTradeIndex]

        if (this.lastTrade) {
          this.forwardTrade = { ...this.lastTrade }
        }

        this.lastTrade = {
          price: lastTrade.price,
          size: lastTrade.size,
          timestamp: lastTrade.timestamp,
          side: lastTrade.side,
        }
      }
    },
  },
})

export default useOrder
