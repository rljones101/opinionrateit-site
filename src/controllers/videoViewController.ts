import GoogleAPIService from '@/services/GoogleAPIService'
import { apiGet } from '@/utils/AppApi'
import type { Review } from '@/types'

const fields = [
  'average_review_time',
  'clarity',
  'non_bias',
  'overall_presentation',
  'product_detail_explanation',
  'product_focus',
  'product_view',
  'provided_resources',
  'share'
]

const googleAPI = new GoogleAPIService()

const getVideo = (videoId: string) => {
  return googleAPI.getVideoDataById(videoId)
}

const getReviewsByVideo = (videoId: string) => {
  return apiGet(`/reviews/${videoId}/byVideo`)
}

const getColor = (value: number) => {
  return `hsl(${value},100%,50%)`
}

const reviewMetric = (review: Review) => {
  const sum = fields.reduce((acc, field) => {
    let currentValue = 0
    if (field in review) {
      // @ts-ignore
      currentValue = review[field]
    }
    return acc + currentValue
  }, 0)

  const average = sum / fields.length
  return Math.round(average)
}

export default {
  getVideo,
  getReviewsByVideo,
  getColor,
  reviewMetric
}
