<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  percentage: number
  color?: 'brand' | 'green' | 'blue' | 'red' | 'gray'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  animated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: 'brand',
  size: 'md',
  showLabel: false,
  animated: false
})

const clampedPercentage = computed(() => {
  return Math.min(100, Math.max(0, props.percentage))
})

const heightClass = computed(() => {
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }
  return sizes[props.size]
})

const colorClass = computed(() => {
  const colors = {
    brand: 'bg-brand-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    gray: 'bg-gray-500'
  }
  return colors[props.color]
})
</script>

<template>
  <div class="progress-bar-container">
    <div class="progress-bar-track" :class="heightClass">
      <div
        class="progress-bar-fill"
        :class="[colorClass, heightClass, { 'progress-animated': animated }]"
        :style="{ width: `${clampedPercentage}%` }"
      ></div>
    </div>
    
    <span v-if="showLabel" class="progress-label">
      {{ Math.round(clampedPercentage) }}%
    </span>
  </div>
</template>

<style scoped>
@reference "#main.css";

.progress-bar-container {
  @apply flex items-center gap-2 w-full;
}

.progress-bar-track {
  @apply flex-1 bg-gray-200 rounded-full overflow-hidden;
}

.progress-bar-fill {
  @apply rounded-full transition-all duration-300 ease-out;
}

.progress-animated {
  animation: progress-pulse 2s ease-in-out infinite;
}

.progress-label {
  @apply text-xs font-medium text-gray-600 whitespace-nowrap;
}

@keyframes progress-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
</style>
