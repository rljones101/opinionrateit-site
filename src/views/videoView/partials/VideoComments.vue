<script setup lang="ts">
import { useReviews } from '@/views/videoView/composables/useReviews'
import ReviewCard from '@/components/reviews/ReviewCard.vue'

const { reviews, getReviews } = useReviews()
getReviews()
</script>

<template>
  <div class="comments w-full space-y-4">
    <h3 v-if="reviews.length > 0" class="text-lg font-semibold text-gray-900 mb-4">
      Reviews ({{ reviews.length }})
    </h3>
    
    <ReviewCard
      v-for="review in reviews"
      :key="review._id"
      :review="review"
    />
    
    <div v-if="reviews.length === 0" class="empty-state">
      <p class="text-gray-500">No reviews yet. Be the first to review!</p>
    </div>
  </div>
</template>

<style scoped>
@reference "#main.css";

.empty-state {
  @apply text-center py-8;
}
</style>
