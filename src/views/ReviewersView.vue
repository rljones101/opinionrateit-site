<script setup lang="ts">

import AppTitle from "@/components/AppTitle.vue";
import reviewerController from "@/controllers/reviewerController";
import ReviewerItem from "@/components/ReviewerItem.vue";
import PageContainer from "@/components/containers/PageContainer.vue";
import { useRevealObserver } from "@/controllers/observerController";

useRevealObserver()

let list = reviewerController.reviewers

</script>

<template>
  <PageContainer class="reveal fade-top">
      <AppTitle>Reviewers</AppTitle>

      <div class="grid-layout">
        <ReviewerItem v-for="reviewer in list"
                      :key="reviewer.id"
                      :id="reviewer.id"
                      :social="reviewer.social"
                      :name="reviewer.name"
                      :metrics="reviewer.metrics"
                      :channel-id="reviewer.channelId" class="border border-slate-700 rounded" />
      </div>
  </PageContainer>
</template>

<style scoped>
</style>