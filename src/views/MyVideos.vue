<script setup lang="ts">
import { computed, ref, watch } from 'vue'
// Import components
import VideoItem from '@/components/VideoItem.vue'
import SearchInput from '@/components/inputs/SearchInput.vue'
import BaseButton from '@/components/buttons/BaseButton.vue'
import RadioCheckIcon from '@/components/forms/controls/RadioCheckIcon.vue'
import TabsComponent from '@/components/forms/TabsComponent.vue'
import CheckListItem from '@/components/CheckListItem.vue'
// Import types
import type { VideoChannelDetails } from '@/types'
// Import controllers or other utils
import { useProfile } from '@/composables/useProfile'
import { useModal } from '@/composables/useModal'
import ComponentSpinner from '@/components/spinners/ComponentSpinner.vue'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'

// Variables
const tabs = [{ label: 'My Published Videos' }, { label: 'My Youtube Videos' }]

// Reactive variables
const selectedTabIndex = ref(0)
const searchValue = ref('')

// Template refs

// Composables
const { hide, show } = useModal('#modalPublishVideos')
const { searchVideos, publishVideos, profile, profileLoaded } = useProfile()

// Computed methods
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
  profile.value.videos.forEach((video) => (video.selected = false))
  hide()
}

watch(searchValue, (value) => searchVideos(value))
</script>

<template>
  <div class="w-full h-full relative">
    <!-- modals --->
    <ConfirmModal
      id="modalPublishVideos"
      @confirmed="setSelectedVideosToPublish"
      @cancelled="cancelSelection"
    >
      <template #title> Publish Videos </template>
      <template #confirmMessage>
        <p class="text-base leading-relaxed">
          Are you sure you wish to publish the following videos?
        </p>
        <ul class="ml-8 mt-4">
          <li v-for="video in selectedVideos" :key="video.videoId">
            <CheckListItem :line-through="false" :is-checked="true" class="flex gap-4 items-center"
              ><span class="text-white">{{ video.title }}</span></CheckListItem
            >
          </li>
        </ul>
      </template>
    </ConfirmModal>
    <!-- tabs --->
    <TabsComponent :tabs="tabs" class="mb-8" @selected-index="selectedTabHandler" />
    <transition-group name="fade" tag="div" class="relative">
      <div v-if="selectedTabIndex === 0">
        <div v-if="profile.publishedVideos.length === 0">
          <h3 class="text-2xl font-bold text-white">No published videos found</h3>
          <p>
            You have not published any videos for review. Please start by selecting one from your
            <span class="font-bold text-white">My Youtube Videos</span> tab.
          </p>
        </div>

        <div v-if="profile.publishedVideos.length > 0" class="mb-8">
          <p>Below is a list of videos that have been published and are ready for review.</p>
        </div>
        <transition name="fade">
          <div class="grid-layout w-full" v-if="profile.publishedVideos.length">
            <VideoItem
              v-for="video in profile.publishedVideos"
              :key="video.videoId"
              :video="video"
            />
          </div>
        </transition>
      </div>
      <div v-if="selectedTabIndex === 1">
        <p class="mb-8">
          Here you can search and select what videos you would like to have reviewed.
        </p>
        <div class="flex w-full gap-8 mb-8 bg-app-blue-soft p-4 rounded-lg">
          <BaseButton
            class="relative flex-2 bg-orange-500 text-white"
            v-if="profile.isReviewer"
            :disabled="selectedVideos.length === 0"
            @click="show"
            >Publish Selected
            <span
              v-if="selectedVideos.length"
              class="inline-flex items-center justify-center w-4 h-4 ml-2 text-blue-800 bg-blue-200 rounded-full font-bold absolute -top-2 -right-2"
            >
              {{ selectedVideos.length }}
            </span>
          </BaseButton>
          <SearchInput v-model="searchValue" class="flex-1" />
        </div>
        <!--          <p class="mb-4">selected videos: {{ selectedVideos }}</p>-->
        <div class="grid-layout w-full">
          <div
            class="video-wrapper"
            @click="selectVideoHandler(video)"
            v-for="video in profile.videos"
            :key="video.videoId"
          >
            <VideoItem :video="video" class="h-full" />
            <RadioCheckIcon :is-checked="video.selected" class="absolute top-5 right-5 z-20" />
          </div>
        </div>
      </div>
    </transition-group>
    <ComponentSpinner class="-left-8 -right-8 -top-8" v-if="!profileLoaded" />
  </div>
</template>

<style scoped>
.video-wrapper {
  position: relative;
}
</style>
