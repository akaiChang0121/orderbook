<script setup lang="ts">
import { computed, type ComputedRef, type Ref } from "vue";
import  { type OrderBookItemProps, OrderBookItemType } from "@/types/OrderBookItem.d";

import { numberFormatter } from "@/utils/format";

const props = defineProps<OrderBookItemProps>();

const priceColorClass: ComputedRef<string> = computed(() => {
  return props.type === OrderBookItemType.ASKS ? "text-asks-red" : "text-bids-green";
});

const computedTradeSizePercentage: Ref<string> = computed(() => {
  return `${(props.total / props.tradeTotal) * 100}%`
})
</script>

<template>
  <div
    class="flex px-[10px] mt-[1px] mb-[2px] text-[13px] leading-[18px] font-bold cursor-pointer relative"
    :class="{
      'bg-quote-row-hover': isHovered,
      'bg-animation-flash-red': isHighlight && type === OrderBookItemType.ASKS,
      'bg-animation-flash-green': isHighlight && type === OrderBookItemType.BIDS,
    }"
  >
    <div class="flex w-full z-10">
      <div
        class="text-left"
        :style="{
          flex: labelsWidthPercentage[0],
        }"
      >
        <span :class="priceColorClass">{{ numberFormatter(price) }}</span>
      </div>
      <div
        class="text-right text-gray"
        :style="{
          flex: labelsWidthPercentage[1],
        }"
      >
        {{ numberFormatter(size) }}
      </div>
      <div
        class="text-right text-gray"
        :style="{
          flex: labelsWidthPercentage[2],
        }"
      >
        {{ numberFormatter(total) }}
      </div>
    </div>
    <i
      class="absolute h-full right-0"
      :class="{
        'bg-sell-quote-accumulative-total-size-bar': type === OrderBookItemType.ASKS,
        'bg-buy-quote-accumulative-total-size-bar': type === OrderBookItemType.BIDS,
      }"
      :style="{
        width: computedTradeSizePercentage,
      }"
    />
  </div>
</template>
