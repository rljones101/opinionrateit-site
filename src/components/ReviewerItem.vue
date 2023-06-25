<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import type { Reviewer } from '@/types'
import UserAvatar from '@/components/UserAvatar.vue'
import BaseButton from '@/components/buttons/BaseButton.vue'
import { formatDate, pastNumOfDays } from '@/utils/DateUtils'
import BadgeSmall from '@/components/badges/BadgeSmall.vue'
import { formatPercentageToRating, nFormatter } from '@/utils/StringUtils'

const userStore = useUserStore()
const router = useRouter()

// Define Props
const props = defineProps<{
  reviewer: Reviewer
}>()

// template refs

// Define data

// Define computed data

const showVideoReviews = () => {
  router.push({
    name: 'reviewers-channelId-reviews',
    params: { channelId: props.reviewer.channelId }
  })
}

function testImage(url: string) {
  return new Promise(function (resolve, reject) {
    const image = new Image()
    image.addEventListener('load', resolve)
    image.addEventListener('error', reject)
    image.src = url
  })
}

const showCardImage = ref(false)
testImage(props.reviewer.thumbnailMedium)
  .then(() => {
    showCardImage.value = true
  })
  .catch(() => {
    showCardImage.value = false
  })
</script>

<template>
  <div
    class="relative flex flex-col bg-app-blue-soft transition-all duration-300 group hover:bg-opacity-70 hover:font-bold hover:text-white hover:shadow-lg hover:scale-105 rounded-lg"
  >
    <BadgeSmall
      v-if="pastNumOfDays(props.reviewer.createdAt) >= -7"
      class="absolute -top-2 -left-2 bg-red-500 text-white z-20"
      >NEW</BadgeSmall
    >
    <div class="h-36">
      <img
        v-if="showCardImage"
        :src="reviewer.thumbnailMedium"
        alt="Card Image"
        style="object-fit: cover; opacity: 0.2"
        class="rounded-tl-lg rounded-tr-lg max-h-36 w-full"
      />
      <img
        v-else
        src="../assets/img/default_card_image.jpg"
        alt="Card Image"
        style="object-fit: cover; opacity: 0.2"
        class="rounded-tl-lg rounded-tr-lg max-h-36 w-full"
      />
    </div>
    <p
      class="absolute top-0 w-full h-36 flex items-center justify-center font-bold text-white text-lg"
    >
      {{ reviewer.name }}
    </p>
    <div class="relative flex flex-col items-center justify-between">
      <UserAvatar :name="reviewer.name" :src="reviewer.avatar" class="absolute -top-8 w-16 h-16" />
      <div class="flex flex-col gap-2 items-center justify-between w-full">
        <div class="reviewer-details">
          <p>
            <span class="reviewer-details__text !text-app-orange"
              >{{ formatPercentageToRating(reviewer.metric) }} / 10</span
            >
            <span class="reviewer-details__label">Rating</span>
          </p>
          <p>
            <span class="reviewer-details__text">{{
              formatDate(reviewer.createdAt, 'short_no_time')
            }}</span>
            <span class="reviewer-details__label">Joined</span>
          </p>
          <p>
            <span class="reviewer-details__text">{{
              nFormatter(reviewer.numPublishedVideos, 1)
            }}</span>
            <span class="reviewer-details__label">videos</span>
          </p>
          <p>
            <span class="reviewer-details__text"> {{ nFormatter(reviewer.views, 1) }}</span>
            <span class="reviewer-details__label">views</span>
          </p>
        </div>
      </div>
      <div class="flex justify-between items-end w-full p-4" v-if="userStore.isLoggedIn">
        <BaseButton class="text-app-orange hover:border hover:border-slate-500">
          <svg
            class="w-6 h-6 text-app-orange"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m13 19-6-5-6 5V2a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17Z"
            />
          </svg>
        </BaseButton>
        <BaseButton
          class="border border-app-orange text-app-orange hover:bg-app-orange hover:text-white"
          @click="showVideoReviews"
          >View</BaseButton
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.reviewer-details {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
}

.reviewer-details > p {
  text-align: center;
  display: block;
  padding: 1rem;
}

.reviewer-details > p:nth-child(1) {
  @apply border-t border-app-blue;
}

.reviewer-details > p:nth-child(2) {
  @apply border-t border-l border-app-blue;
}

.reviewer-details > p:nth-child(3) {
  @apply border-t border-b border-app-blue;
}

.reviewer-details > p:nth-child(4) {
  @apply border-t border-b border-l border-app-blue;
}

.reviewer-details > p > * {
  display: block;
}

.reviewer-details__label {
  @apply text-slate-500;
  text-transform: uppercase;
}

.reviewer-details__text {
  text-transform: capitalize;
  font-size: 1rem;
  color: #ffffff;
}
</style>
