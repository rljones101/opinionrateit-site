<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useYouTube } from '@/composables/useYouTube'
import { useWatchHistoryStore } from '@/stores/watchHistoryStore'

const props = defineProps<{
  videoId: string
}>()

const watchHistoryStore = useWatchHistoryStore()
const { player, isReady } = useYouTube('player', props.videoId)

// Tracking state
const trackingInterval = ref<number | null>(null)
const lastTrackedPosition = ref(0)
const hasTrackedInitialView = ref(false)

// Track watch progress
const trackProgress = async () => {
  if (!player || !isReady.value) return

  try {
    const currentTime = player.getCurrentTime()
    const duration = player.getDuration()

    // Skip if no valid data
    if (!currentTime || !duration || duration === 0) return

    // Calculate completion
    const watchPercentage = (currentTime / duration) * 100
    const completed = watchPercentage >= 90

    // Only track if position changed significantly (at least 5 seconds)
    if (Math.abs(currentTime - lastTrackedPosition.value) >= 5) {
      await watchHistoryStore.trackWatch(
        props.videoId,
        currentTime,
        duration,
        currentTime,
        completed
      )
      lastTrackedPosition.value = currentTime
    }
  } catch (error) {
    // Silent fail - don't interrupt user experience
    console.error('Error tracking watch progress:', error)
  }
}

// Start tracking
const startTracking = () => {
  if (trackingInterval.value) return

  // Track immediately on start
  if (!hasTrackedInitialView.value) {
    trackProgress()
    hasTrackedInitialView.value = true
  }

  // Then track every 10 seconds
  trackingInterval.value = window.setInterval(() => {
    trackProgress()
  }, 10000) // 10 seconds
}

// Stop tracking
const stopTracking = () => {
  if (trackingInterval.value) {
    clearInterval(trackingInterval.value)
    trackingInterval.value = null
  }
}

// Track final position on unmount
const trackFinalPosition = async () => {
  if (!player || !isReady.value) return

  try {
    const currentTime = player.getCurrentTime()
    const duration = player.getDuration()

    if (currentTime && duration && duration > 0) {
      const watchPercentage = (currentTime / duration) * 100
      const completed = watchPercentage >= 90

      await watchHistoryStore.trackWatch(
        props.videoId,
        currentTime,
        duration,
        currentTime,
        completed
      )
    }
  } catch (error) {
    console.error('Error tracking final position:', error)
  }
}

// Watch for player ready state
onMounted(() => {
  // Wait for player to be ready, then start tracking
  const checkReady = setInterval(() => {
    if (isReady.value && player) {
      startTracking()
      clearInterval(checkReady)
    }
  }, 500)

  // Cleanup check interval after 10 seconds
  setTimeout(() => clearInterval(checkReady), 10000)
})

// Cleanup on unmount
onUnmounted(() => {
  stopTracking()
  trackFinalPosition()
})
</script>

<template>
  <div
    class="flex flex-col items-center justify-center w-full overflow-hidden relative aspect-video"
  >
    <div id="player"></div>
  </div>
</template>

<style scoped></style>
