<script setup lang="ts">
import { onMounted, watch, onUnmounted, computed, ref, type Ref, type ComputedRef } from "vue";

import { useWebsocket } from "@/composables/useWebSocket";

import useOrderStore from "@/stores/order.store";

import OrderBook from "@/components/order-book/index.vue";

import type { OrderBookType } from "@/types/orderbook-index.component.d";

import { useTitle } from "@/composables/useTitle";

import { numberFormatter } from "@/utils/format";

const orderStore = useOrderStore();

const orderBookType: Ref<OrderBookType> = ref('BTCPFC')
const orderBookCurrency: Ref<string> = ref('USD')

const title = useTitle('OrderBook')

const {
  connect: connectOrderbookWebsocket,
  isConnected: isOrderbookConnected,
  send: sendOrderbookWebsocket,
  disconnect: disconnectOrderbookWebsocket,
  subscribe: subscribeOrderbookWebsocket,
} = useWebsocket("wss://ws.btse.com/ws/oss/futures");

const {
  connect: connectTradeWebsocket,
  isConnected: isTradeConnected,
  send: sendTradeWebsocket,
  disconnect: disconnectTradeWebsocket,
  subscribe: subscribeTradeWebsocket,
} = useWebsocket("wss://ws.btse.com/ws/futures");

onMounted(async () => {
  await connectOrderbookWebsocket();
  await connectTradeWebsocket();
});

watch(isOrderbookConnected, (state) => {
  if (state) {
    try {
      sendOrderbookWebsocket({
        op: "subscribe",
        args: ["update:BTCPFC"],
      });
      subscribeOrderbookWebsocket((res) => {
        orderStore.updateOrderBook(res);
      });
    } catch (error) {
      console.error(error);
    }
  }
});

watch(isTradeConnected, (state) => {
  if (state) {
    sendTradeWebsocket({
      op: "subscribe",
      args: ["tradeHistoryApi:BTCPFC"],
    });
    subscribeTradeWebsocket((res) => {
      orderStore.updateOrderTradeFill(res);
    });
  }
});


const computedLatestEightsAsks = computed(() => {
  console.log('orderStore.latestAsks', JSON.stringify(orderStore.latestAsks))
  return orderStore.latestAsks
});

const computedLatestEightsBids = computed(() => {
  console.log('orderStore.latestBids', JSON.stringify(orderStore.latestBids))
  return orderStore.latestBids
});

const latestSumAsksAndBidsTotal = computed(() => {
  const lastAsksTotal = computedLatestEightsAsks.value.slice(-1)
  const lastBidsTotal = computedLatestEightsBids.value.slice(-1)

  if (!lastAsksTotal.length || !lastBidsTotal.length) {
    return 0
  }

  return lastAsksTotal[0].total + lastBidsTotal[0].total
})

const priceStatus: ComputedRef<string> = computed(() => {
  const forwardPrice = orderStore.forwardTrade?.price || 0
  const lastPrice = orderStore.lastTrade?.price || 0

  if (forwardPrice === lastPrice) {
    return 'remain'
  }

  if (forwardPrice > lastPrice) {
    return 'decrease'
  }

  return 'increase'
})

const arrowContent = computed(() => {
  const status = priceStatus.value
  if (status === 'remain') {
    return ''
  }
  if (status === 'increase') {
    return '▲'
  }

  return '▼'
})

const pageTitle = computed(() => {
  if (!orderStore.lastTrade || !orderStore.lastTrade.price) {
    return ''
  }

  const directionContent = orderStore.lastTrade.side === orderStore.forwardTrade?.side ? '' : arrowContent.value
  const content = `${directionContent} ${numberFormatter(orderStore.lastTrade.price)}`

  return content
})

onUnmounted(() => {
  disconnectOrderbookWebsocket();
  disconnectTradeWebsocket();
});

watch(pageTitle, (newTitle) => {
  title.value = newTitle ? `${newTitle} | OrderBook` : 'OrderBook'
})
</script>

<template>
  <main class="pt-14 px-[10px]">
    <OrderBook
      :asks="computedLatestEightsAsks"
      :bids="computedLatestEightsBids"
      :type="orderBookType"
      :currency="orderBookCurrency"
      :forward-trade="orderStore.forwardTrade"
      :last-trade="orderStore.lastTrade"
      :trade-total="latestSumAsksAndBidsTotal"
      :highlight-price="orderStore.newQuote"
      :highlight-quote-size="orderStore.newQuoteSize"
    />
  </main>
</template>
