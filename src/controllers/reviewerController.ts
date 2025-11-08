import type { Reviewer } from '@/types'

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

export default {
  convertDataToReviewer
}
