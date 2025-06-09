<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  percentage: number
}>()

const barWidth = computed(() => {
  return Math.round(props.percentage) + '%'
})

const metricValue = (props.percentage / 100) * 10
</script>

<template>
  <div class="flex items-center">
    <div class="basis-1/4 font-semibold flex-1 text-sm">{{ label }}</div>
    <div class="flex basis-9/12 items-center gap-8">
      <div class="w-full h-4 rounded-full overflow-hidden relative">
        <div class="absolute bg-brand-50 h-full w-full"></div>
        <div class="absolute bg-brand-500 h-full rounded-full" :style="{ width: barWidth }"></div>
      </div>
      <p class="text-sm" :class="{ 'font-bold': metricValue === 10 }">
        {{ metricValue !== 10 ? metricValue.toFixed(1) : metricValue }}
      </p>
    </div>
  </div>
</template>

<style scoped></style>
