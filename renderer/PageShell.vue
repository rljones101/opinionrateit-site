<script setup lang="ts">
import AppFooter from "@/components/AppFooter.vue";
import AppHeader from "@/components/appHeader.vue";

// MAIN LAYOUT
// This page is used similar to how we would use App.vue with a <RouterView/>.
// This is the main layout that will be used on every page

</script>
<template>
  <div class="">
    <AppHeader class="sticky-header" />
    <div class="flex flex-col justify-center">
      <slot/>
    </div>
    <AppFooter />
  </div>
</template>

<style scoped>

</style>