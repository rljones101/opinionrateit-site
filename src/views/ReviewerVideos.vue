<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import type { VideoChannelDetails } from '@/types'
import VideoItem from '@/components/VideoItem.vue'
import { formatPercentageToRating, nFormatter } from '@/utils/StringUtils'
import UserAvatar from '@/components/UserAvatar.vue'
import { formatDate } from '@/utils/DateUtils'
import ContentReadMore from '@/components/ContentReadMore.vue'
import { useReviewerStore } from '@/stores/reviewer'

const route = useRoute()
const router = useRouter()
const channelId = route.params.channelId as string
const showReview = (video: VideoChannelDetails) => {
  router.push({
    name: 'reviewers-channelId-reviews-videoId',
    params: { channelId, videoId: video.videoId }
  })
}

const reviewer = useReviewerStore()
if (channelId) {
  reviewer.getPublishedVideos(channelId)
  reviewer.getReviewerDetails(channelId)
}
</script>

<template>
  <div>
    <div class="mb-8">
      <router-link to="/reviewers" class="text-orange-500 hover:underline">Reviewers</router-link>
      / {{ reviewer.channelDetails.name }}
    </div>

    <div v-if="channelId">
      <h2 class="font-bold text-white mb-4">{{ reviewer.channelDetails.title }}</h2>
      <div class="flex-1 bg-app-blue-soft p-8 rounded-lg mb-8">
        <div class="border-b pb-8 mb-8 border-slate-500 flex items-center gap-8">
          <UserAvatar
            :name="reviewer.channelDetails.name"
            :src="reviewer.channelDetails.avatar"
            class="w-16 h-16"
          />
          <div class="flex-1 text-orange-100">
            <h2 class="text-lg text-white">{{ reviewer.channelDetails.name }}</h2>
            <ContentReadMore>
              {{ reviewer.channelDetails.description }}
            </ContentReadMore>
          </div>
        </div>
        <div class="reviewer-details grid-layout">
          <div
            class="flex flex-col justify-center items-center bg-app-blue rounded-xl text-orange-100 p-4"
          >
            <p class="text-sm">Rating</p>
            <p class="text-lg">
              <span class="font-semibold text-app-orange">
                {{ formatPercentageToRating(reviewer.channelDetails.metric) }}
              </span>

              / 10
            </p>
          </div>

          <div
            class="flex flex-col justify-center items-center bg-app-blue rounded-xl text-orange-100 p-4"
          >
            <p class="text-sm">Joined</p>
            <p class="text-lg">
              <span class="font-semibold text-app-orange">
                {{ formatDate(reviewer.channelDetails.createdAt, 'short_no_time') }}
              </span>
            </p>
          </div>

          <div
            class="flex flex-col justify-center items-center bg-app-blue rounded-xl text-orange-100 p-4"
          >
            <p class="text-sm">Videos</p>
            <p class="text-lg">
              <span class="font-semibold text-app-orange">
                {{ nFormatter(reviewer.channelDetails.numPublishedVideos, 1) }}
              </span>
            </p>
          </div>

          <div
            class="flex flex-col justify-center items-center bg-app-blue rounded-xl text-orange-100 p-4"
          >
            <p class="text-sm">Views</p>
            <p class="text-lg">
              <span class="font-semibold text-app-orange">
                {{ nFormatter(reviewer.channelDetails.views, 1) }}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div class="grid-layout w-full">
        <VideoItem
          v-for="video in reviewer.publishedVideos"
          :key="video.videoId"
          :video="video"
          @click="showReview(video)"
        />
      </div>
    </div>
    <div v-if="channelId && reviewer.publishedVideos.length === 0">
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
