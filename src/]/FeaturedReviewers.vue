<script setup lang="ts">
import ReviewerItem from '@/components/ReviewerItem.vue'
import CarouselComponent from "@/components/CarouselComponent.vue";
import AppTitle from "@/components/AppTitle.vue";

defineProps<{
  reviewers: any[]
}>()

</script>

<template>
  <div>
    <AppTitle>Featured Reviewers</AppTitle>
    <CarouselComponent :slides="reviewers">
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