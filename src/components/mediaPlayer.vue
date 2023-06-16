<script setup lang="ts">
import { useYouTube } from '@/composables/useYouTube'

const props = defineProps<{
  videoId: string
}>()

useYouTube('player', props.videoId)
</script>

<template>
  <div class="video-wrapper">
    <div id="player"></div>
  </div>
</template>

<style scoped>
.video-wrapper {
  @apply flex items-center justify-center w-full;
  aspect-ratio: 16/9;
  overflow: hidden;
  position: relative;
}
</style>
