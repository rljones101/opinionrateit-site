<script setup lang="ts">
import AppTitle from '@/components/AppTitle.vue'
import reviewerController from '@/controllers/reviewerController'
import ReviewerItem from '@/components/ReviewerItem.vue'

import { ref } from 'vue'
import type { Reviewer } from '@/types'

let list = ref<Reviewer[]>([])
// let search = ref('')

reviewerController.getReviewers().then((reviewers: Reviewer[]) => {
  list.value = reviewers
})

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
    <div class="grid-layout" v-show="list.length">
      <ReviewerItem v-for="reviewer in list" :key="reviewer._id" :reviewer="reviewer" />
    </div>
  </div>
</template>

<style scoped></style>
