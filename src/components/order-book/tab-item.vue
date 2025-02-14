<script setup lang="ts">
import type { OrderBookTabsComponentProps } from "@/types/orderbook-tabs.component";

const props = withDefaults(defineProps<OrderBookTabsComponentProps>(), {
  tabs: () => [
    {
      label: "Order Book",
      id: "orderbook",
    },
  ],
  active: null,
});

const emit = defineEmits<{
  (e: "update:active", value: string): void;
}>();

const handleClick = (tabId: string) => {
  emit("update:active", tabId);
};
</script>

<template>
  <div
    v-for="tab in props.tabs"
    :key="tab.id"
    class="w-full px-[10px] text-gray font-bold"
    :data-testid="`tab-${tab.id}`"
  >
    <div :data-testid="`tab-item-${tab.id}`" @click="handleClick(tab.id)">{{ tab.label }}</div>
  </div>
</template>
