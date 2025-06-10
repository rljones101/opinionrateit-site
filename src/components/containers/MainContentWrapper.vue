<script setup lang="ts">
import AppFooter from '@/components/AppFooter.vue'
import SiteLogo from '@/components/siteLogo.vue'
import AppHeader from '@/components/appHeader.vue'
</script>

<template>
  <div class="main-content-wrapper flex flex-col w-full h-full overflow-y-auto">
    <div class="relative max-w-7xl mx-auto p-8 flex flex-col items-center justify-center pl-4 pr-4">
      <SiteLogo />
    </div>
    <div class="relative flex flex-col w-full max-w-7xl mx-auto rounded-lg shadow bg-secondary-50">
      <AppHeader class="app-header sticky -top-1 z-30" />
      <slot />
    </div>
    <AppFooter />
  </div>
</template>

<style scoped></style>
