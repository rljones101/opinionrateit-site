<script setup lang="ts">
import ReviewerItem from '@/components/ReviewerItem.vue'
import CarouselComponent from "@/components/CarouselComponent.vue";
import reviewerController from "@/controllers/reviewerController";
import AppTitle from "@/components/AppTitle.vue";

let list = reviewerController.reviewers

</script>

<template>
  <div>
    <AppTitle>Featured Reviewers</AppTitle>
    <CarouselComponent :slides="list">
      <template #slide="{ id, name, channelId, social, metrics}">
        <ReviewerItem
            :key="id"
            :name="name"
            :id="id"
            :channel-id="channelId"
            :social="social"
            :metrics="metrics" />
      </template>
    </CarouselComponent>
  </div>
</template>

<style scoped>

</style>