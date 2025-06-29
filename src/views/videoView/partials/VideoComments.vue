<script setup lang="ts">
import videoViewController from '@/controllers/videoViewController'
import { formatPercentageToRating } from '@/utils/StringUtils'
import { reviewDate } from '@/utils/DateUtils'
import { useReviews } from '@/views/videoView/composables/useReviews'

const { reviews, getReviews } = useReviews()
getReviews()
</script>

<template>
  <div class="comments w-full">
    <div
      v-for="review in reviews"
      :key="review._id"
      class="flex mb-4 bg-secondary-50 rounded p-4 shadow"
    >
      <div class="rounded-full w-12 h-12 bg-default-500 flex items-center justify-center mr-4">
        <span
          :style="{
            color: videoViewController.getColor(videoViewController.reviewMetric(review))
          }"
          >{{ formatPercentageToRating(videoViewController.reviewMetric(review)) }}</span
        >
      </div>
      <div>
        <div class="text-sm font-semibold">
          {{ review.user.name }} - {{ reviewDate(review.createdAt) }}
        </div>
        <p>{{ review.comment }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
