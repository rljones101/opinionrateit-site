import { defineStore } from 'pinia'
import { type MaybeRefOrGetter, ref, toValue } from 'vue'
import type { Profile } from '@/types'
import MetricsService from '@/services/MetricsService'

export const useMetricsStore = defineStore('useMetricsStore', () => {
  const metrics = ref({
    avgAverageReviewTime: 0,
    avgClarity: 0,
    avgNonBias: 0,
    avgOverallPresentation: 0,
    avgProductDetailExplanation: 0,
    avgProductFocus: 0,
    avgProductView: 0,
    avgProvidedResources: 0,
    avgShare: 0,
    metric: 0
  })

  const updateMetrics = async (userProfile: MaybeRefOrGetter<Profile>) => {
    const profile = toValue(userProfile)
    if (!profile.youTubeChannelId) return
    metrics.value = await MetricsService.getReviewerMetrics(profile.youTubeChannelId)
  }

  return {
    metrics,
    updateMetrics
  }
})
