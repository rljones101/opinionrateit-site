import { defineStore } from 'pinia'
import type { Reviewer } from '@/types'
import reviewerController from '@/controllers/reviewerController'

export type ReviewerState = {
  reviewers: Reviewer[]
}

export const useReviewersStore = defineStore('reviewers', {
  state: (): ReviewerState => {
    return {
      reviewers: []
    }
  },

  actions: {
    getReviewers() {
      reviewerController.getReviewers().then((reviewers: Reviewer[]) => {
        this.reviewers = reviewers
      })
    }
  }
})
