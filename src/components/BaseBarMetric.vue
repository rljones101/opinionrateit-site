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
    <div class="basis-1/4 text-orange-200 font-semibold flex-1 text-sm">{{ label }}</div>
    <div class="flex basis-9/12 items-center gap-8">
      <div class="w-full h-4 border border-slate-800 rounded-full overflow-hidden relative">
        <div
          class="absolute bg-app-blue h-full w-full"
          style="background: rgba(247, 114, 22, 0.2)"
        ></div>
        <div class="absolute bg-orange-500 h-full rounded-full" :style="{ width: barWidth }"></div>
      </div>
      <p class="text-sm text-orange-200" :class="{ 'font-bold': metricValue === 10 }">
        {{ metricValue !== 10 ? metricValue.toFixed(1) : metricValue }}
      </p>
    </div>
  </div>
</template>

<style scoped></style>
