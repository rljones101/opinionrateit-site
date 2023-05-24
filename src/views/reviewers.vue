<script setup lang="ts">
import ReviewerItem from '../components/ReviewerItem.vue'
import CarouselComponent from "@/components/CarouselComponent.vue";
import reviewerController from "@/controllers/reviewerController";

let list = reviewerController.reviewers

</script>

<template>
  <p class="font-bold p-8">Featured Reviewers</p>
    <CarouselComponent :slides="list">
      <template #slide="slide">
        <ReviewerItem
        :key="slide.id"
        :name="slide.name"
        :id="slide.id"
        :channel-id="slide.channelId"
        :social="slide.social"
         :metrics="slide.metrics" />
      </template>
    </CarouselComponent>
</template>

<style scoped>

</style>