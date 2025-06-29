import * as userService from '@/services/UserService'

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

export default {
  getReviewerMetrics
}
