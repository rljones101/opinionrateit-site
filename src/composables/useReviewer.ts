import { type MaybeRefOrGetter, ref, type Ref, toValue } from 'vue'
import type { PublishedVideo } from '@/types'
import reviewerController from '@/controllers/reviewerController'

export function useReviewer(channelId: MaybeRefOrGetter<string>) {
  const publishedVideos: Ref<PublishedVideo[]> = ref([])

  const channelDetails = ref({
    avatar: '',
    name: '',
    title: '',
    description: '',
    views: 0,
    createdAt: '',
    numPublishedVideos: 0,
    metric: 0
  })

  const getPublishedVideos = async () => {
    publishedVideos.value = await reviewerController.getPublishedVideos(toValue(channelId))
  }

  const getReviewerDetails = async () => {
    try {
      const res = await reviewerController.getReviewerDetails(toValue(channelId))
      const reviewerData = res.data
      channelDetails.value = { ...reviewerData }
    } catch (err) {
      console.error(err)
    }
  }

  return {
    publishedVideos,
    getPublishedVideos,
    channelDetails,
    getReviewerDetails
  }
}
