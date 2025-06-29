import ApiClient from '@/services/ApiClient'
import type { Review } from '@/types'

const getNumReviews = async (channelId: string) => {
  const response = await ApiClient.get<{ numReviews: number }>(`/reviews/${channelId}/numReviews`)
  return response.data.numReviews
}

const getReviewsByVideo = async (videoId: string) => {
  const response = await ApiClient.get<{ reviews: Review[] }>(`/reviews/${videoId}/byVideo`)
  return response.data.reviews
}

export default { getNumReviews, getReviewsByVideo }
