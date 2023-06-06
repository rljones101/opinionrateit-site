<script setup lang="ts">
import PageContainer from '@/components/containers/PageContainer.vue'
import BaseBarMetric from '@/components/BaseBarMetric.vue'
import VideoItem from '@/components/VideoItem.vue'
import SearchInput from '@/components/inputs/SearchInput.vue'
import BaseButton from '@/components/buttons/BaseButton.vue'
import { useProfile } from '@/controllers/profileController'
import TabsComponent from '@/components/forms/TabsComponent.vue'
import { ref } from 'vue'

const tabs = [{ label: 'User Access' }, { label: 'My Youtube Videos' }]
const selectedTabIndex = ref(0)
const selectedTabHandler = (index: number) => {
  selectedTabIndex.value = index
}

const { searchVideos, profile, profileInitials, videos } = useProfile()

const searchHandler = (val) => {
  searchVideos(val)
}
</script>

<template>
  <PageContainer class="md:flex gap-4">
    <aside class="md:h-screen mb-24 md:pr-8 md:mb-0" aria-label="Sidebar">
      <div class="w-full bg-slate-700 rounded-lg p-8">
        <div class="flex justify-end">
          <button
            id="dropdownButton"
            data-dropdown-toggle="dropdown"
            class="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
            type="button"
          >
            <span class="sr-only">Open dropdown</span>
            <svg
              class="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"
              ></path>
            </svg>
          </button>
          <!-- Dropdown menu -->
          <div
            id="dropdown"
            class="z-10 hidden text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
          >
            <ul class="py-2" aria-labelledby="dropdownButton">
              <li>
                <a
                  href="#"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >Edit</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >Export Data</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >Delete</a
                >
              </li>
            </ul>
          </div>
        </div>
        <div class="flex gap-8 w-full">
          <div
            class="relative inline-flex items-center justify-center w-20 h-20 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600"
          >
            <span class="font-bold text-2xl text-gray-600 dark:text-gray-300">{{
              profileInitials
            }}</span>
          </div>
          <div>
            <h3 class="font-bold text-2xl text-white">{{ profile.name }}</h3>
            <a href="" class="text-orange-500">{{ profile.email }}</a>
            <p v-if="profile.isReviewer">Reviews: 1.2k</p>
          </div>
        </div>
        <div class="flex flex-col items-center p-8 pb-0" v-if="profile.isReviewer">
          <p>Metric Score</p>
          <h1 class="text-4xl font-bold text-white">65%</h1>
        </div>
      </div>
      <div class="hidden md:flex flex-col" v-if="profile.isReviewer">
        <BaseBarMetric label="Presentation" :percentage="70" />
        <BaseBarMetric label="Clarity" :percentage="25" />
        <BaseBarMetric label="Product Viewablity" :percentage="70" />
        <BaseBarMetric label="Detail Explanation" :percentage="30" />
        <BaseBarMetric label="Non Bias Review" :percentage="20" />
        <BaseBarMetric label="Review Time" :percentage="50" />
        <BaseBarMetric label="Product Focus" :percentage="80" />
        <BaseBarMetric label="Resources" :percentage="15" />
      </div>
    </aside>
    <main class="w-full relative" v-if="profile.isReviewer">
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
          <div class="grid-layout w-full" v-if="profile.publishedVideos.length">
            <VideoItem
              v-for="video in profile.publishedVideos"
              :key="video.videoId"
              :video="video"
            />
          </div>
        </div>
        <div v-if="selectedTabIndex === 1">
          <p class="mb-8">
            Here you can search and select what videos you would like to have reviewed.
          </p>
          <div class="flex w-full gap-8 mb-8">
            <BaseButton class="flex-2 bg-orange-500" v-if="profile.isReviewer"
              >Add Review</BaseButton
            >
            <SearchInput @change="searchHandler" class="flex-1" />
          </div>
          <div class="grid-layout w-full">
            <VideoItem v-for="video in videos" :key="video.videoId" :video="video" />
          </div>
        </div>
      </transition-group>
    </main>
  </PageContainer>
</template>

<style scoped></style>
