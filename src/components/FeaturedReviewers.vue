<script setup lang="ts">
import ReviewerItem from '@/components/ReviewerItem.vue'
import CarouselComponent from '@/components/CarouselComponent.vue'
import reviewerController from '@/controllers/reviewerController'
import type { Slide } from '@/types'
import { ref } from 'vue'

let slides = ref<Slide[]>([])

reviewerController.getReviewers().then((reviewers) => {
  slides.value = reviewers.map(
    (item) =>
      ({
        id: item._id,
        data: item,
        style: { opacity: 1 }
      } as Slide)
  )
})
</script>

<template>
  <div class="mt-8">
    <transition name="fade">
      <CarouselComponent :slides="slides" v-if="slides.length" :hide-buttons="true">
        <template #slide="slideData">
          <ReviewerItem :reviewer="reviewerController.convertDataToReviewer(slideData)" />
        </template>
      </CarouselComponent>
    </transition>
  </div>
</template>

<style scoped></style>
