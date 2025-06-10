<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import type { VideoChannelDetails } from '@/types'
import VideoItem from '@/components/VideoItem.vue'
import { useReviewer } from '@/composables/useReviewer'
import ReviewerDetails from '@/views/reviewerVideos/partials/ReviewerDetails.vue'

const route = useRoute()
const router = useRouter()
const channelId = route.params.channelId as string
const showReview = (video: VideoChannelDetails) => {
  router.push({
    name: 'reviewers-channelId-reviews-videoId',
    params: { channelId, videoId: video.videoId }
  })
}

const { channelDetails, publishedVideos, getPublishedVideos, getReviewerDetails } =
  useReviewer(channelId)
if (channelId) {
  getPublishedVideos()
  getReviewerDetails()
}
</script>

<template>
  <div>
    <div>
      <router-link to="/reviewers" class="text-brand-500 hover:underline">Reviewers</router-link>
      / {{ channelDetails.name }}
    </div>

    <div v-if="channelId">
      <h2 class="font-bold mb-4">{{ channelDetails.title }}</h2>
      <ReviewerDetails />
      <div class="grid-layout w-full">
        <VideoItem
          v-for="video in publishedVideos"
          :key="video.videoId"
          :video="video"
          @click="showReview(video)"
        />
      </div>
    </div>
    <div v-if="channelId && publishedVideos.length === 0">
      <h2 class="font-bold text-white mb-4">No videos found</h2>
      This user has not submitted any videos for review yet.
    </div>
    <div v-else-if="!channelId">
      You did not select a user. Please choose a user from the reviewers list.
    </div>
  </div>
</template>

<style scoped>
.reviewer-details > p {
  display: block;
  padding: 1rem;
  border-radius: 1rem;
  text-align: center;
  @apply bg-brand-500;
}
/*
.reviewer-details__text {
  font-size: 1.25rem;
  color: white;
}
 */

.reviewer-details > p > * {
  display: flex;
  flex-direction: column;
}
</style>
