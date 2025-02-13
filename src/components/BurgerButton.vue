<script setup lang="ts">
import { computed } from "vue";
import type { BurgerButtonProps } from "@/types/BurgerButton.component.d";
const props = withDefaults(defineProps<BurgerButtonProps>(), {
  color: "#fff",
  active: false,
});

const emit = defineEmits<{
  (e: "update:active", value: boolean): void;
}>();

const isBurgerActive = computed({
  get: (): boolean => props.active,
  set: (value: boolean) => {
    emit("update:active", value);
  },
});

const handleClick = () => {
  isBurgerActive.value = !isBurgerActive.value;
};
</script>

<template>
  <div
    class="cursor-pointer w-[26px] transition-all duration-500 ease-in-out"
    @click="handleClick"
  >
    <div
      class="h-[3px] rounded-[3px] opacity-100 transition-all !duration-500 ease-in-out"
      :style="{
        backgroundColor: props.color,
        transform: isBurgerActive ? 'rotate(45deg) translate(5px, 5px)' : 'none',
        width: isBurgerActive ? '100%' : '90%',
      }"
    />
    <div
      class="w-full h-[3px] rounded-[3px] opacity-100 transition-all !duration-500 delay-400 ease-in-out my-1"
      :style="{
        backgroundColor: props.color,
        opacity: isBurgerActive ? 0 : 1,
      }"
    />
    <div
      class="h-[3px] rounded-[3px] opacity-100 transition-all !duration-500 ease-in-out"
      :style="{
        backgroundColor: props.color,
        transform: isBurgerActive ? 'translateY(-6px) rotate(-45deg)' : 'none',
        width: isBurgerActive ? '100%' : '50%',
      }"
    />
  </div>
</template>
