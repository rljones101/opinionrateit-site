<script setup lang="ts">
import AppTitle from '@/components/AppTitle.vue'
import ReviewerItem from '@/views/reviewers/partials/ReviewerItem.vue'
import { useReviewersStore } from '@/views/reviewers/stores/reviewers'

const reviewersState = useReviewersStore()
reviewersState.getReviewers()

// let search = ref('')

// const searchReviewers = async () => {
//   const params = search.value ? { name: search.value } : ''
//   const searchParams = new URLSearchParams(params)
//   list.value = await reviewerController.getReviewers(searchParams)
// }

// const clearSearch = () => {
//   search.value = ''
//   searchReviewers()
// }
</script>

<template>
  <div class="reviewers-container w-full">
    <AppTitle>Reviewers</AppTitle>
    <div class="reviewers-grid" v-show="reviewersState.reviewers.length">
      <ReviewerItem
        v-for="reviewer in reviewersState.reviewers"
        :key="reviewer._id"
        :reviewer="reviewer"
      />
    </div>
  </div>
</template>

<style scoped>
@reference "#main.css";

.reviewers-container {
  @apply p-4;
}

.reviewers-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4;
}

@media (max-width: 640px) {
  .reviewers-grid {
    @apply grid-cols-1 gap-4 p-2;
  }
}
</style>
