<script setup lang="ts">
import type { VideoChannelDetails } from '@/types'

defineProps<{
  video: VideoChannelDetails
}>()
</script>

<template>
  <div
    class="app-card flex flex-col items-center overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-black hover:shadow-lg"
  >
    <div class="overflow-hidden relative w-full">
      <div
        class="absolute left-0 right-0 top-0 bottom-0 bg-black bg-opacity-70 border border-orange-500 rounded-lg"
        v-show="video.selected"
      ></div>
      <img :src="video.thumbnail" :alt="video.title" class="w-full object-cover" />
    </div>
    <p class="p-4 font-semibold text-sm text-orange-100">{{ video.title }}</p>
  </div>
</template>

<style scoped></style>
