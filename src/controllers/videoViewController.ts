import GoogleAPIService from '@/services/GoogleAPIService'
import { apiGet } from '@/utils/AppApi'

const googleAPI = new GoogleAPIService()

const getVideo = (videoId: string) => {
  return googleAPI.getVideoDataById(videoId)
}

const getReviewsByVideo = (videoId: string) => {
  return apiGet(`/reviews/${videoId}/byVideo`)
}

export default {
  getVideo,
  getReviewsByVideo
}
