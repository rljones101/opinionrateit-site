<script setup lang="ts">
import PageContainer from '@/components/containers/PageContainer.vue'
import BaseBarMetric from '@/components/BaseBarMetric.vue'
import VideoItem from '@/components/VideoItem.vue'
</script>

<template>
  <PageContainer class="flex gap-8">
    <aside class="p-8">
      <div class="flex gap-8">
        <div class="avatar avatar-temp"></div>
        <div>
          <h3 class="font-bold text-2xl text-white">Jeremy Rose</h3>
          <a href="" class="text-orange-500">jeremyrose@company.com</a>
          <p>Reviews: 1.2k</p>
        </div>
      </div>
      <div class="flex flex-col items-center p-8 pb-0">
        <p>Metric Score</p>
        <h1 class="text-4xl font-bold text-white">65%</h1>
      </div>
      <BaseBarMetric label="Presentation" :percentage="70" />
      <BaseBarMetric label="Clarity" :percentage="25" />
      <BaseBarMetric label="Product Viewablity" :percentage="70" />
      <BaseBarMetric label="Detail Explanation" :percentage="30" />
      <BaseBarMetric label="Non Bias Review" :percentage="20" />
      <BaseBarMetric label="Review Time" :percentage="50" />
      <BaseBarMetric label="Product Focus" :percentage="80" />
      <BaseBarMetric label="Resources" :percentage="15" />
    </aside>
    <main class="w-full">
      <div class="grid-layout w-full">
        <VideoItem label="LA90 Descrete" />
        <VideoItem label="ZMF Caldera" />
        <VideoItem label="Ferrum Oor" />
        <VideoItem label="Feliks Audio Euforia" />
        <VideoItem label="Meze Audio" />
        <VideoItem label="HD 6XX" />
        <VideoItem label="HyperX Microphone" />
        <VideoItem label="Topping A90" />
      </div>
    </main>
  </PageContainer>
</template>

<style scoped>
.avatar {
  width: 73px;
  height: 73px;
  border-radius: 50%;
}

.avatar-temp {
  background-color: #d9d9d9;
}
</style>
