<script setup lang="ts">
import PageWithAsideContainer from '@/components/layouts/PageWithLeftNav.vue'
</script>

<template>
  <PageWithAsideContainer>
    <template #main>
      <router-view v-slot="{ Component }">
        <transition name="fade" tag="div" class="flex flex-col h-full w-full relative" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </template>
  </PageWithAsideContainer>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
