import { type MaybeRefOrGetter, ref, toValue, watch } from 'vue'
import type { PublishedVideo } from '@/types'
import ReviewerService from '@/services/ReviewerService'
import VideoService from '@/services/VideoService'

export function useReviewer(channelId: MaybeRefOrGetter<string>) {
  const publishedVideos = ref<PublishedVideo[]>([])
  const _channelId = ref(toValue(channelId))

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
    publishedVideos.value = await VideoService.getPublishedVideosByChannelId(_channelId.value)
  }

  const getReviewerDetails = async () => {
    if (!_channelId.value) return
    try {
      const res = await ReviewerService.getReviewerDetails(_channelId.value)
      const reviewerData = res.data
      channelDetails.value = { ...reviewerData }
    } catch (err) {
      console.log('Not able to get the reviewer details.')
      console.error(err)
    }
  }

  watch(
    () => toValue(channelId),
    async (value) => {
      _channelId.value = value
      if (_channelId.value) {
        console.log('has channelId')
        await getReviewerDetails()
        await getPublishedVideos()
        await getReviewerDetails()
      }
    },
    { immediate: true }
  )

  return {
    publishedVideos,
    channelDetails
  }
}
