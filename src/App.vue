<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { RouterView } from "vue-router";

import BurgerButton from "@/components/burger-button.vue";
const isShownDrawer: Ref<boolean> = ref(false)
</script>

<template>
  <header class="fixed top-5 right-5">
    <BurgerButton v-model:active="isShownDrawer" />
  </header>

  <RouterView />
</template>
