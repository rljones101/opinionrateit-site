<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useReviewInteractionsStore } from '@/stores/reviewInteractionsStore'

interface Props {
  reviewId: string
  initialLiked?: boolean
  initialCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  initialLiked: false,
  initialCount: 0
})

const interactionsStore = useReviewInteractionsStore()
const isProcessing = ref(false)

const isLiked = computed(() => interactionsStore.isReviewLiked(props.reviewId))
const likeCount = computed(() => interactionsStore.getLikeCount(props.reviewId))

const handleClick = async () => {
  if (isProcessing.value) return

  try {
    isProcessing.value = true
    
    if (isLiked.value) {
      await interactionsStore.unlikeReview(props.reviewId)
    } else {
      await interactionsStore.likeReview(props.reviewId)
    }
  } catch (error) {
    console.error('Like error:', error)
  } finally {
    isProcessing.value = false
  }
}

onMounted(() => {
  // Set initial state if provided
  if (props.initialCount > 0 || props.initialLiked) {
    interactionsStore.setLikeState(props.reviewId, props.initialLiked, props.initialCount)
  }
})
</script>

<template>
  <button
    class="like-button"
    :class="{ 'liked': isLiked }"
    :disabled="isProcessing"
    @click.stop="handleClick"
    type="button"
  >
    <svg
      v-if="!isProcessing"
      class="like-icon"
      :fill="isLiked ? 'currentColor' : 'none'"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
      />
    </svg>
    
    <svg v-else class="like-icon animate-spin" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    
    <span v-if="likeCount > 0" class="like-count">{{ likeCount }}</span>
  </button>
</template>

<style scoped>
@reference "#main.css";

.like-button {
  @apply inline-flex items-center gap-1 px-3 py-1.5 rounded-lg;
  @apply text-gray-600 hover:text-blue-600 hover:bg-blue-50;
  @apply transition-colors duration-200;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}

.like-button.liked {
  @apply text-blue-600 bg-blue-50;
}

.like-icon {
  @apply w-5 h-5;
}

.like-count {
  @apply text-sm font-medium;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
