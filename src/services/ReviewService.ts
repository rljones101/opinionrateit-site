import { apiGet } from '@/utils/AppApi'

const getNumReviews = async (channelId: string) => {
  return await apiGet(`/reviews//${channelId}/numReviews`)
}

export { getNumReviews }
