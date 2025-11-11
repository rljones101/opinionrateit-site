<script setup lang="ts">
import VideoDescription from '@/views/videoView/partials/VideoDescription.vue'
import MediaPlayer from '@/components/mediaPlayer.vue'
import BookmarkButton from '@/components/bookmarks/BookmarkButton.vue'
import { ref, onMounted } from 'vue'
import videoViewController from '@/controllers/videoViewController'
import { replaceNewlines, urlify } from '@/utils/StringUtils'
import { useRoute } from 'vue-router'
import { useWatchHistoryStore } from '@/stores/watchHistoryStore'

const route = useRoute()
const videoId = route.params.videoId as string
const channelId = route.params.channelId as string
const youTubeBaseUrl = 'https://www.youtube.com/watch?v='
const watchHistoryStore = useWatchHistoryStore()

const itemDetail = ref({
  title: '',
  creator: '',
  description: '',
  price: '',
  social: [],
  youTubeId: videoId,
  youtubeURL: `${youTubeBaseUrl}${videoId}`
})

// Resume functionality
const showResumeNotification = ref(false)
const lastPosition = ref(0)

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

const dismissResumeNotification = () => {
  showResumeNotification.value = false
}

videoViewController.getVideo(videoId).then((res: any) => {
  if ('items' in res) {
    const snippet = res.items[0].snippet
    itemDetail.value.title = snippet.localized.title
    itemDetail.value.description = replaceNewlines(urlify(snippet.localized.description))
    itemDetail.value.creator = snippet.channelTitle
  }
})

// Check for resume position on mount
onMounted(async () => {
  try {
    const result = await watchHistoryStore.getLastPosition(videoId)
    // Show resume notification if:
    // 1. User has watched this video before
    // 2. Last position is > 30 seconds (not just started)
    // 3. Video is not completed (< 90%)
    if (result.shouldResume && result.lastPosition > 30) {
      const history = result.history
      if (history && !history.completed) {
        lastPosition.value = result.lastPosition
        showResumeNotification.value = true
        
        // Auto-dismiss after 10 seconds
        setTimeout(() => {
          showResumeNotification.value = false
        }, 10000)
      }
    }
  } catch (error) {
    console.error('Error checking resume position:', error)
  }
})
</script>

<template>
  <div class="shadow">
    <div key="videoArea" class="relative bg-secondary-50 p-2 rounded">
      <div class="w-full flex flex-col gap-2" v-if="itemDetail && itemDetail.youTubeId">
        <!-- Resume Notification -->
        <div
          v-if="showResumeNotification"
          class="resume-notification"
        >
          <div class="resume-content">
            <svg class="resume-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div class="resume-text">
              <p class="resume-title">Continue watching?</p>
              <p class="resume-subtitle">You left off at {{ formatTime(lastPosition) }}</p>
            </div>
          </div>
          <button
            class="resume-dismiss"
            @click="dismissResumeNotification"
            title="Dismiss"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        
        <!-- video player -->
        <MediaPlayer class="media-player" :video-id="itemDetail.youTubeId"></MediaPlayer>
        <div class="flex justify-between items-center gap-2">
          <div>
            <h3 class="font-bold uppercase">{{ itemDetail.title }}</h3>
            <p class="text-sm" v-if="itemDetail.creator">
              Review by:
              <router-link :to="{ name: 'reviewers-channelId-reviews', params: { channelId } }">{{
                itemDetail.creator
              }}</router-link>
            </p>
          </div>
          <BookmarkButton 
            :video-id="videoId" 
            size="lg" 
            variant="with-text"
          />
        </div>
        <!-- description container -->
        <VideoDescription :description="itemDetail.description" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "#main.css";

.resume-notification {
  @apply bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between;
  animation: slide-down 0.3s ease-out;
}

.resume-content {
  @apply flex items-center gap-3;
}

.resume-icon {
  @apply w-6 h-6 text-blue-600 flex-shrink-0;
}

.resume-text {
  @apply flex flex-col;
}

.resume-title {
  @apply font-medium text-blue-900;
}

.resume-subtitle {
  @apply text-sm text-blue-700;
}

.resume-dismiss {
  @apply p-1 text-blue-400 hover:text-blue-600 hover:bg-blue-100 rounded;
  @apply transition-colors duration-200;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500;
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-down {
  animation: slide-down 0.3s ease-out;
}
</style>
