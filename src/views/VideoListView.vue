<script setup lang="ts">
import AppTitle from '@/components/AppTitle.vue'
import { getAllPublishedVideos } from '@/controllers/videoListController'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import VideoItem from '@/components/VideoItem.vue'

const router = useRouter()
const videos = ref([])
getAllPublishedVideos().then((res) => {
  console.log(res)
  videos.value = res
})

const showVideo = async (video) => {
  await router.push({
    name: 'reviewers-channelId-reviews-videoId',
    params: { channelId: video.channelId, videoId: video.videoId }
  })
}
</script>

<template>
  <AppTitle class="mb-8">Videos</AppTitle>
  <transition name="fade">
    <div class="grid-layout w-full" v-if="videos.length">
      <VideoItem
        v-for="video in videos"
        :key="video.videoId"
        :video="video"
        @click="showVideo(video)"
      />
    </div>
  </transition>
</template>

<style scoped></style>
