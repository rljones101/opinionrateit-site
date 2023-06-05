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
    <div class="rounded-lg w-full overflow-hidden border-orange-500 border">
      <img :src="video.thumbnail" :alt="video.title" />
    </div>
    <p class="pt-4 pb-4 font-bold text-sm text-white">{{ video.title }}</p>
    <!--    <p class="pt-4 pb-4">{{ video.creator }}</p>-->
    <!--    <p class="pt-4 pb-4">{{ video.reviews }} Reviews</p>-->
  </div>
</template>

<style scoped></style>
