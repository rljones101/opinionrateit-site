<script setup lang="ts">
import ReviewerItem from '@/components/ReviewerItem.vue'
import CarouselComponent from "@/components/CarouselComponent.vue";
import AppTitle from "@/components/AppTitle.vue";
import reviewerController from "@/controllers/reviewerController";
import type { Slide } from "@/types";
import {ref} from "vue";

const slides = ref([...reviewerController.reviewers].map((item, index) => ({
    id: index,
    data: item,
    style: { opacity: 1 }
} as Slide)))

</script>

<template>
  <div>
    <AppTitle>Featured Reviewers</AppTitle>
    <CarouselComponent :slides="slides">
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