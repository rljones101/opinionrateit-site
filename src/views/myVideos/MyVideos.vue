<script setup lang="ts">
import { ref } from 'vue'
import TabsComponent from '@/components/forms/TabsComponent.vue'
import ComponentSpinner from '@/components/spinners/ComponentSpinner.vue'
import PublishedVideos from './partials/PublishedVideos.vue'
import YoutubeVideos from './partials/YoutubeVideos.vue'
import ConfirmSelection from './partials/ConfirmSelection.vue'
// Import types
import type { VideoChannelDetails } from '@/types'
// Import controllers or other utils
import { useModal } from '@/composables/useModal'
import { useVideosStore } from '@/stores/videosStore'

// Variables
const tabs = [{ label: 'My Published Videos' }, { label: 'My Youtube Videos' }]

// Reactive variables
const selectedTabIndex = ref(0)

// Composables
const { hide, show } = useModal('#modalPublishVideos')
const videosStore = useVideosStore()

// Static methods
const selectedTabHandler = (index: number) => {
  selectedTabIndex.value = index
}

const selectVideoHandler = (video: VideoChannelDetails) => {
  video.selected = !video.selected
}

const setSelectedVideosToPublish = async () => {
  try {
    // Publish the videos that were selected
    await videosStore.publishVideos()
    // hide the modal
    hide()
  } catch (err) {
    console.error(err)
  }
}

const cancelSelection = () => {
  videosStore.unSelectVideos()
  hide()
}

const handleSearch = (value: string) => {
  videosStore.searchVideos(value)
}
</script>

<template>
  <div class="relative flex flex-col">
    <!-- modals --->
    <ConfirmSelection
      id="modalPublishVideos"
      :selected-videos="videosStore.getSelectedVideos"
      @confirmed="setSelectedVideosToPublish"
      @cancelled="cancelSelection"
    />
    <TabsComponent :tabs="tabs" class="mb-8" @selected-index="selectedTabHandler" />
    <ComponentSpinner class="-left-8 -right-8 -top-8" v-if="videosStore.status === 'loading'" />
    <TransitionGroup name="fade" tag="div" class="relative h-full flex-grow" v-else>
      <PublishedVideos
        v-show="selectedTabIndex === 0"
        :key="0"
        :published-videos="videosStore.getPublishedVideos"
      />
      <YoutubeVideos
        v-show="selectedTabIndex === 1"
        :key="1"
        @selected="selectVideoHandler"
        @search="handleSearch"
        @publishSelected="show"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped></style>
