<script setup lang="ts">
import { RouterView } from 'vue-router'
import LoginDialog from '@/components/modals/LoginDialog.vue'
</script>

<template>
  <div class="flex h-full w-full relative">
    <router-view v-slot="{ Component }">
      <Transition name="fade" tag="div" class="flex h-full w-full relative" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>

    <!-- Global login dialog: opened from anywhere via the loginDialog store. -->
    <LoginDialog />
  </div>
</template>

<style></style>
