// import axios from 'axios';
import { apiGet, apiPost } from '@/utils/AppApi'
import type { PublishedVideo } from '@/types'

// Doc template for quick inserts

// {
//   "reviewer": "647d259da25386bd5c01b90d",
//   "user": "1234",
//   "comment": "This was a really good review",
//   "metrics": {
//     "clarity": 80,
//     "product_view": 70,
//     "product_detail_explanation": 60,
//     "non_bias": 70,
//     "average_review_time": 50,
//     "product_focus": 60,
//     "provided_resources": 80,
//     "share": 80,
//     "overall_presentation": 90
//   }
// }

const getReviewers = async (query?: URLSearchParams) => {
  try {
    let url = '/reviewers'
    if (query) {
      url += `?${new URLSearchParams(query)}`
    }

    const res = await apiGet(url)
    return [...res.data.data].map((reviewerChannel) => {
      return { ...reviewerChannel, id: reviewerChannel._id }
    })
  } catch (err) {
    console.error(err)
  }
}

const getPublishedVideos = async (channelId: string) => {
  return await apiGet(`/reviewers/${channelId}/publishedVideos`)
}

const publishVideos = async (videos: PublishedVideo[]) => {
  return await apiPost('/publishedVideos', { videos })
}

export { getReviewers, getPublishedVideos, publishVideos }
