<script setup lang="ts">
import VideoItem from '@/components/VideoItem.vue'
import AppTitle from '@/components/AppTitle.vue'
import { useRouter, useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { getAllPublishedVideos } from '@/controllers/videoListController'
import PageLoadContainer from '@/components/containers/PageLoadContainer.vue'

const router = useRouter()
const route = useRoute()
const videos = ref([])
const isLoading = ref(false)

watch(
  () => route.query,
  (query) => {
    isLoading.value = true
    getAllPublishedVideos(query).then((res) => {
      videos.value = res
      isLoading.value = false
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
