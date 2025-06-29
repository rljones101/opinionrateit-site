import { defineStore } from 'pinia'
import type { Reviewer } from '@/types'
import ReviewerService from '@/services/ReviewerService'
import { ref } from 'vue'

export type ReviewerState = {
  reviewers: Reviewer[]
}

export const useReviewersStore = defineStore('reviewers', () => {
  const reviewers = ref<Reviewer[]>([])

  const getReviewers = () => {
    ReviewerService.getReviewers().then((reviewersList: Reviewer[]) => {
      reviewers.value = reviewersList
    })
  }
  return {
    reviewers,
    getReviewers
  }
})
