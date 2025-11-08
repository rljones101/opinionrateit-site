import apiUtils from '@/utils/ApiUtils'
import type { VideoChannelDetails } from '@/types'
import type {
  GoogleApiChannel,
  GoogleApiChannelResponse,
  SearchResult
} from '@/models/GoogleApiModels'

const _videoInterface = (videoData: SearchResult): VideoChannelDetails => {
  return {
    videoId: videoData.id.videoId,
    channelId: videoData.id.channelId,
    title: videoData.snippet.title,
    description: videoData.snippet.description,
    creator: videoData.snippet.channelTitle,
    thumbnail: videoData.snippet.thumbnails.medium.url,
    selected: false
  }
}

const getVideosByChannelId = async (youtubeChannelId: string, query: string = '') => {
  const params = {
    part: 'snippet',
    type: 'video',
    order: 'date',
    maxResults: 12,
    q: query || '',
    channelId: youtubeChannelId, // UC3XdYJjWliOdKuZMNaTiP8Q - Z Reviews
    prevPageToken: '',
    nextPageToken: ''
  }

  try {
    const response = await apiUtils.get('search', params)
    return response.data.items.map((item: any) => {
      return _videoInterface(item)
    }) as VideoChannelDetails[]
  } catch (error: unknown) {
    console.log(error)
  }
}

const getRating = (videoId: string) => {
  const params = {
    id: videoId
  }
  return apiUtils
    .get('getRating', params)
    .then((res: any) => {
      return res.data
    })
    .catch((error: any) => console.log(error.response.data))
}

const getChannelDetails = async (channelId: string) => {
  if (!channelId) throw new Error('youtubeChannelId was not defined')

  try {
    const response = await apiUtils.get<GoogleApiChannelResponse>('channels', {
      id: channelId,
      part: 'contentDetails, snippet, statistics'
    })

    if (response.data.items.length === 0) return undefined
    return response.data.items[0] as GoogleApiChannel
  } catch (err) {
    throw new Error(`Could not get channel details with id (${channelId}:)`)
  }
}

const getVideoDataById = (videoId: string) => {
  const params = {
    part: 'snippet, contentDetails',
    id: videoId
  }

  return apiUtils.get('videos', params).then((response: any) => {
    return response.data
  })
}

const getVideos = () => {
  const params = {
    part: 'snippet',
    chart: 'mostPopular'
  }

  return apiUtils.get('videos', params).then((response: any) => {
    return response.data
  })
}

export default {
  getVideosByChannelId,
  getRating,
  getChannelDetails,
  getVideoDataById,
  getVideos
}
