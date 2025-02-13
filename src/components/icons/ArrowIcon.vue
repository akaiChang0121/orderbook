<script setup lang="ts">
import type { IconProps } from "./types";

const props = withDefaults(defineProps<IconProps>(), {
  fillColor: "#00b15d",
  size: 24,
});
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    role="presentation"
    fill="none"
    fill-rule="nonzero"
    :stroke="fillColor"
    stroke-width="4"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <polyline points="19 12 12 19 5 12"></polyline>
  </svg>
</template>
