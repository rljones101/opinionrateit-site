<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  percentage: number
}>()

const barWidth = computed(() => {
  return Math.round(props.percentage) + '%'
})
</script>

<template>
  <div class="mt-8">
    <div class="flex justify-between pb-4">
      <p class="text-white font-bold">{{ label }}</p>
      <p>{{ percentage }}%</p>
    </div>
    <div class="w-full h-6 border border-slate-700 rounded-full overflow-hidden relative">
      <div class="absolute bg-slate-700 h-full w-full"></div>
      <div class="absolute bg-orange-500 h-full" :style="{ width: barWidth }"></div>
    </div>
  </div>
</template>

<style scoped></style>
