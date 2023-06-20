import GoogleAPIService from '@/services/GoogleAPIService'
import * as reviewerService from '@/services/ReviewerService'
import { getMultipleVideos } from '@/utils/googleAPI'
import type { PublishedVideo } from '@/types'
import type { Reviewer } from '@/types'
import * as userService from '@/services/UserService'

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

const getReviewerMetrics = async (channelId: string) => {
  const metrics = {
    metric: 0,
    avgAverageReviewTime: 0,
    avgClarity: 0,
    avgNonBias: 0,
    avgOverallPresentation: 0,
    avgProductDetailExplanation: 0,
    avgProductFocus: 0,
    avgProductView: 0,
    avgProvidedResources: 0,
    avgShare: 0
  }
  if (channelId) {
    const res = await userService.getReviewerChannel(channelId)
    metrics.metric = res.data.metric
    metrics.avgAverageReviewTime = res.data.avgAverageReviewTime
    metrics.avgClarity = res.data.avgClarity
    metrics.avgNonBias = res.data.avgNonBias
    metrics.avgOverallPresentation = res.data.avgOverallPresentation
    metrics.avgProductDetailExplanation = res.data.avgProductDetailExplanation
    metrics.avgProductFocus = res.data.avgProductFocus
    metrics.avgProductView = res.data.avgProductView
    metrics.avgProvidedResources = res.data.avgProvidedResources
    metrics.avgShare = res.data.avgShare
  }

  return metrics
}

const convertDataToReviewer = (slideData: any): Reviewer => {
  return {
    _id: slideData._id,
    name: slideData.name,
    channelId: slideData.channelId,
    avgAverageReviewTime: slideData.avgAverageReviewTime,
    avgClarity: slideData.avgClarity,
    avgNonBias: slideData.avgNonBias,
    avgOverallPresentation: slideData.avgOverallPresentation,
    avgProductDetailExplanation: slideData.avgProductDetailExplanation,
    avgProductFocus: slideData.avgProductFocus,
    avgProductView: slideData.avgProductView,
    avgProvidedResources: slideData.avgProvidedResources,
    avgShare: slideData.avgShare,
    metric: slideData.metric
  }
}

export default {
  getVideos,
  getChannelDetails,
  getVideosByChannelId,
  getReviewers,
  getPublishedVideos,
  getReviewerMetrics,
  publishVideos,
  searchVideos,
  convertDataToReviewer
}
