import GoogleAPIService from '@/services/GoogleAPIService'
import * as reviewerService from '@/services/ReviewerService'
import type { PublishedVideo } from '@/types'
import type { Reviewer } from '@/types'
import * as userService from '@/services/UserService'
import { apiGet } from '@/utils/AppApi'

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

const getReviewerDetails = async (channelId: string) => {
  return apiGet(`/reviewers/${channelId}`)
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

const getVideosByChannelId = async (youTubeChannelId: string, search: string = '') => {
  let path = `/youtube?channelId=${youTubeChannelId}`
  path = search !== '' ? `${path}&search=${search}` : path
  const res = await apiGet(path)
  return res.data.data
}

const searchVideos = async (youTubeChannelId: string, searchParams: string) => {
  return getVideosByChannelId(youTubeChannelId, searchParams)
}

const getPublishedVideos = async (channelId: string): Promise<PublishedVideo[]> => {
  const res = await reviewerService.getPublishedVideos(channelId)
  return res.data.data as PublishedVideo[]
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
    avatar: slideData.avatar,
    thumbnailMedium: slideData.thumbnailMedium,
    numPublishedVideos: slideData.numPublishedVideos,
    description: slideData.description,
    createdAt: slideData.createdAt,
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
    metric: slideData.metric,
    views: slideData.views
  }
}

const getInitials = (name: string) => {
  const initialsArr: string[] = name.split(' ')
  return initialsArr.length > 1
    ? initialsArr[0].charAt(0) + initialsArr[1].charAt(0)
    : initialsArr[0].charAt(0)
}

export default {
  getVideos,
  getChannelDetails,
  getReviewerDetails,
  getVideosByChannelId,
  getReviewers,
  getPublishedVideos,
  getReviewerMetrics,
  getInitials,
  publishVideos,
  searchVideos,
  convertDataToReviewer
}
