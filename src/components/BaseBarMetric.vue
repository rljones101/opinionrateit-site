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
  <div class="flex items-center">
    <div class="basis-1/4 text-white font-bold flex-1">{{ label }}</div>
    <div class="flex basis-9/12 items-center gap-8">
      <div class="w-full h-4 border border-slate-800 rounded-full overflow-hidden relative">
        <div class="absolute bg-app-blue h-full w-full"></div>
        <div class="absolute bg-orange-500 h-full rounded-full" :style="{ width: barWidth }"></div>
      </div>
      <div>{{ ((percentage / 100) * 10).toFixed(1) }}</div>
    </div>
  </div>
</template>

<style scoped></style>
