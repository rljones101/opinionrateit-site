<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Review } from '@/types'
import { useReviewInteractionsStore } from '@/stores/reviewInteractionsStore'
import { useUserStore } from '@/stores/userStore'
import { useLoginDialogStore } from '@/stores/loginDialogStore'
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
const userStore = useUserStore()
const loginDialog = useLoginDialogStore()

// Liking and replying require an account. Logged-out visitors can read
// everything; attempting to interact nudges them to sign in.
const canInteract = computed(() => userStore.isLoggedIn)

const showReplyForm = ref(false)
const showReplies = ref(false)
const isSubmittingReply = ref(false)

const reviewMetric = computed(() => videoViewController.reviewMetric(props.review))
const reviewColor = computed(() => videoViewController.getColor(reviewMetric.value))
const replyCount = computed(() => interactionsStore.getReplyCount(props.review._id || ''))

const handleReplyClick = () => {
  if (!canInteract.value) {
    loginDialog.open()
    return
  }
  showReplyForm.value = !showReplyForm.value
  if (showReplyForm.value) {
    showReplies.value = true
  }
}

const handleLikeClick = () => {
  // For logged-out users, intercept and prompt sign-in instead of liking.
  loginDialog.open()
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
      <!-- Logged in: real like button. Logged out: a look-alike that prompts sign-in. -->
      <LikeButton
        v-if="canInteract && review._id"
        :review-id="review._id"
        :initial-liked="(review as any).isLikedByCurrentUser"
        :initial-count="(review as any).likesCount || 0"
      />
      <button
        v-else-if="review._id"
        class="like-button-prompt"
        type="button"
        @click.stop="handleLikeClick"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
        <span v-if="(review as any).likesCount > 0" class="text-sm font-medium">{{ (review as any).likesCount }}</span>
      </button>

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

    <!-- Reply Form (only ever shown to signed-in users) -->
    <div v-if="canInteract && showReplyForm" class="reply-form-container">
      <ReplyForm
        v-if="review._id"
        :review-id="review._id"
        @submit="handleReplySubmit"
        @cancel="handleReplyCancel"
      />
    </div>
    
    <!-- Replies Section (placeholder for now) -->
    <div v-if="showReplies && replyCount > 0" class="replies-section">
      <p class="text-sm text-default-300">Replies will appear here</p>
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
  @apply text-sm font-semibold text-default-50;
}

.review-date {
  @apply text-xs text-default-300;
}

.review-comment {
  @apply text-default-200 leading-relaxed;
}

.review-actions {
  @apply flex items-center gap-2 pt-2 border-t border-secondary-200;
}

/* Matches LikeButton styling, but prompts sign-in instead of liking. */
.like-button-prompt {
  @apply inline-flex items-center gap-1 px-3 py-1.5 rounded-lg;
  @apply text-default-300 hover:text-blue-400 hover:bg-blue-500/10;
  @apply transition-colors duration-200;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1;
}

.view-replies-button {
  @apply text-sm text-blue-600 hover:text-blue-700 font-medium;
  @apply focus:outline-none focus:underline;
}

.reply-form-container {
  @apply pl-4 border-l-2 border-blue-200;
}

.replies-section {
  @apply pl-4 border-l-2 border-secondary-200 space-y-2;
}
</style>
