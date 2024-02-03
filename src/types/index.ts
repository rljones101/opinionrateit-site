export interface User {
  _id: string,
  name: string,
  email: string
}

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

export interface Video {
  _id: string,
  videoId: string,
  channelId: string,
  title: string,
  thumbnail: string,
  selected: boolean
}

export interface PublishedVideo extends Video {
  user: User
  active: boolean
  id: string
}

export interface VideoChannelDetails extends Video {
  description?: string
  creator?: string
  reviews?: any[]
  isPublished?: boolean
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

export interface SignupPlan {
  name: string
  role: string
  priceKey: string
  cost: number
  yearlyDiscount: number
  allowedReviewerAccess: boolean
  giveReviewerFeedback: boolean
  bookmarkReviewer: boolean
  addYourReviews: boolean
  metricAnalysis: boolean
  patreonSupport: boolean
  vinmeo: boolean
  twitter: boolean
  steps: string[]
}

export interface BillingDetails {
  name: string
  email: string
  address: {
    city: string
    line1: string
    state: string
    postal_code: string
  }
}

export interface Profile {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  youTubeChannelId: string
  isReviewer: boolean
  videos: VideoChannelDetails[]
  publishedVideos: VideoChannelDetails[]
  numberOfPublishedVideos?: number
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
}
