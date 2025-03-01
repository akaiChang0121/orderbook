import { defineStore } from 'pinia'

import type { State, Orders } from '@/types/order.stores'

import { mapToOrderArray, sumOrderTotal } from '@/utils/processOrder'

import type { TradeHistoryResponse } from '@/types/TradeFillsResponse.d'
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
      const latestEightsAsks = mapToOrderArray(asks).slice(0, 8)

      return sumOrderTotal(latestEightsAsks, 'asc')
    },
    latestBids: (state) => {
      const bids = state.orderBooks.bids
      const latestEightsBids = mapToOrderArray(bids).slice(-8)

      return sumOrderTotal(latestEightsBids, 'desc')
    },
  },
  actions: {
    updateOrderBook(orderBookResponse: OrderBookResponse) {
      const { data } = orderBookResponse
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
        this.newQuote = {
          asks: [],
          bids: []
        }

        // clear new quote size
        this.newQuoteSize = {
          asks: [],
          bids: []
        }

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
