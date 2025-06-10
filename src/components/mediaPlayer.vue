<script setup lang="ts">
import { useYouTube } from '@/composables/useYouTube'

const props = defineProps<{
  videoId: string
}>()

useYouTube('player', props.videoId)
</script>

<template>
  <div
    class="flex flex-col items-center justify-center w-full overflow-hidden relative aspect-video"
  >
    <div id="player"></div>
  </div>
</template>

<style scoped></style>
