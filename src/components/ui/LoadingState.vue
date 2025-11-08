<template>
  <div class="loading-state" :class="containerClass">
    <div class="loading-content">
      <!-- Skeleton Loading -->
      <div v-if="type === 'skeleton'" class="skeleton-container">
        <div v-for="n in skeletonLines" :key="n" class="skeleton-line" :class="skeletonClass"></div>
      </div>
      
      <!-- Spinner Loading -->
      <div v-else-if="type === 'spinner'" class="spinner-container">
        <LoadingSpinner :size="size" :color="color" :message="message" />
      </div>
      
      <!-- Card Grid Skeleton -->
      <div v-else-if="type === 'cards'" class="cards-skeleton">
        <div v-for="n in cardCount" :key="n" class="card-skeleton">
          <div class="card-image-skeleton"></div>
          <div class="card-content-skeleton">
            <div class="skeleton-line w-3/4 h-4 mb-2"></div>
            <div class="skeleton-line w-1/2 h-3"></div>
          </div>
        </div>
      </div>
      
      <!-- Custom slot for specific loading states -->
      <slot v-else name="loading">
        <LoadingSpinner :size="size" :color="color" :message="message" />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'

interface Props {
  type?: 'spinner' | 'skeleton' | 'cards' | 'custom'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'brand'
  message?: string
  skeletonLines?: number
  cardCount?: number
  fullHeight?: boolean
  centered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'spinner',
  size: 'md',
  color: 'brand',
  skeletonLines: 3,
  cardCount: 6,
  fullHeight: false,
  centered: true
})

const containerClass = computed(() => {
  return {
    'min-h-96': props.fullHeight,
    'flex items-center justify-center': props.centered,
    'p-4': true
  }
})

const skeletonClass = computed(() => {
  const heights = {
    sm: 'h-3',
    md: 'h-4',
    lg: 'h-5',
    xl: 'h-6'
  }
  return heights[props.size]
})
</script>

<style scoped>
@reference "#main.css";

.loading-state {
  @apply w-full;
}

.loading-content {
  @apply w-full max-w-4xl mx-auto;
}

.skeleton-container {
  @apply space-y-3;
}

.skeleton-line {
  @apply bg-gray-200 rounded animate-pulse;
}

.skeleton-line:nth-child(1) { @apply w-full; }
.skeleton-line:nth-child(2) { @apply w-5/6; }
.skeleton-line:nth-child(3) { @apply w-4/6; }

.cards-skeleton {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4;
}

.card-skeleton {
  @apply bg-white rounded-lg shadow-md overflow-hidden;
}

.card-image-skeleton {
  @apply w-full h-48 bg-gray-200 animate-pulse;
}

.card-content-skeleton {
  @apply p-4;
}

.spinner-container {
  @apply flex justify-center;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>