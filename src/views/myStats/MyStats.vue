<script setup lang="ts">
import AppTitle from '@/components/AppTitle.vue'
import BaseBarMetric from '@/components/BaseBarMetric.vue'
import MetricPieChart from '@/components/charts/MetricPieChart.vue'
import { ChatBubbleBottomCenterTextIcon } from '@heroicons/vue/20/solid'
import { formatPercentageToRating } from '@/utils/StringUtils'
import ReviewService from '@/services/ReviewService'
import { useUserStore } from '@/stores/userStore'
import { useProfileStore } from '@/stores/profileStore'
import { useMetricsStore } from '@/stores/metricsStore'
import { ref } from 'vue'

const profileStore = useProfileStore()
const metricsStore = useMetricsStore()
const userStore = useUserStore()

let numReviews = ref(0)

ReviewService.getNumReviews(userStore.user.youTubeChannelId)
  .then((currentNumReviews) => {
    numReviews.value = currentNumReviews
  })
  .catch((err) => console.error(err))
</script>

<template>
  <div>
    <AppTitle>My Stats</AppTitle>
    <div
      v-if="profileStore.getIsReviewer && metricsStore.metrics.metric > 0"
      class="flex flex-col lg:flex-row gap-4"
    >
      <div class="app-card flex-1 hidden lg:flex max-w-md">
        <MetricPieChart :metric="metricsStore.metrics.metric" class="max-w-md" />
      </div>

      <div class="app-card flex flex-col gap-8 justify-center p-8 grow">
        <div class="flex items-center gap-2 border-b pb-8 border-orange-200">
          <div class="lg:hidden w-12 h-12 flex items-center justify-center rounded-lg text-xl">
            {{ formatPercentageToRating(metricsStore.metrics.metric) }}
          </div>
          <p class="lg:hidden block">Rating</p>
          <span class="lg:hidden block rounded-full w-1 h-1 bg-brand-200"></span>
          <p>{{ numReviews }} review{{ numReviews > 1 ? `s` : '' }}</p>
        </div>
        <BaseBarMetric
          label="Presentation"
          :percentage="metricsStore.metrics.avgOverallPresentation"
        />
        <BaseBarMetric label="Clarity" :percentage="metricsStore.metrics.avgClarity" />
        <BaseBarMetric
          label="Product Viewablity"
          :percentage="metricsStore.metrics.avgProductView"
        />
        <BaseBarMetric
          label="Detail Explanation"
          :percentage="metricsStore.metrics.avgProductDetailExplanation"
        />
        <BaseBarMetric label="Non Bias Review" :percentage="metricsStore.metrics.avgNonBias" />
        <BaseBarMetric
          label="Review Time"
          :percentage="metricsStore.metrics.avgAverageReviewTime"
        />
        <BaseBarMetric label="Product Focus" :percentage="metricsStore.metrics.avgProductFocus" />
        <BaseBarMetric label="Resources" :percentage="metricsStore.metrics.avgProvidedResources" />
      </div>
    </div>
    <div v-else class="mx-auto flex flex-col max-w-fit items-center space-y-2 text-center">
      <ChatBubbleBottomCenterTextIcon class="h-12 w-12 text-gray-500" />
      <span class="italic text-app-orange font-bold">NO REVIEWS YET!</span>
      <p>You haven't received any reviews yet.. check back later.</p>
    </div>
  </div>
</template>

<style scoped></style>
