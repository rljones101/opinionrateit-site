<template>
  <div>
    <p class="mb-8">Here you can search and select what videos you would like to have reviewed.</p>
    <div class="flex w-full gap-8 mb-8 bg-app-blue-soft p-4 rounded-lg">
      <BaseButton
        variant="primary"
        class="relative"
        v-if="profileStore.getIsReviewer"
        :disabled="videosStore.getSelectedVideos.length === 0"
        @click="handlePublishSelected"
        >Publish Selected
        <span
          v-if="videosStore.getSelectedVideos.length"
          class="inline-flex items-center justify-center w-4 h-4 ml-2 text-brand-500 bg-brand-50 rounded-full font-bold"
        >
          {{ videosStore.getSelectedVideos.length }}
        </span>
      </BaseButton>
      <SearchInput :model-value="searchValue" @update:modelValue="searchHandler" class="flex-1" />
    </div>
    <div class="grid-layout w-full">
      <div
        class="video-wrapper"
        @click="selectVideoHandler(video)"
        v-for="video in videosStore.getNonPublishedVideos"
        :key="video.videoId"
      >
        <span class="relative">
          <VideoItem :video="video" class="h-full" />
          <RadioCheckIcon :is-checked="video.selected" class="absolute top-5 right-5 z-20" />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// Import types
import type { VideoChannelDetails } from '@/types'

// Components
import BaseButton from '@/components/buttons/BaseButton.vue'
import SearchInput from '@/components/inputs/SearchInput.vue'
import VideoItem from '@/components/VideoItem.vue'
import RadioCheckIcon from '@/components/forms/controls/RadioCheckIcon.vue'
import { useProfileStore } from '@/stores/profileStore'
import { useVideosStore } from '@/stores/videosStore'

const emit = defineEmits(['selected', 'search', 'publishSelected'])

const profileStore = useProfileStore()
const videosStore = useVideosStore()

const searchValue = ref('')

const selectVideoHandler = (video: VideoChannelDetails) => {
  emit('selected', video)
}

const emitSearch = () => {
  emit('search', searchValue.value)
}

const searchHandler = (value: string) => {
  searchValue.value = value
  emitSearch()
}

const handlePublishSelected = () => {
  emit('publishSelected')
}
</script>

<style scoped>
.video-wrapper {
  position: relative;
}
</style>
