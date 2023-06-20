<script setup lang="ts">
import PageContainer from '@/components/containers/PageContainer.vue'
import UserNav from '@/components/navs/UserNav.vue'
import { useRevealObserver } from '@/composables/useRevealObserver'
import SearchInput from '@/components/inputs/SearchInput.vue'
import BaseButton from '@/components/buttons/BaseButton.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import SiteLogo from '@/components/siteLogo.vue'

const router = useRouter()
const userStore = useUserStore()

useRevealObserver()

const logout = () => {
  userStore.logoutUser()
  router.push({ name: 'home' })
}

const searchHandler = async (value: string) => {
  let query = {}
  if (value) {
    query = { field: 'title', value: value }
  }
  await router.push({ name: 'search', query })
}
</script>

<template>
  <div class="w-full h-full flex">
    <div id="left" class="column flex-shrink-0 hidden md:flex">
      <div class="flex-shrink-0 bg-app-blue-soft px-8 pt-4">
        <SiteLogo class="hidden lg:flex" />
      </div>
      <div class="bottom">
        <UserNav class="bg-app-blue-soft h-full" />
      </div>
    </div>
    <div id="right" class="column w-full flex">
      <div class="flex-shrink-0 bg-app-blue-soft py-4 space-y-4 md:space-y-0">
        <div class="flex flex-col items-center lg:hidden">
          <SiteLogo />
        </div>
        <div class="flex">
          <div class="w-full flex flex-row items-center px-4 gap-4 border-b border-b-slate-800">
            <div class="w-full flex items-center justify-center">
              <SearchInput class="max-w-4xl" @change="searchHandler" />
            </div>
            <div class="justify-self-end gap-8 hidden md:flex">
              <BaseButton @click="logout">Logout</BaseButton>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <PageContainer>
          <slot name="main" />
        </PageContainer>
      </div>
    </div>
  </div>
</template>

<style scoped>
.column {
  height: 100%;
  flex-direction: column;
}
.bottom {
  @apply scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-slate-800;
  flex-grow: 1;
  overflow-y: auto;
}
</style>
