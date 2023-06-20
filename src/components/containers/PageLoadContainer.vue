<script setup lang="ts">
import ComponentSpinner from '@/components/spinners/ComponentSpinner.vue'
defineProps<{
  isLoading?: boolean
}>()
</script>

<template>
  <div class="w-full h-full relative">
    <slot />
    <ComponentSpinner v-if="isLoading" />
  </div>
</template>

<style scoped></style>
