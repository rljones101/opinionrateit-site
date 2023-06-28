<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="flex h-full w-full relative">
    <router-view v-slot="{ Component }">
      <Transition name="fade" tag="div" class="flex h-full w-full relative" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>
  </div>
</template>

<style></style>
