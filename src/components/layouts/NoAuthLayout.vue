<script setup lang="ts">
import AppHeader from '@/components/appHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>

<template>
  <div class="main-content-wrapper flex flex-col w-full h-full">
    <div class="header flex-shrink-0 flex flex-col">
      <AppHeader />
    </div>
    <div class="content scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-slate-800 flex flex-col w-full h-full justify-between overflow-y-auto flex-grow">
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
</style>
