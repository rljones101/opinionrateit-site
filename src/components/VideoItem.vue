<script setup lang="ts">
import type { Video } from '@/types'
import AppCard from '@/components/cards/AppCard.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import { useReviewer } from '@/composables/useReviewer'

const props = defineProps<{
  video: Video
}>()

const { channelDetails, getReviewerDetails } = useReviewer(props.video.channelId)
getReviewerDetails()
</script>

<template>
  <AppCard
    class="flex flex-col transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-default-500 hover:shadow-md"
  >
    <div class="overflow-hidden relative w-full">
      <div
        class="absolute left-0 right-0 top-0 bottom-0 bg-black bg-opacity-70 border border-brand-500 rounded-lg"
        v-show="video.selected"
      ></div>
      <img
        :src="video.thumbnail"
        :alt="video.title"
        class="w-full object-cover border-default-500 border-b-2"
      />
    </div>
    <div class="flex-1 p-2 flex w-full items-center justify-center gap-2">
      <UserAvatar
        class="w-8 h-8"
        :user="{ name: channelDetails.name, avatarUrl: channelDetails.avatar }"
      />
      <p class="font-semibold text-xs" v-html="video.title"></p>
    </div>
  </AppCard>
</template>

<style scoped></style>
