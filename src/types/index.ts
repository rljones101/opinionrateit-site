export interface Slide {
  id: number
  data: any
  style: { opacity: number }
}

export interface IconStartProps {
  color?: string
}

export interface AppApiResponse {
  status: string
  statusCode: number
  data: any
  originalData: any
}

export interface AppApiErrorResponse {
  status: string
  statusCode: number
  data?: any[]
  message: string
  originalData: any
}

export interface ChannelDetailsInterface {
  id: string
  name: string
  title: string
  description?: string
  channelThumbnail?: string
  publishedAt: string
  thumbnails: {
    default: {
      url: string
    }
    high?: {
      url?: string
    }
  }
  statistics: {
    commentCount: number
    hiddenSubscriberCount: boolean
    subscriberCount: number
    videoCount: number
    viewCount: number
  }
}

export interface VideoChannelDetails {
  videoId: string
  title: string
  description?: string
  creator?: string
  thumbnail: string
  reviews?: any[]
  selected: boolean
  isPublished?: boolean
}

export interface PublishedVideo {
  user: string
  title: string
  videoId: string
  channelId: string
  thumbnail: string
}

export interface Reviewer {
  _id?: string
  name: string
  createdAt: string
  avatar: string
  thumbnailMedium: string
  channelId: string
  description: string
  avgAverageReviewTime: number
  avgClarity: number
  avgNonBias: number
  avgOverallPresentation: number
  avgProductDetailExplanation: number
  avgProductFocus: number
  avgProductView: number
  avgProvidedResources: number
  avgShare: number
  metric: number
  numPublishedVideos: number
  views: number
}

export interface Review {
  _id?: string
  channelId: string
  videoId: string
  user: {
    email: string
    name: string
  }
  createdAt: string
  comment?: string
  average_review_time: number
  clarity: number
  non_bias: number
  overall_presentation: number
  product_focus: number
  product_detail_explanation: number
  product_view: number
  provided_resources: number
  share: number
}

export interface SurveyQuestion {
  id: number
  question: string
  model: {
    field: string
    value: number
  }
}
