<script setup lang="ts">
import { RouterView } from 'vue-router'
import PageWithAsideContainer from '@/components/containers/PageWithAsideContainer.vue'
</script>

<template>
  <PageWithAsideContainer>
    <template #main>
      <router-view v-slot="{ Component }">
        <transition
          name="fade"
          tag="div"
          class="flex flex-col h-full w-full relative"
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </template>
  </PageWithAsideContainer>
</template>

<style scoped></style>
