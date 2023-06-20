<script setup lang="ts">
import VideoItem from '@/components/VideoItem.vue'
import AppTitle from '@/components/AppTitle.vue'
import { useRouter, useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { getAllPublishedVideos } from '@/controllers/videoListController'

const router = useRouter()
const route = useRoute()
const videos = ref([])

watch(
  () => route.query,
  (query) => {
    getAllPublishedVideos(query).then((res) => {
      videos.value = res
    })
  },
  {
    immediate: true
  }
)

const showVideo = async (video) => {
  await router.push({
    name: 'reviewers-channelId-reviews-videoId',
    params: { channelId: video.channelId, videoId: video.videoId }
  })
}
</script>

<template>
  <AppTitle class="mb-8">Search Results</AppTitle>
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
