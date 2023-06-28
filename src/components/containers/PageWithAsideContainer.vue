<script setup lang="ts">
import PageContainer from '@/components/containers/PageContainer.vue'
import UserNav from '@/components/navs/UserNav.vue'
import SearchInput from '@/components/inputs/SearchInput.vue'
import BaseButton from '@/components/buttons/BaseButton.vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import SiteLogo from '@/components/siteLogo.vue'
import { ref, watch } from 'vue'
import pageController from '@/controllers/pageController'
import UserAvatar from '@/components/UserAvatar.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const searchValue = ref(route.query.value || '')

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

watch(searchValue, (value: string) => {
  pageController.find(value, searchHandler)
})
</script>

<template>
  <div class="w-full h-full flex background-gradient-color">
    <div id="left" class="column flex-shrink-0 hidden md:flex">
      <div class="flex items-center justify-center flex-shrink-0 bg-app-blue-soft px-4 py-4">
        <div class="hidden lg:block">
          <SiteLogo />
        </div>
        <UserAvatar :name="userStore.user.name" class="block lg:hidden w-10 h-10" />
      </div>
      <div class="bottom bg-app-blue-soft border-r border-slate-700">
        <div class="hidden lg:flex flex-col items-center pb-4 pt-4 lg:pt-4">
          <UserAvatar :name="userStore.user.name" class="w-10 h-10 mb-2" />
          <p class="whitespace-nowrap hidden lg:block">{{ userStore.user.name }}</p>
        </div>
        <UserNav />
      </div>
    </div>
    <div id="right" class="column w-full flex">
      <div class="flex-shrink-0 bg-app-blue-soft py-4 md:space-y-0 border-b border-slate-700">
        <div class="flex">
          <div class="w-full flex flex-row items-center px-4">
            <div class="flex flex-col items-center lg:hidden mr-4">
              <SiteLogo />
            </div>
            <div class="w-full flex items-center justify-center">
              <SearchInput v-model="searchValue" class="max-w-4xl" />
            </div>
            <div class="justify-self-end hidden md:flex flex-grow items-center ml-4">
              <BaseButton
                @click="logout"
                class="border border-app-orange text-app-orange hover:bg-app-orange hover:text-white"
                >Logout</BaseButton
              >
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <PageContainer class="relative">
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
