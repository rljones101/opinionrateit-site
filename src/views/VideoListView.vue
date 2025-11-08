<script setup lang="ts">
import AppTitle from '@/components/AppTitle.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import VideoItem from '@/components/VideoItem.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorBoundary from '@/components/ui/ErrorBoundary.vue'
import type { VideoChannelDetails } from '@/types'
import VideoService from '@/services/VideoService'

const router = useRouter()
const videos = ref<VideoChannelDetails[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const loadVideos = async () => {
  try {
    isLoading.value = true
    error.value = null
    const res = await VideoService.getVideoList()
    videos.value = res as VideoChannelDetails[]
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load videos'
    console.error('Error loading videos:', err)
  } finally {
    isLoading.value = false
  }
}

const showVideo = async (video: VideoChannelDetails) => {
  try {
    await router.push({
      name: 'reviewers-channelId-reviews-videoId',
      params: { channelId: video.channelId, videoId: video.videoId }
    })
  } catch (err) {
    console.error('Navigation error:', err)
  }
}

const retryLoad = () => {
  loadVideos()
}

onMounted(() => {
  loadVideos()
})
</script>

<template>
  <div class="video-list-container">
    <AppTitle>Videos</AppTitle>
    
    <ErrorBoundary @retry="retryLoad">
      <!-- Loading State -->
      <LoadingState 
        v-if="isLoading" 
        type="cards" 
        :card-count="6"
        message="Loading videos..."
      />
      
      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="error-content">
          <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Failed to Load Videos</h3>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <button 
            @click="retryLoad"
            class="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="!videos.length" class="empty-state">
        <div class="empty-content">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No Videos Found</h3>
          <p class="text-gray-600 mb-4">There are no videos available at the moment.</p>
          <button 
            @click="retryLoad"
            class="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
      
      <!-- Videos Grid -->
      <div v-else class="videos-grid">
        <VideoItem
          v-for="video in videos"
          :key="video.videoId"
          :video="video"
          @click="showVideo(video)"
          class="video-item-enhanced"
        />
      </div>
    </ErrorBoundary>
  </div>
</template>

<style scoped>
@reference "#main.css";

.video-list-container {
  @apply p-4;
}

.error-state, .empty-state {
  @apply min-h-96 flex items-center justify-center p-8;
}

.error-content, .empty-content {
  @apply max-w-md mx-auto text-center;
}

.videos-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4;
}

.video-item-enhanced {
  @apply transform transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer;
}

@media (max-width: 640px) {
  .videos-grid {
    @apply grid-cols-1 gap-4 p-2;
  }
}
</style>
