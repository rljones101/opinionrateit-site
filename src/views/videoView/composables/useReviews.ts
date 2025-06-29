import { ref } from 'vue'
import type { Review } from '@/types'
import ReviewService from '@/services/ReviewService'
import { useRoute } from 'vue-router'

export function useReviews() {
  const reviews = ref<Review[]>([])
  const getReviews = () => {
    const route = useRoute()
    const videoId = route.params.videoId as string

    ReviewService.getReviewsByVideo(videoId).then((reviewList) => {
      reviews.value = reviewList
    })
  }
  return {
    reviews,
    getReviews
  }
}
