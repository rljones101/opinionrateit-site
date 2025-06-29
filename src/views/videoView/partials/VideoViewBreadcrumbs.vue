<script setup lang="ts">
import { useVideoDetails } from '.././composables/useVideoDetails'

const { channelId, itemDetail } = useVideoDetails()
</script>

<template>
  <div class="mb-2 w-full sm:max-w-7xl mx-auto">
    <router-link to="/reviewers" class="text-brand-500 hover:text-brand-600">Reviewers</router-link>
    /
    <router-link
      :to="{ name: 'reviewers-channelId-reviews', params: { channelId } }"
      class="text-brand-500 hover:text-brand-600"
      >{{ itemDetail.creator }}</router-link
    >
    /
    {{ itemDetail.title }}
    review
  </div>
</template>

<style scoped></style>
