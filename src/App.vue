<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from './components/appHeader.vue'
import AppFooter from "@/components/AppFooter.vue";

</script>

<template>
  <div class="">
    <AppHeader class="sticky-header" />
    <div class="flex flex-col justify-center">
      <RouterView />
    </div>
    <AppFooter />
  </div>
</template>

<style>
.sticky-header{
  @apply sticky top-0 z-50 md:max-w-7xl md:mx-auto lg:max-w-none;
  background-color: var(--vt-c-blue);
}
</style>
