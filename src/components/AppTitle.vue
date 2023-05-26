<script setup lang="ts">

import IconStar from "@/components/icons/IconStar.vue";
</script>

<template>
  <div class="flex items-center">
    <IconStar color="text-orange-500"></IconStar><p class="font-bold  pl-2 mt-8 mb-8 text-2xl text-white"><slot></slot></p>
  </div>
</template>

<style scoped>

</style>