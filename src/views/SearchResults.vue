<script setup lang="ts">
import VideoItem from '@/components/VideoItem.vue'
import AppTitle from '@/components/AppTitle.vue'
import { useRouter, useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import PageLoadContainer from '@/components/containers/PageLoadContainer.vue'
import type { VideoChannelDetails } from '@/types'
import VideoService from '@/services/VideoService'

const router = useRouter()
const route = useRoute()
const videos = ref<VideoChannelDetails[]>([])
const isLoading = ref(false)

watch(
  () => route.query,
  (query) => {
    isLoading.value = true
    VideoService.getVideoList(query).then((res) => {
      videos.value = res as VideoChannelDetails[]
      isLoading.value = false
    })
  },
  {
    immediate: true
  }
)

const showVideo = async (video: VideoChannelDetails) => {
  await router.push({
    name: 'reviewers-channelId-reviews-videoId',
    params: { channelId: video.channelId, videoId: video.videoId }
  })
}
</script>

<template>
  <PageLoadContainer :is-loading="isLoading">
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
  </PageLoadContainer>
</template>

<style scoped></style>
