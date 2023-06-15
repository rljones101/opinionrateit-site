<script setup lang="ts">
import { useYouTube } from '@/composables/useYouTube'

const props = defineProps<{
  videoId: string
}>()

useYouTube('player', props.videoId)
</script>

<template>
  <div>
    <div id="player"></div>
  </div>
</template>

<style scoped></style>
