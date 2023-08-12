<script setup lang="ts">
import AppTitle from '@/components/AppTitle.vue'
import BaseBarMetric from '@/components/BaseBarMetric.vue'
import MetricPieChart from '@/components/charts/MetricPieChart.vue'
import { useProfile } from '@/composables/useProfile'
import { ChatBubbleBottomCenterTextIcon } from '@heroicons/vue/20/solid'
import { formatPercentageToRating } from '@/utils/StringUtils'
const { profile } = useProfile()
</script>

<template>
  <div>
    <AppTitle class="mb-8">My Stats</AppTitle>
    <div v-if="profile.isReviewer && profile.metric > 0" class="flex flex-col lg:flex-row gap-4">
      <div class="app-card flex-1 hidden lg:flex max-w-md">
        <MetricPieChart :metric="profile.metric" class="max-w-md" />
      </div>

      <div class="app-card flex flex-col gap-8 justify-center p-8 grow">
        <div class="flex items-center gap-2 border-b pb-8 border-orange-200 text-orange-200">
          <div
            class="bg-app-blue lg:hidden w-12 h-12 flex items-center justify-center rounded-lg text-xl"
          >
            {{ formatPercentageToRating(profile.metric) }}
          </div>
          <p class="lg:hidden block">Rating</p>
          <span class="lg:hidden block rounded-full w-1 h-1 bg-orange-200"></span>
          <p>376 reviews</p>
        </div>
        <BaseBarMetric label="Presentation" :percentage="profile.avgOverallPresentation" />
        <BaseBarMetric label="Clarity" :percentage="profile.avgClarity" />
        <BaseBarMetric label="Product Viewablity" :percentage="profile.avgProductView" />
        <BaseBarMetric
          label="Detail Explanation"
          :percentage="profile.avgProductDetailExplanation"
        />
        <BaseBarMetric label="Non Bias Review" :percentage="profile.avgNonBias" />
        <BaseBarMetric label="Review Time" :percentage="profile.avgAverageReviewTime" />
        <BaseBarMetric label="Product Focus" :percentage="profile.avgProductFocus" />
        <BaseBarMetric label="Resources" :percentage="profile.avgProvidedResources" />
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
