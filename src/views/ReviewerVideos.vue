<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// types
import type { Ref } from 'vue'
import type { VideoChannelDetails } from '@/types'
// controllers
import reviewerController from '@/controllers/reviewerController'
// templates
import VideoItem from '@/components/VideoItem.vue'

// Route instance
const route = useRoute()
const router = useRouter()

// reactive variables
const videos: Ref<VideoChannelDetails[]> = ref([])
const channelDetails = ref({
  title: '',
  description: ''
})

// route params
const channelId = route.params.channelId as string

// methods
const showReview = (video) => {
  router.push({ name: 'reviewers-channelId-reviews-videoId', params: { videoId: video.videoId } })
}

if (channelId) {
  reviewerController.getPublishedVideos(channelId, 'channel').then((res) => {
    videos.value = res
  })
}

reviewerController.getChannelDetails(channelId).then((res) => {
  console.log(res)
  const snippet = res.snippet
  channelDetails.value.title = snippet.localized.title ? snippet.localized.title : snippet.title
  channelDetails.value.description = snippet.localized.description
    ? snippet.localized.description
    : snippet.description
})
</script>

<template>
  <div class="mb-8">
    <router-link to="/reviewers" class="text-orange-500 hover:underline">Reviewers</router-link>
    / {{ channelDetails.title }}
  </div>

  <div v-if="channelId && videos.length">
    <h2 class="font-bold text-white mb-4">{{ channelDetails.title }}</h2>

    <p class="mb-8">{{ channelDetails.description }}</p>
    <div class="grid-layout w-full">
      <VideoItem
        v-for="video in videos"
        :key="video.videoId"
        :video="video"
        @click="showReview(video)"
      />
    </div>
  </div>
  <div v-else-if="channelId && videos.length === 0">
    <h2 class="font-bold text-white mb-4">No videos found</h2>
    This user has not submitted any videos for review yet.
  </div>
  <div v-else-if="!channelId">
    You did not select a user. Please choose a user from the reviewers list.
  </div>
</template>

<style scoped></style>
