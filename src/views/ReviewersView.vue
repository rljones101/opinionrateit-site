<script setup lang="ts">
import AppTitle from '@/components/AppTitle.vue'
import reviewerController from '@/controllers/reviewerController'
import ReviewerItem from '@/components/ReviewerItem.vue'
import PageContainer from '@/components/containers/PageContainer.vue'
import { useRevealObserver } from '@/controllers/observerController'
import { ref } from 'vue'
import BaseButton from '@/components/buttons/BaseButton.vue'

useRevealObserver()

let list = ref([])
let search = ref('')

reviewerController.getReviewers().then((reviewers) => {
  list.value = reviewers
})

const searchReviewers = async () => {
  const params = search.value ? { name: search.value } : ''
  const searchParams = new URLSearchParams(params)
  list.value = await reviewerController.getReviewers(searchParams)
}

const clearSearch = () => {
  search.value = ''
  searchReviewers()
}
</script>

<template>
  <PageContainer class="reveal fade-top">
    <AppTitle>Reviewers</AppTitle>
    <div class="flex items-center w-full p-8">
      <label for="simple-search" class="sr-only">Search</label>
      <div class="relative w-full">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            class="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
        <input
          v-model="search"
          @keydown.enter="searchReviewers"
          type="text"
          id="simple-search"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search"
          required
        />
        <button
          v-if="search !== ''"
          @click="clearSearch"
          type="button"
          class="absolute top-2.5 right-3 ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
          aria-label="Close"
        >
          <span class="sr-only">Close</span>
          <svg
            aria-hidden="true"
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
      <button
        @click="searchReviewers"
        type="submit"
        class="p-2.5 ml-2 text-sm font-medium text-white bg-orange-700 rounded-lg border border-orange-700 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
        <span class="sr-only">Search</span>
      </button>
    </div>

    <div class="grid-layout" v-show="list.length">
      <ReviewerItem
        v-for="reviewer in list"
        :key="reviewer.id"
        :id="reviewer.id"
        :social="reviewer.social"
        :name="reviewer.name"
        :metrics="reviewer.metrics"
        :channel-id="reviewer.channelId"
        class="border border-slate-700 rounded"
      />
    </div>
  </PageContainer>
</template>

<style scoped></style>
