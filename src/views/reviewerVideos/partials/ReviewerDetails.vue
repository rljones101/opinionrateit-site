<script setup lang="ts">
import { formatPercentageToRating, nFormatter } from '@/utils/StringUtils'
import { formatDate } from '@/utils/DateUtils'
import UserAvatar from '@/components/UserAvatar.vue'
import ContentReadMore from '@/components/ContentReadMore.vue'
import { useRoute } from 'vue-router'
import { useReviewer } from '@/composables/useReviewer'

const route = useRoute()
const channelId = route.params.channelId as string
const { channelDetails, getReviewerDetails } = useReviewer(channelId)
if (channelId) {
  getReviewerDetails()
}
</script>

<template>
  <div class="flex-1 gap-2">
    <div class="reviewer-details grid-layout mb-4 p-4 bg-secondary-50 rounded">
      <div class="flex flex-col justify-center items-center bg-secondary-200 rounded p-2">
        <p class="text-sm">Rating</p>
        <p class="text-lg">
          <span class="font-semibold text-brand-500">
            {{ formatPercentageToRating(channelDetails.metric) }}
          </span>
        </p>
      </div>

      <div class="flex flex-col justify-center items-center bg-secondary-200 rounded p-2">
        <p class="text-sm">Joined</p>
        <p class="text-lg">
          <span class="font-semibold text-brand-500">
            {{ formatDate(channelDetails.createdAt, 'short_no_time') }}
          </span>
        </p>
      </div>

      <div class="flex flex-col justify-center items-center bg-secondary-200 rounded p-2">
        <p class="text-sm">Videos</p>
        <p class="text-lg">
          <span class="font-semibold text-brand-500">
            {{ nFormatter(channelDetails.numPublishedVideos, 1) }}
          </span>
        </p>
      </div>

      <div class="flex flex-col justify-center items-center bg-secondary-200 rounded p-2">
        <p class="text-sm">Views</p>
        <p class="text-lg">
          <span class="font-semibold text-brand-500">
            {{ nFormatter(channelDetails.views, 1) }}
          </span>
        </p>
      </div>
    </div>
    <div class="mb-4 flex items-center p-4 gap-8 bg-secondary-50 rounded">
      <UserAvatar
        :user="{
          name: channelDetails.name,
          avatarUrl: channelDetails.avatar
        }"
        class="w-16 h-16"
      />
      <div class="flex-1">
        <h2 class="text-lg font-bold text-brand-800">{{ channelDetails.name }}</h2>
        <ContentReadMore>
          {{ channelDetails.description }}
        </ContentReadMore>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
