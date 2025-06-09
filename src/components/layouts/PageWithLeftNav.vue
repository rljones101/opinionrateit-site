<script setup lang="ts">
import PageContainer from '@/components/containers/PageContainer.vue'
import UserNav from '@/components/navs/MainNav.vue'
import SearchInput from '@/components/inputs/SearchInput.vue'
import BaseButton from '@/components/buttons/BaseButton.vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import SiteLogo from '@/components/siteLogo.vue'
import { ref } from 'vue'
import UserAvatar from '@/components/UserAvatar.vue'
import AppFooter from '@/components/AppFooter.vue'

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
</script>

<template>
  <div class="w-full h-full flex">
    <div id="left" class="column flex-shrink-0 hidden md:flex border-r-4 border-secondary-50">
      <div class="flex items-center flex-shrink-0 px-8 py-4">
        <SiteLogo />
      </div>

      <div class="bottom">
        <UserNav />
      </div>
    </div>
    <div id="right" class="column w-full flex">
      <div class="flex-shrink-0 py-4 md:space-y-0">
        <div class="flex">
          <div class="flex w-full flex-row items-center px-4">
            <div class="flex flex-col items-center lg:hidden mr-4 flex-1">
              <SiteLogo />
            </div>
            <div class="w-full flex items-center gap-2">
              <div class="flex-1 w-full flex justify-center items-center">
                <SearchInput :model-value="searchValue" @update:modelValue="searchHandler" />
              </div>
              <div v-if="userStore.user.name" class="flex items-center justify-center">
                <UserAvatar
                  :user="{ name: userStore.user.name, avatarUrl: userStore.user.avatar }"
                  class="w-8 h-8"
                  :title="userStore.user.name"
                />
              </div>
              <div class="hidden md:flex items-center">
                <BaseButton type="primary" @click="logout">Logout</BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom grid grid-rows-[1fr_auto]">
        <PageContainer class="relative">
          <slot name="main" />
        </PageContainer>
        <AppFooter />
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
  @apply scrollbar-thin scrollbar-thumb-brand-500 scrollbar-track-brand-50;
  flex-grow: 1;
  overflow-y: auto;
}
</style>
