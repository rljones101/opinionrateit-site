<script setup lang="ts">
import ReviewerItem from '../components/ReviewerItem.vue'
import CarouselComponent from "@/components/CarouselComponent.vue";
import reviewerController from "@/controllers/reviewerController";
import AppTitle from "@/components/AppTitle.vue";

let list = reviewerController.reviewers

</script>

<template>
  <div>
    <AppTitle>Featured Reviewers</AppTitle>
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
  </div>
</template>

<style scoped>

</style>