<script setup lang="ts">
import type { OrderBookTabsComponentProps } from "@/types/OrderBookTabs.component.d";

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
  >
    <div @click="handleClick(tab.id)">{{ tab.label }}</div>
  </div>
</template>
