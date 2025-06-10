<script setup lang="ts">
import AppTitle from '@/components/AppTitle.vue'
import { getAllPublishedVideos } from '@/controllers/videoListController'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import VideoItem from '@/components/VideoItem.vue'
import type { VideoChannelDetails } from '@/types'

const router = useRouter()
const videos = ref<VideoChannelDetails[]>([])
getAllPublishedVideos().then((res) => {
  videos.value = res as VideoChannelDetails[]
})

const showVideo = async (video: VideoChannelDetails) => {
  await router.push({
    name: 'reviewers-channelId-reviews-videoId',
    params: { channelId: video.channelId, videoId: video.videoId }
  })
}
</script>

<template>
  <div>
    <AppTitle>Videos</AppTitle>
    <div class="grid-layout w-full" v-if="videos.length">
      <VideoItem
        v-for="video in videos"
        :key="video.videoId"
        :video="video"
        @click="showVideo(video)"
      />
    </div>
  </div>
</template>

<style scoped></style>
