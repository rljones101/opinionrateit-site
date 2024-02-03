<script setup lang="ts">
import AppTitle from '@/components/AppTitle.vue'
import ReviewerItem from '@/components/ReviewerItem.vue'
import { useReviewersStore } from '@/stores/reviewers';

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
  <div class="w-full">
    <AppTitle class="mb-8">Reviewers</AppTitle>
    <div class="grid-layout" v-show="reviewersState.reviewers.length">
      <ReviewerItem v-for="reviewer in reviewersState.reviewers" :key="reviewer._id" :reviewer="reviewer" />
    </div>
  </div>
</template>

<style scoped></style>
