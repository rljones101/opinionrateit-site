<script setup lang="ts">
import { RouterView } from 'vue-router'
import PageWithAsideContainer from '@/components/containers/PageWithAsideContainer.vue'
</script>

<template>
  <PageWithAsideContainer>
    <template #main>
      <router-view />
    </template>
  </PageWithAsideContainer>
</template>

<style scoped></style>
