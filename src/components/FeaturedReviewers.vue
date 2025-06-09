<script setup lang="ts">
import ReviewerItem from '@/views/reviewers/partials/ReviewerItem.vue'
import CarouselComponent from '@/components/CarouselComponent.vue'
import reviewerController from '@/controllers/reviewerController'
import type { Slide } from '@/types'
import { ref } from 'vue'

let slides = ref<Slide[]>([])

reviewerController.getReviewers().then((reviewers) => {
  if (reviewers.length) {
    slides.value = reviewers.map(
      (item) =>
        ({
          id: item._id,
          data: item,
          style: { opacity: 1 }
        } as Slide)
    )
  }
})
</script>

<template>
  <div class="overflow-hidden">
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
