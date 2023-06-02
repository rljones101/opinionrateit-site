<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <div class="overflow-hidden">
    <div class="round-lg bg-slate-700 w-full h-48"></div>
    <p class="pt-4 pb-4">{{ label }}</p>
  </div>
</template>

<style scoped></style>
