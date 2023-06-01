<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from './components/appHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import UserLogin from '@/components/forms/UserLogin.vue'
import { useDialog } from '@/controllers/dialogController'

const { show } = useDialog('#UserLoginDialog')
</script>

<template>
  <div class="flex flex-col h-full w-full">
    <UserLogin />
    <AppHeader class="sticky-header" @user-login="show" />
    <div class="flex flex-auto flex-col">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <AppFooter />
  </div>
</template>

<style>
.sticky-header {
  @apply sticky top-0 z-50 md:max-w-7xl md:mx-auto lg:max-w-none;
  background-color: var(--vt-c-blue);
}
</style>
