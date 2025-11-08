<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-content">
      <div class="error-icon">
        <svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      
      <h3 class="error-title">{{ title }}</h3>
      <p class="error-message">{{ message }}</p>
      
      <div class="error-actions">
        <button 
          @click="retry" 
          class="retry-button"
          v-if="showRetry"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </button>
        
        <button 
          @click="goHome" 
          class="home-button"
          v-if="showHome"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Go Home
        </button>
      </div>
      
      <details v-if="showDetails && errorDetails" class="error-details">
        <summary class="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
          Show technical details
        </summary>
        <pre class="error-stack">{{ errorDetails }}</pre>
      </details>
    </div>
  </div>
  
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  title?: string
  message?: string
  showRetry?: boolean
  showHome?: boolean
  showDetails?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Something went wrong',
  message: 'An unexpected error occurred. Please try again or contact support if the problem persists.',
  showRetry: true,
  showHome: true,
  showDetails: false
})

const emit = defineEmits<{
  retry: []
  error: [error: Error]
}>()

const router = useRouter()
const hasError = ref(false)
const errorDetails = ref<string>('')

onErrorCaptured((error: Error) => {
  hasError.value = true
  errorDetails.value = error.stack || error.message
  emit('error', error)
  
  // Log error for monitoring
  console.error('Error caught by ErrorBoundary:', error)
  
  return false // Prevent error from propagating
})

const retry = () => {
  hasError.value = false
  errorDetails.value = ''
  emit('retry')
}

const goHome = () => {
  router.push({ name: 'home' })
}

// Expose methods for manual error handling
defineExpose({
  setError: (error: Error) => {
    hasError.value = true
    errorDetails.value = error.stack || error.message
  },
  clearError: () => {
    hasError.value = false
    errorDetails.value = ''
  }
})
</script>

<style scoped>
@reference "#main.css";

.error-boundary {
  @apply min-h-96 flex items-center justify-center p-8;
}

.error-content {
  @apply max-w-md mx-auto text-center bg-white rounded-lg shadow-lg p-8 border border-red-100;
}

.error-icon {
  @apply flex justify-center mb-4;
}

.error-title {
  @apply text-xl font-semibold text-gray-900 mb-2;
}

.error-message {
  @apply text-gray-600 mb-6 leading-relaxed;
}

.error-actions {
  @apply flex flex-col sm:flex-row gap-3 justify-center mb-4;
}

.retry-button {
  @apply inline-flex items-center px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 transition-colors duration-200 font-medium;
}

.home-button {
  @apply inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200 font-medium;
}

.error-details {
  @apply mt-4 text-left;
}

.error-stack {
  @apply mt-2 p-3 bg-gray-100 rounded text-xs text-gray-700 overflow-auto max-h-32;
}
</style>