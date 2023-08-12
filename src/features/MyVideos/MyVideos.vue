<script setup lang="ts">
import { computed, ref } from 'vue'
import TabsComponent from '@/components/forms/TabsComponent.vue'
import ComponentSpinner from '@/components/spinners/ComponentSpinner.vue'
import PublishedVideos from './PublishedVideos.vue'
import YoutubeVideos from './YoutubeVideos.vue'
import ConfirmSelection from './ConfirmSelection.vue'
// Import types
import type { VideoChannelDetails } from '@/types'
// Import controllers or other utils
import { useProfile } from '@/composables/useProfile'
import { useModal } from '@/composables/useModal'

// Variables
const tabs = [{ label: 'My Published Videos' }, { label: 'My Youtube Videos' }]

// Reactive variables
const selectedTabIndex = ref(0)

// Composables
const { hide, show } = useModal('#modalPublishVideos')
const { searchVideos, publishVideos, profile, status } = useProfile()

// Computed methods
const publishedVideos = computed(() => profile.value.publishedVideos || [])
const selectedVideos = computed(() => profile.value.videos.filter((video) => video.selected))

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
    await publishVideos(profile.value.youTubeChannelId, selectedVideos.value)
    // hide the modal
    hide()
  } catch (err) {
    console.error(err)
  }
}

const cancelSelection = () => {
  profile.value.videos.map((video) => (video.selected = false))
  hide()
}

const handleSearch = (value: string) => {
  searchVideos(value)
}
</script>

<template>
  <div class="relative flex flex-col">
    <!-- modals --->
    <ConfirmSelection
      id="modalPublishVideos"
      :selected-videos="selectedVideos"
      @confirmed="setSelectedVideosToPublish"
      @cancelled="cancelSelection"
    />
    <TabsComponent :tabs="tabs" class="mb-8" @selected-index="selectedTabHandler" />
    <ComponentSpinner class="-left-8 -right-8 -top-8" v-if="status === 'loading'" />
    <TransitionGroup name="fade" tag="div" class="relative h-full flex-grow" v-else>
      <PublishedVideos v-if="selectedTabIndex === 0" :published-videos="publishedVideos" />
      <YoutubeVideos
        v-if="selectedTabIndex === 1"
        :profile="profile"
        :selected-videos="selectedVideos"
        @selected="selectVideoHandler"
        @search="handleSearch"
        @publishSelected="show"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped></style>
