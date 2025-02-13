<script setup lang="ts">
import {
  computed,
  type ComputedRef,
  type Ref,
  ref
} from "vue";

import OrderBookTabs from "@/components/OrderBook/tab-item.vue";
import OrderBookItem from "@/components/OrderBook/orderbook-item.vue";
import ArrowIcon from "@/components/icons/ArrowIcon.vue";

import type { NewQuoteSize } from '@/types/order.stores'

import type { OrderBookComponentProps, OrderBookTabsInterface } from "@/types/OrderBook.component.d";

import { numberFormatter } from "@/utils/format";

import { OrderBookItemType } from "@/types/OrderBookItem.d";

const tabs: Ref<OrderBookTabsInterface[]> = ref([
  {
    label: "Order Book",
    id: "orderbook",
  },
]);
const activeTab: Ref<string> = ref("orderbook");
const hoverAsksIndex: Ref<number | null> = ref(null);
const hoverBidsIndex: Ref<number | null> = ref(null);

const props = defineProps<OrderBookComponentProps>();

const labels: ComputedRef<string[]> = computed(() => [`Price (${props.currency})`, 'Size', 'Total'])
const labelsWidthPercentage: ComputedRef<string[]> = computed(() => ['0.29', '0.30', '0.41'])

const forwardPrice: ComputedRef<number> = computed(() => props.forwardTrade?.price ?? 0)
const lastPrice: ComputedRef<number> = computed(() => props.lastTrade?.price ?? 0)
const lastPriceStatus: ComputedRef<string> = computed(() => {
  if (forwardPrice.value === lastPrice.value) {
    return 'remain'
  }

  if (forwardPrice.value > lastPrice.value) {
    return 'decrease'
  }

  return 'increase'
})
const arrowIconColor: ComputedRef<string> = computed(() => {
  if (forwardPrice.value === lastPrice.value) {
    return '#f0f4f8'
  }

  if (forwardPrice.value > lastPrice.value) {
    return '#ff5b5a'
  }

  return '#00b15d'
})

const handleAsksMouseEnter = (index: number): void => {
  hoverAsksIndex.value = index;
};

const handleAsksMouseLeave = (): void => {
  hoverAsksIndex.value = null;
};

const handleBidsMouseEnter = (index: number): void => {
  hoverBidsIndex.value = index;
};

const handleBidsMouseLeave = (): void => {
  hoverBidsIndex.value = null;
};

const detectHighlightPrice = (priceList: string[], price: string | number): boolean => {
  return priceList.includes(price.toString())
}

const quoteSizeStatus = (price: number, type: 'asks' | 'bids'): NewQuoteSize | null => {
  if (!props.highlightQuoteSize || !props.highlightQuoteSize[type].length) {
    return null
  }

  return props.highlightQuoteSize[type].find((item) => item.price === price.toString()) || null
}
</script>

<template>
  <div class="w-full md:max-w-1/2 lg:max-w-[21%] max-w-full mx-auto bg-dark">
    <OrderBookTabs :tabs="tabs" v-model:active="activeTab" />
    <div class="flex px-[10px] py-[5px]">
      <div
        v-for="(label, index) in labels"
        :key="label"
        class="text-quote-head text-xs"
        :class="{
          'text-right': index,
          'text-left': !index,
        }"
        :style="{ flex: labelsWidthPercentage[index] }"
      >
        {{ label }}
      </div>
    </div>
    <template v-if="activeTab === 'orderbook'">
      <OrderBookItem
        v-for="(asks, asksIndex) in props.asks"
        :key="asks.price"
        :price="asks.price"
        :size="asks.size"
        :total="asks.total"
        :type="OrderBookItemType.ASKS"
        :index="asksIndex"
        :is-hovered="hoverAsksIndex !== null && hoverAsksIndex <= asksIndex"
        :labels-width-percentage="labelsWidthPercentage"
        :trade-total="props.tradeTotal"
        :is-highlight="detectHighlightPrice(props.highlightPrice.asks, asks.price)"
        :quote-size-status="quoteSizeStatus(asks.price, OrderBookItemType.ASKS)"
        @mouseenter="handleAsksMouseEnter(asksIndex)"
        @mouseleave="handleAsksMouseLeave"
      />
      <div
        class="bg-buy-quote-accumulative-total-size-bar flex items-center justify-center h-7"
        :class="{
          'bg-sell-quote-accumulative-total-size-bar': lastPriceStatus === 'decrease',
          'bg-buy-quote-accumulative-total-size-bar': lastPriceStatus === 'increase',
          'bg-wrap-quote-accumulative-total-size-bar': lastPriceStatus === 'remain',
        }"
      >
        <span
          class="text-[16.8px] font-bold flex items-center"
          :class="{
            'text-asks-red': lastPriceStatus === 'decrease',
            'text-bids-green': lastPriceStatus === 'increase',
            'text-gray': lastPriceStatus === 'remain',
          }"
        >
          {{ numberFormatter(lastPrice) }}
        </span>
        <div class="w-[15px]">
          <ArrowIcon
            v-if="lastPriceStatus !== 'remain'"
            :fill-color="arrowIconColor"
            :size="15"
            :class="{
              'rotate-180': lastPriceStatus === 'increase',
            }"
          />
        </div>
      </div>
      <OrderBookItem
        v-for="(bids, bidsIndex) in props.bids"
        :key="bids.price"
        :price="bids.price"
        :size="bids.size"
        :total="bids.total"
        :type="OrderBookItemType.BIDS"
        :index="bidsIndex"
        :is-hovered="hoverBidsIndex !== null && hoverBidsIndex >= bidsIndex"
        :trade-total="props.tradeTotal"
        :labels-width-percentage="labelsWidthPercentage"
        :is-highlight="detectHighlightPrice(props.highlightPrice.bids, bids.price)"
        :quote-size-status="quoteSizeStatus(bids.price, OrderBookItemType.BIDS)"
        @mouseenter="handleBidsMouseEnter(bidsIndex)"
        @mouseleave="handleBidsMouseLeave"
      />
    </template>
  </div>
</template>
