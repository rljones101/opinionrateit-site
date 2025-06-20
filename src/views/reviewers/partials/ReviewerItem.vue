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
    class="text-default-500 text-sm app-card flex flex-col transition-all duration-300 group hover:font-bold hover:scale-105 hover:shadow-lg hover:shadow-black"
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
        src="../../../assets/img/default-card-image-320.png"
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
      <UserAvatar
        :user="{ name: reviewer.name, avatarUrl: reviewer.avatar }"
        class="absolute -top-8 w-16 h-16 text-xl"
      />
      <div class="flex flex-col gap-2 items-center justify-between w-full">
        <div class="reviewer-details">
          <p>
            <span class="reviewer-details__text !text-brand-500 font-bold">{{
              formatPercentageToRating(reviewer.metric)
            }}</span>
            <span class="reviewer-details__label text-xs">Rating</span>
          </p>
          <p>
            <span class="reviewer-details__text font-bold text-brand-800">{{
              formatDate(reviewer.createdAt, 'short_no_time')
            }}</span>
            <span class="reviewer-details__label text-xs">Joined</span>
          </p>
          <p>
            <span class="reviewer-details__text font-bold text-brand-800">{{
              nFormatter(reviewer.numPublishedVideos, 1)
            }}</span>
            <span class="reviewer-details__label text-xs">videos</span>
          </p>
          <p>
            <span class="reviewer-details__text font-bold text-brand-800">
              {{ nFormatter(reviewer.views, 1) }}</span
            >
            <span class="reviewer-details__label text-xs">views</span>
          </p>
        </div>
      </div>
      <div class="flex justify-between items-end w-full p-4" v-if="userStore.isLoggedIn">
        <BaseButton type="secondary">
          <svg
            class="w-6 h-6 text-brand-500"
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
        <BaseButton type="primary" @click="showVideoReviews">View</BaseButton>
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
  text-transform: uppercase;
}

.reviewer-details__text {
  text-transform: capitalize;
}
</style>
