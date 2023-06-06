<script setup lang="ts">
import { getMultipleVideos } from '@/utils/googleAPI'
import VideoItem from '@/components/VideoItem.vue'
import { ref } from 'vue'
import PageContainer from '@/components/containers/PageContainer.vue'

const channelId = 'UC3XdYJjWliOdKuZMNaTiP8Q' // Zeos
const videoIds = ['KiFAHwD0pHE', 'RAKBTX34H6k', '8ZJHbGO3a44']
const videos = ref([])

getMultipleVideos(videoIds).then((res) => {
  console.log(res)
  videos.value = res
})
</script>

<template>
  <PageContainer>
    <div class="grid-layout w-full">
      <VideoItem v-for="video in videos" :key="video.id" :video="video" />
    </div>
  </PageContainer>
</template>

<style scoped></style>
