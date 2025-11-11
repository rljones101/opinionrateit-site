<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Review } from '@/types'
import { useReviewInteractionsStore } from '@/stores/reviewInteractionsStore'
import { formatPercentageToRating } from '@/utils/StringUtils'
import { reviewDate } from '@/utils/DateUtils'
import videoViewController from '@/controllers/videoViewController'
import LikeButton from './LikeButton.vue'
import ReplyButton from './ReplyButton.vue'
import ReplyForm from './ReplyForm.vue'

interface Props {
  review: Review
}

const props = defineProps<Props>()

const interactionsStore = useReviewInteractionsStore()
const showReplyForm = ref(false)
const showReplies = ref(false)
const isSubmittingReply = ref(false)

const reviewMetric = computed(() => videoViewController.reviewMetric(props.review))
const reviewColor = computed(() => videoViewController.getColor(reviewMetric.value))
const replyCount = computed(() => interactionsStore.getReplyCount(props.review._id || ''))

const handleReplyClick = () => {
  showReplyForm.value = !showReplyForm.value
  if (showReplyForm.value) {
    showReplies.value = true
  }
}

const handleReplySubmit = async (content: string) => {
  if (!props.review._id) return
  
  try {
    isSubmittingReply.value = true
    await interactionsStore.addReply(props.review._id, content)
    showReplyForm.value = false
  } catch (error) {
    console.error('Error submitting reply:', error)
  } finally {
    isSubmittingReply.value = false
  }
}

const handleReplyCancel = () => {
  showReplyForm.value = false
}

const toggleReplies = () => {
  showReplies.value = !showReplies.value
  if (showReplies.value && props.review._id) {
    interactionsStore.fetchReplies(props.review._id)
  }
}

onMounted(() => {
  // Set initial reply count if available
  if (props.review._id && (props.review as any).repliesCount) {
    interactionsStore.setReplyCount(props.review._id, (props.review as any).repliesCount)
  }
})
</script>

<template>
  <div class="review-card">
    <div class="review-header">
      <div class="review-rating" :style="{ color: reviewColor }">
        {{ formatPercentageToRating(reviewMetric) }}
      </div>
      
      <div class="review-meta">
        <span class="review-author">{{ review.user.name }}</span>
        <span class="review-date">{{ reviewDate(review.createdAt) }}</span>
      </div>
    </div>
    
    <p v-if="review.comment" class="review-comment">{{ review.comment }}</p>
    
    <div class="review-actions">
      <LikeButton
        v-if="review._id"
        :review-id="review._id"
        :initial-liked="(review as any).isLikedByCurrentUser"
        :initial-count="(review as any).likesCount || 0"
      />
      
      <ReplyButton
        :reply-count="replyCount"
        @click="handleReplyClick"
      />
      
      <button
        v-if="replyCount > 0"
        class="view-replies-button"
        @click="toggleReplies"
      >
        {{ showReplies ? 'Hide' : 'View' }} replies
      </button>
    </div>
    
    <!-- Reply Form -->
    <div v-if="showReplyForm" class="reply-form-container">
      <ReplyForm
        v-if="review._id"
        :review-id="review._id"
        @submit="handleReplySubmit"
        @cancel="handleReplyCancel"
      />
    </div>
    
    <!-- Replies Section (placeholder for now) -->
    <div v-if="showReplies && replyCount > 0" class="replies-section">
      <p class="text-sm text-gray-500">Replies will appear here</p>
    </div>
  </div>
</template>

<style scoped>
@reference "#main.css";

.review-card {
  @apply bg-secondary-50 rounded-lg p-4 shadow space-y-3;
}

.review-header {
  @apply flex items-start gap-3;
}

.review-rating {
  @apply text-2xl font-bold flex-shrink-0;
}

.review-meta {
  @apply flex flex-col;
}

.review-author {
  @apply text-sm font-semibold text-gray-900;
}

.review-date {
  @apply text-xs text-gray-500;
}

.review-comment {
  @apply text-gray-700 leading-relaxed;
}

.review-actions {
  @apply flex items-center gap-2 pt-2 border-t border-gray-200;
}

.view-replies-button {
  @apply text-sm text-blue-600 hover:text-blue-700 font-medium;
  @apply focus:outline-none focus:underline;
}

.reply-form-container {
  @apply pl-4 border-l-2 border-blue-200;
}

.replies-section {
  @apply pl-4 border-l-2 border-gray-200 space-y-2;
}
</style>
