<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <header class="fixed top-5 right-5">
    <!-- @TODO: when include other coin, show this button -->
    <!-- <BurgerButton v-model:active="isShownDrawer" /> -->
  </header>

  <RouterView />
</template>
