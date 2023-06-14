<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
// types
import type { Ref } from 'vue'
import type { VideoChannelDetails } from '@/types'
// controllers
import reviewerController from '@/controllers/reviewerController'
// templates
import PageContainer from '@/components/containers/PageContainer.vue'
import VideoItem from '@/components/VideoItem.vue'

// Route instance
const route = useRoute()

// reactive variables
const videos: Ref<VideoChannelDetails[]> = ref([])

// route params
const channelId = route.params.channelId as string

if (channelId) {
  reviewerController.getPublishedVideos(channelId, 'channel').then((res) => {
    videos.value = res
  })
}
</script>

<template>
  <PageContainer>
    <div class="grid-layout w-full" v-if="channelId && videos.length">
      <VideoItem v-for="video in videos" :key="video.videoId" :video="video" />
    </div>
    <div v-else-if="channelId && videos.length === 0">
      This user has not submitted any videos for review yet.
    </div>
    <div v-else-if="!channelId">
      You did not select a user. Please choose a user from the reviewers list.
    </div>
  </PageContainer>
</template>

<style scoped></style>
