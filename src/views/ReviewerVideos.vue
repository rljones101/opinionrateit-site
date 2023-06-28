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
import { formatPercentageToRating, nFormatter } from '@/utils/StringUtils'
import UserAvatar from '@/components/UserAvatar.vue'
import { formatDate } from '@/utils/DateUtils'
import ContentReadMore from '@/components/ContentReadMore.vue'

// Route instance
const route = useRoute()
const router = useRouter()

// reactive variables
const videos: Ref<VideoChannelDetails[]> = ref([])
const channelDetails = ref({
  avatar: '',
  name: '',
  title: '',
  description: '',
  views: 0,
  createdAt: '',
  numPublishedVideos: 0,
  metric: 0
})

// route params
const channelId = route.params.channelId as string

// methods
const showReview = (video) => {
  router.push({
    name: 'reviewers-channelId-reviews-videoId',
    params: { channelId, videoId: video.videoId }
  })
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
    channelDetails.value = { ...reviewerData }
  } catch (err) {
    console.error(err)
  }
}

getReviewerDetails(channelId)
</script>

<template>
  <div>
    <div class="mb-8">
      <router-link to="/reviewers" class="text-orange-500 hover:underline">Reviewers</router-link>
      / {{ channelDetails.name }}
    </div>

    <div v-if="channelId">
      <h2 class="font-bold text-white mb-4">{{ channelDetails.title }}</h2>
      <div class="flex-1 bg-app-blue-soft p-8 rounded-lg mb-8">
        <div class="border-b pb-8 mb-8 border-slate-500 flex items-center gap-8">
          <UserAvatar :name="channelDetails.name" :src="channelDetails.avatar" class="w-16 h-16" />
          <div class="flex-1">
            <h2 class="text-lg text-white">{{ channelDetails.name }}</h2>
            <ContentReadMore>
              {{ channelDetails.description }}
            </ContentReadMore>
          </div>
        </div>
        <div class="reviewer-details grid-layout">
          <p>
            <span class="reviewer-details__text !text-app-orange"
              >{{ formatPercentageToRating(channelDetails.metric) }} / 10</span
            >
            <span class="reviewer-details__label">Rating</span>
          </p>
          <p>
            <span class="reviewer-details__text">{{
              formatDate(channelDetails.createdAt, 'short_no_time')
            }}</span>
            <span class="reviewer-details__label">Joined</span>
          </p>
          <p>
            <span class="reviewer-details__text">{{
              nFormatter(channelDetails.numPublishedVideos, 1)
            }}</span>
            <span class="reviewer-details__label">videos</span>
          </p>
          <p>
            <span class="reviewer-details__text"> {{ nFormatter(channelDetails.views, 1) }}</span>
            <span class="reviewer-details__label">views</span>
          </p>
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
    <div v-if="channelId && videos.length === 0">
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
  @apply bg-app-blue;
}

.reviewer-details__text {
  font-size: 1.25rem;
  color: white;
}

.reviewer-details > p > * {
  display: flex;
  flex-direction: column;
}
</style>
