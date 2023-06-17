<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  percentage: number
}>()

const barWidth = computed(() => {
  return Math.round(props.percentage) + '%'
})

const getColor = (value: number) => {
  return `hsl(${value},100%,50%)`
}
</script>

<template>
  <div class="mb-8">
    <div class="flex justify-between pb-4">
      <p class="text-white font-bold">{{ label }}</p>
      <p :style="{ color: getColor(percentage) }">{{ percentage }}%</p>
    </div>
    <div class="w-full h-6 border border-slate-800 rounded-full overflow-hidden relative">
      <div class="absolute bg-slate-800 h-full w-full"></div>
      <div
        class="absolute bg-orange-500 h-full"
        :style="{ width: barWidth, backgroundColor: getColor(percentage) }"
      ></div>
    </div>
  </div>
</template>

<style scoped></style>
