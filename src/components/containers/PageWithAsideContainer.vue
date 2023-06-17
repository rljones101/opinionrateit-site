<script setup lang="ts">
import PageContainer from '@/components/containers/PageContainer.vue'
import UserNav from '@/components/navs/UserNav.vue'
import { useRevealObserver } from '@/controllers/observerController'
import SearchInput from '@/components/inputs/SearchInput.vue'
import BaseButton from '@/components/buttons/BaseButton.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import ButtonNav from '@/components/buttons/buttonNav.vue'

const router = useRouter()
const userStore = useUserStore()

useRevealObserver()

const logout = () => {
  userStore.logoutUser()
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="w-full h-full flex">
    <div id="left" class="column flex-shrink">
      <div class="flex-shrink"></div>
      <div class="bottom">
        <UserNav class="bg-slate-800 h-full" />
        <slot name="aside"></slot>
      </div>
    </div>
    <div id="right" class="column w-full">
      <div class="flex flex-shrink">
        <div class="w-full flex items-center justify-between gap-8 p-8 border-b border-b-slate-800">
          <SearchInput class="max-w-4xl" />
          <ButtonNav name="profile" label="Profile" :params="{ name: userStore.user.name }" />
          <BaseButton @click="logout">Logout</BaseButton>
        </div>
      </div>
      <div class="bottom">
        <PageContainer class="w-full reveal fade-top p-8">
          <slot name="main" />
        </PageContainer>
      </div>
    </div>
  </div>
</template>

<style scoped>
.column {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.bottom {
  @apply scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-slate-800;
  flex-grow: 1;
  overflow-y: auto;
}
</style>
