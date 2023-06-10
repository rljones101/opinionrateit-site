<script setup lang="ts">
import type { VideoChannelDetails } from '@/types'

defineProps<{
  video: VideoChannelDetails
}>()
</script>

<template>
  <div
    class="flex flex-col items-center overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
  >
    <div class="overflow-hidden relative">
      <div
        class="absolute left-0 right-0 top-0 bottom-0 bg-black bg-opacity-70 rounded border border-orange-500 rounded-lg"
        v-show="video.selected"
      ></div>
      <img :src="video.thumbnail" :alt="video.title" class="rounded-lg" />
    </div>
    <p class="pt-4 pb-4 font-bold text-sm text-white">{{ video.title }}</p>
    <!--    <p class="pt-4 pb-4">{{ video.creator }}</p>-->
    <!--    <p class="pt-4 pb-4">{{ video.reviews }} Reviews</p>-->
  </div>
</template>

<style scoped></style>
