<template>
  <div class="loading-spinner" :class="sizeClass">
    <div class="spinner" :class="colorClass"></div>
    <p v-if="message" class="loading-message" :class="textSizeClass">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'brand'
  message?: string
  centered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'brand',
  centered: true
})

const sizeClass = computed(() => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }
  return `${sizes[props.size]} ${props.centered ? 'flex flex-col items-center justify-center' : ''}`
})

const colorClass = computed(() => {
  const colors = {
    primary: 'border-primary-500',
    secondary: 'border-secondary-500', 
    brand: 'border-brand-500'
  }
  return colors[props.color]
})

const textSizeClass = computed(() => {
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base', 
    xl: 'text-lg'
  }
  return textSizes[props.size]
})
</script>

<style scoped>
@reference "#main.css";

.loading-spinner {
  @apply gap-2;
}

.spinner {
  @apply border-4 border-gray-200 rounded-full animate-spin;
  border-top-color: currentColor;
}

.loading-message {
  @apply text-gray-600 font-medium;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>