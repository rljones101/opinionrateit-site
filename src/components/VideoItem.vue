<script setup lang="ts">
defineProps<{
  video: {
    title: string
    creator: string
    reviews: string
    thumbnail: string
  }
}>()
</script>

<template>
  <div class="overflow-hidden">
    <div class="w-full overflow-hidden">
      <img :src="video.thumbnail" :alt="video.title" class="border-orange-500 border rounded-lg" />
    </div>
    <p class="pt-4 pb-4 font-bold text-sm text-white">{{ video.title }}</p>
    <!--    <p class="pt-4 pb-4">{{ video.creator }}</p>-->
    <!--    <p class="pt-4 pb-4">{{ video.reviews }} Reviews</p>-->
  </div>
</template>

<style scoped></style>
