<template>
  <div>
    <div v-if="!hasPublishedVideos">
      <h3 class="text-2xl font-bold">No published videos found</h3>
      <p>
        You have not published any videos for review. Please start by selecting one from your
        <span class="font-bold">My Youtube Videos</span> tab.
      </p>
    </div>

    <div v-else>
      <p class="mb-8">
        Below is a list of videos that have been published and are ready for review.
      </p>
      <transition name="fade">
        <div class="grid-layout">
          <VideoItem v-for="video in publishedVideos" :key="video.videoId" :video="video" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import VideoItem from '@/components/VideoItem.vue'

const props = defineProps<{
  publishedVideos: any[]
}>()

const hasPublishedVideos = props.publishedVideos.length > 0
</script>

<style lang="scss" scoped></style>
