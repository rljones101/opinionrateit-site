<script setup lang="ts">
import { computed, ref } from 'vue'
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
import { useProfile } from '@/controllers/profileController'
import { useModal } from '@/controllers/modalController'
import ComponentSpinner from '@/components/spinners/ComponentSpinner.vue'

// Variables
const tabs = [{ label: 'My Published Videos' }, { label: 'My Youtube Videos' }]

// Reactive variables
const selectedTabIndex = ref(0)

// Template refs
const modal = ref(null)

// Composables
const { hide, show } = useModal(modal)
const { searchVideos, publishVideos, profile, profileLoaded } = useProfile()

// Computed methods
const selectedVideos = computed(() => profile.value.videos.filter((video) => video.selected))

// Static methods
const selectedTabHandler = (index: number) => {
  selectedTabIndex.value = index
}

const searchHandler = (val: string) => {
  searchVideos(val)
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
</script>

<template>
  <div class="w-full h-full relative">
    <!-- modals --->
    <div
      ref="modal"
      tabindex="-1"
      aria-hidden="true"
      class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div class="relative w-full max-w-2xl max-h-full">
        <!-- Modal content -->
        <div class="relative bg-slate-800 rounded-lg shadow dark:bg-gray-700">
          <!-- Modal header -->
          <div class="flex items-start justify-between p-5 border-b rounded-t border-slate-600">
            <h3 class="text-xl font-semibold text-text-white lg:text-2xl dark:text-white">
              Publish Videos
            </h3>
            <button
              id="closeButton"
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              @click="hide"
            >
              <svg
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <!-- Modal body -->
          <div class="p-6 space-y-6">
            <p class="text-base leading-relaxed">
              Are you sure you wish to publish the following videos?
            </p>
            <ul class="ml-8 mt-4">
              <li v-for="video in selectedVideos" :key="video.videoId">
                <CheckListItem
                  :line-through="false"
                  :is-checked="true"
                  class="flex gap-4 items-center"
                  ><span class="text-white">{{ video.title }}</span></CheckListItem
                >
              </li>
            </ul>
          </div>
          <!-- Modal footer -->
          <div
            class="flex items-center justify-end p-6 space-x-2 border-t border-slate-600 rounded-b"
          >
            <BaseButton @click="setSelectedVideosToPublish" class="bg-orange-500"> Yes </BaseButton>
            <BaseButton @click="hide"> No </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- tabs --->
    <TabsComponent :tabs="tabs" class="mb-8" @selected-index="selectedTabHandler" />
    <transition-group name="fade">
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
        <div class="flex w-full gap-8 mb-8">
          <BaseButton
            class="flex-2 bg-orange-500"
            v-if="profile.isReviewer"
            :disabled="selectedVideos.length === 0"
            @click="show"
            >Publish Selected ({{ selectedVideos.length }})</BaseButton
          >
          <SearchInput @change="searchHandler" class="flex-1" />
        </div>
        <!--          <p class="mb-4">selected videos: {{ selectedVideos }}</p>-->
        <div class="grid-layout w-full">
          <div
            class="video-wrapper"
            @click="selectVideoHandler(video)"
            v-for="video in profile.videos"
            :key="video.videoId"
          >
            <VideoItem :video="video" />
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
