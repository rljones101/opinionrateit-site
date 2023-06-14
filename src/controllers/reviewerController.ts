import GoogleAPIService from '@/services/GoogleAPIService'
import * as reviewerService from '@/services/ReviewerService'
import { getMultipleVideos } from '@/utils/googleAPI'
import type { PublishedVideo } from '@/types'

const googleApiService = new GoogleAPIService()

const getReviewers = async (query?: URLSearchParams) => await reviewerService.getReviewers(query)

const getVideos = async (youtubeChannelId: string) => {
  try {
    let videos = []
    if (youtubeChannelId) {
      videos = await googleApiService.getVideosByChannelId(youtubeChannelId)
    }
    return videos
  } catch (err) {
    return new Error(`Could not get videos with id (${youtubeChannelId})`)
  }
}

const getChannelDetails = async (youtubeChannelId: string) => {
  if (!youtubeChannelId) throw new Error('youtubeChannelId was not defined')

  try {
    const response = await googleApiService.getChannelDetails(youtubeChannelId)
    if (response.data && response.data.items.length) {
      return response.data.items[0]
    }
  } catch (err) {
    throw new Error(`Could not get channel details with id (${youtubeChannelId}:)`)
  }
}

const getVideosByChannelId = (youTubeChannelId: string) => {
  return googleApiService.getVideosByChannelId(youTubeChannelId)
}

const searchVideos = async (youTubeChannelId: string, searchParams: string) => {
  //const reformattedSearchString = searchParams.split(' ');
  if (youTubeChannelId) {
    const query = searchParams.split(' ').join('+')
    return await googleApiService.getVideosByChannelId(youTubeChannelId, query)
  }
}

const getPublishedVideos = async (id: string, type = 'user') => {
  const res = await reviewerService.getPublishedVideos(id, type)
  const publishedVideos = [...res.data.data].map((video) => video.videoId)
  return await getMultipleVideos(publishedVideos)
}

const publishVideos = async (videos: PublishedVideo[]) => {
  return await reviewerService.publishVideos(videos)
}

export default {
  getVideos,
  getChannelDetails,
  getVideosByChannelId,
  getReviewers,
  getPublishedVideos,
  publishVideos,
  searchVideos
}
