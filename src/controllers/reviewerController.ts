import GoogleAPIService from '@/services/GoogleAPIService'
import type { Reviewer } from '@/types'

const googleApiService = new GoogleAPIService()

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
  getChannelDetails,
  getInitials,
  convertDataToReviewer
}
