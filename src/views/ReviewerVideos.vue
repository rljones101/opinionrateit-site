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
import { formatPercentageToRating } from '@/utils/StringUtils'
import UserAvatar from '@/components/UserAvatar.vue'

// Route instance
const route = useRoute()
const router = useRouter()

// reactive variables
const videos: Ref<VideoChannelDetails[]> = ref([])
const channelDetails = ref({
  avatar: '',
  name: '',
  title: '',
  description: ''
})
const stats = ref({
  metric: 0
})

// route params
const channelId = route.params.channelId as string

// methods
const showReview = (video) => {
  router.push({ name: 'reviewers-channelId-reviews-videoId', params: { videoId: video.videoId } })
}

if (channelId) {
  reviewerController.getPublishedVideos(channelId).then((res) => {
    videos.value = res
  })
}

const getReviewerDetails = async (channelId: string) => {
  try {
    const res = await reviewerController.getReviewerDetails(channelId)
    const reviewerData = res.data
    console.log(reviewerData)
    channelDetails.value = { ...reviewerData }
  } catch (err) {
    console.error(err)
  }
}

getReviewerDetails(channelId)
</script>

<template>
  <div class="mb-8">
    <router-link to="/reviewers" class="text-orange-500 hover:underline">Reviewers</router-link>
    / {{ channelDetails.name }}
  </div>

  <div v-if="channelId && videos.length">
    <h2 class="font-bold text-white mb-4">{{ channelDetails.title }}</h2>
    <div class="flex-1 bg-app-blue-soft p-8 rounded-lg mb-8">
      <div class="border-b pb-8 mb-8 border-slate-500 flex items-center gap-8">
        <UserAvatar :name="channelDetails.name" :src="channelDetails.avatar" class="w-16 h-16" />
        <div class="flex-1">
          <h2 class="text-lg text-white">{{ channelDetails.name }}</h2>
          <p>{{ channelDetails.description }}</p>
        </div>
      </div>

      <div class="flex items-center gap-2 pb-8">
        <div
          class="bg-app-blue w-12 h-12 flex items-center justify-center rounded-lg text-xl text-white"
        >
          {{ formatPercentageToRating(stats.metric) }}
        </div>
        <p>Rating</p>
        <span class="rounded-full w-1 h-1 bg-slate-500"></span>
        <p>376 reviews</p>
      </div>
    </div>

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
