import GoogleAPIService from '@/services/GoogleAPIService'
import { apiGet, apiPost } from '@/utils/AppApi'
import type { Review } from '@/types'

const fields = [
  'average_review_time',
  'clarity',
  'non_bias',
  'overall_presentation',
  'product_detail_explanation',
  'product_focus',
  'product_view',
  'provided_resources'
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

const getReviewQuestions = () => {
  return [
    {
      id: 1,
      question: 'You thought the overall presentation was well lit and easy to see and understand',
      model: { field: 'overall_presentation', value: 0 }
    },
    {
      id: 2,
      question: 'You thought the reviewer was easy to understand and explained the product',
      model: { field: 'clarity', value: 0 }
    },
    {
      id: 3,
      question: 'You were able to see the product in great detail',
      model: { field: 'product_view', value: 0 }
    },
    {
      id: 4,
      question: 'You understand the pros and cons about the product',
      model: { field: 'product_detail_explanation', value: 0 }
    },
    {
      id: 5,
      question: 'You believe the reviewer was fair and did not let his opinion matter',
      model: { field: 'non_bias', value: 0 }
    },
    {
      id: 6,
      question: 'You believe the review was just long enough to explain just the needed details',
      model: { field: 'average_review_time', value: 0 }
    },
    {
      id: 7,
      question: 'The focus of the review was clear and only talked about the product',
      model: { field: 'product_focus', value: 0 }
    },
    {
      id: 8,
      question: 'The presenter provided additional resources that were reflected in this review',
      model: { field: 'provided_resources', value: 0 }
    }
  ]
}

const addReview = async (reviewForm: any) => {
  return await apiPost('/reviews', reviewForm)
}

export default {
  getVideo,
  getReviewsByVideo,
  getReviewQuestions,
  getColor,
  reviewMetric,
  addReview
}
