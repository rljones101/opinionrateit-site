import type {
  AppApiErrorResponse,
  AppApiResponse,
  PublishedVideo,
  VideoChannelDetails
} from '@/types'
import ApiClient from '@/services/ApiClient'

const getVideoList = async (query = {}) => {
  let url = '/publishedVideos'
  if (Object.keys(query).length > 0) {
    url += `/search?${new URLSearchParams(query)}`
  }
  const res = await ApiClient.get(url)
  return res.data as VideoChannelDetails[]
}

const getPublishedVideosByChannelId = async (channelId: string) => {
  const response = await ApiClient.get<{ videos: PublishedVideo[] }>(
    `/reviewers/${channelId}/publishedVideos`
  )
  return response.data.videos
}

const getVideosByChannelId = async (
  youTubeChannelId: string,
  search: string = ''
): Promise<PublishedVideo[]> => {
  let path = `/youtube?channelId=${youTubeChannelId}`
  path = search !== '' ? `${path}&search=${search}` : path
  const response = await ApiClient.get<{ videos: PublishedVideo[] }>(path)
  return response.data.videos
}

const publishVideos = async (
  videos: PublishedVideo[]
): Promise<AppApiResponse | AppApiErrorResponse> => {
  return await ApiClient.post('/publishedVideos', { videos })
}

const searchVideosByChannel = async (youTubeChannelId: string, searchParams: string) => {
  return getVideosByChannelId(youTubeChannelId, searchParams)
}

export default {
  getVideoList,
  getPublishedVideosByChannelId,
  getVideosByChannelId,
  publishVideos,
  searchVideosByChannel
}
