<script setup lang="ts">
import AppHeader from '@/components/appHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>

<template>
  <div class="main-content-wrapper flex flex-col w-full h-full">
    <div class="header">
      <AppHeader />
    </div>
    <div class="content flex flex-col w-full h-full justify-between">
      <div class="max-w-7xl mx-auto w-full h-full p-8 pb-0">
        <slot />
      </div>
      <div class="footer">
        <AppFooter />
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}
.content {
  @apply scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-slate-800;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  height: 100%;
}
</style>
