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
}
