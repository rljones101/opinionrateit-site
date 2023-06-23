<script setup lang="ts">
import AppTitle from '@/components/AppTitle.vue'
import BaseBarMetric from '@/components/BaseBarMetric.vue'
import { useProfile } from '@/composables/useProfile'
// import videoViewController from '@/controllers/videoViewController'
import MetricPieChart from '@/components/charts/MetricPieChart.vue'
const { profile } = useProfile()
</script>

<template>
  <AppTitle class="mb-8">My Stats</AppTitle>
  <div class="flex gap-8" v-if="profile.isReviewer">
    <div
      class="relative flex-1 flex flex-col gap-8 items-center w-full bg-app-blue-soft rounded-lg p-8"
    >
      <label class="text-white font-bold">Metric Score</label>
      <MetricPieChart :metric="profile.metric" />
    </div>
    <div class="flex flex-1 flex-col bg-app-blue-soft rounded-lg p-8">
      <BaseBarMetric label="Presentation" :percentage="profile.avgOverallPresentation" />
      <BaseBarMetric label="Clarity" :percentage="profile.avgClarity" />
      <BaseBarMetric label="Product Viewablity" :percentage="profile.avgProductView" />
      <BaseBarMetric label="Detail Explanation" :percentage="profile.avgProductDetailExplanation" />
      <BaseBarMetric label="Non Bias Review" :percentage="profile.avgNonBias" />
      <BaseBarMetric label="Review Time" :percentage="profile.avgAverageReviewTime" />
      <BaseBarMetric label="Product Focus" :percentage="profile.avgProductFocus" />
      <BaseBarMetric label="Resources" :percentage="profile.avgProvidedResources" />
    </div>
  </div>
</template>

<style scoped></style>
