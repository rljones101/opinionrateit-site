<script setup lang="ts">
import PageContainer from '@/components/containers/PageContainer.vue'
import BaseBarMetric from '@/components/BaseBarMetric.vue'
import VideoItem from '@/components/VideoItem.vue'
import SearchInput from '@/components/inputs/SearchInput.vue'
import BaseButton from '@/components/buttons/BaseButton.vue'
import { getProfile } from '@/services/UserService'
import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'

const route = useRoute()
const name = route.params.name
let profile = ref({
  name: 'Foo Bar',
  email: 'foobar@company.com'
})

const profileInitials = computed(() => {
  let initialsArr: string[] = profile.value.name.split(' ')
  return initialsArr.length > 1
    ? initialsArr[0].charAt(0) + initialsArr[1].charAt(0)
    : initialsArr[0].charAt(0)
})

const searchHandler = (val) => {
  console.log('search for:', val)
}

getProfile(name as string).then((res) => {
  console.log(res)

  if (res.status === 'success') {
    let name = 'Undefined'
    let email = 'Undefined'
    if ('data' in res) {
      email = res?.data?.data?.email
      name = res?.data?.data?.name
    }
    profile.value = {
      name,
      email
    }
  }
})
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
          <!--          <div-->
          <!--            id="dropdown"-->
          <!--            class="z-10 hidden text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"-->
          <!--          >-->
          <!--            <ul class="py-2" aria-labelledby="dropdownButton">-->
          <!--              <li>-->
          <!--                <a-->
          <!--                  href="#"-->
          <!--                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"-->
          <!--                  >Edit</a-->
          <!--                >-->
          <!--              </li>-->
          <!--              <li>-->
          <!--                <a-->
          <!--                  href="#"-->
          <!--                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"-->
          <!--                  >Export Data</a-->
          <!--                >-->
          <!--              </li>-->
          <!--              <li>-->
          <!--                <a-->
          <!--                  href="#"-->
          <!--                  class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"-->
          <!--                  >Delete</a-->
          <!--                >-->
          <!--              </li>-->
          <!--            </ul>-->
          <!--          </div>-->
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
            <p>Reviews: 1.2k</p>
          </div>
        </div>
        <div class="flex flex-col items-center p-8 pb-0">
          <p>Metric Score</p>
          <h1 class="text-4xl font-bold text-white">65%</h1>
        </div>
      </div>
      <div class="hidden md:flex flex-col">
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
    <main class="w-full">
      <div class="flex w-full gap-8 mb-8">
        <BaseButton class="flex-2 bg-orange-500">Add Review</BaseButton>
        <SearchInput @change="searchHandler" class="flex-1" />
      </div>
      <div class="grid-layout w-full">
        <VideoItem label="LA90 Descrete" />
        <VideoItem label="ZMF Caldera" />
        <VideoItem label="Ferrum Oor" />
        <VideoItem label="Feliks Audio Euforia" />
        <VideoItem label="Meze Audio" />
        <VideoItem label="Meze Audio" />
        <VideoItem label="HD 6XX" />
        <VideoItem label="HyperX Microphone" />
        <VideoItem label="Topping A90" />
      </div>
    </main>
  </PageContainer>
</template>

<style scoped></style>
