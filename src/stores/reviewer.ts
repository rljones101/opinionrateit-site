import { ref, type Ref } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
import reviewerController from '@/controllers/reviewerController'
import type { PublishedVideo } from '@/types'

export const useReviewerStore = defineStore('reviewerVideos', () => {
  const publishedVideos: Ref<PublishedVideo[]> = ref([])
  const getPublishedVideos = async (channelId: string) => {
    publishedVideos.value = await reviewerController.getPublishedVideos(channelId)
  }

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
  const getReviewerDetails = async (channelId: string) => {
    try {
      const res = await reviewerController.getReviewerDetails(channelId)
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
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useReviewerStore, import.meta.hot))
}
