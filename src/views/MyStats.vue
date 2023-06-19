<script setup lang="ts">
import AppTitle from '@/components/AppTitle.vue'
import BaseBarMetric from '@/components/BaseBarMetric.vue'
import { useProfile } from '@/controllers/profileController'
import videoViewController from '@/controllers/videoViewController'
const { profile, profileLoaded } = useProfile()
</script>

<template>
  <AppTitle class="mb-8">My Stats</AppTitle>
  <div class="flex items-center justify-between w-full bg-slate-800 rounded-lg p-8">
    <div class="flex gap-8 items-center w-full">
      <div v-if="profile.isReviewer">
        <div class="rounded-full w-12 h-12 bg-app-blue flex items-center justify-center">
          <!--                {{ profileInitials }}-->
          <span :style="{ color: videoViewController.getColor(profile.metric) }"
            >{{ profile.metric }}%</span
          >
        </div>
      </div>
      <div>
        <h3 class="font-bold text-2xl text-white">{{ profile.name }}</h3>
        <a href="" class="text-orange-500">{{ profile.email }}</a>
        <!--          <p v-if="profile.isReviewer">Reviews: 1.2k</p>-->
      </div>
    </div>
    <!--          <div class="flex flex-col items-center" v-if="profile.isReviewer">-->
    <!--            <p>Metric Score</p>-->
    <!--            <h1 class="text-4xl font-bold text-white">{{ profile.metric }}%</h1>-->
    <!--          </div>-->
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
  </div>
  <div class="hidden md:flex flex-col bg-slate-800 rounded-lg p-8 mt-8" v-if="profile.isReviewer">
    <BaseBarMetric label="Presentation" :percentage="profile.avgOverallPresentation" />
    <BaseBarMetric label="Clarity" :percentage="profile.avgClarity" />
    <BaseBarMetric label="Product Viewablity" :percentage="profile.avgProductView" />
    <BaseBarMetric label="Detail Explanation" :percentage="profile.avgProductDetailExplanation" />
    <BaseBarMetric label="Non Bias Review" :percentage="profile.avgNonBias" />
    <BaseBarMetric label="Review Time" :percentage="profile.avgAverageReviewTime" />
    <BaseBarMetric label="Product Focus" :percentage="profile.avgProductFocus" />
    <BaseBarMetric label="Resources" :percentage="profile.avgProvidedResources" />
  </div>
</template>

<style scoped></style>
