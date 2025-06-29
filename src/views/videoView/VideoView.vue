<script setup lang="ts">
import VideoSurvey from './partials/VideoSurvey.vue'
import VideoComments from './partials/VideoComments.vue'
import VideoContent from './partials/VideoContent.vue'
import VideoViewBreadcrumbs from '@/views/videoView/partials/VideoViewBreadcrumbs.vue'
</script>

<template>
  <div class="w-full relative">
    <VideoViewBreadcrumbs />
    <div class="flex flex-col gap-2 w-full sm:max-w-7xl mx-auto">
      <VideoContent />
      <VideoSurvey />
      <VideoComments />
    </div>
  </div>
</template>

<style scoped></style>
