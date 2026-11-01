<script setup lang="ts">
import PageContainer from '@/components/containers/PageContainer.vue'
import UserNav from '@/components/navs/MainNav.vue'
import SearchInput from '@/components/inputs/SearchInput.vue'
import BaseButton from '@/components/buttons/BaseButton.vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useLoginDialogStore } from '@/stores/loginDialogStore'
import SiteLogo from '@/components/siteLogo.vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import UserAvatar from '@/components/UserAvatar.vue'
import AppFooter from '@/components/AppFooter.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const loginDialog = useLoginDialogStore()
const searchValue = ref(route.query.value || '')

// User popover menu (opened by clicking the avatar).
const showUserMenu = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const closeUserMenu = () => {
  showUserMenu.value = false
}

// Close the popover on an outside click or Escape.
const handleDocumentClick = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    closeUserMenu()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') closeUserMenu()
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
  document.removeEventListener('keydown', handleKeydown)
})

const logout = () => {
  closeUserMenu()
  userStore.logoutUser()
  router.push({ name: 'home' })
}

const goToLogin = () => {
  loginDialog.open()
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
              <!-- Logged in: avatar opens a popover with name + logout -->
              <div
                v-if="userStore.isLoggedIn && userStore.user.name"
                ref="userMenuRef"
                class="relative flex items-center justify-center"
              >
                <button
                  type="button"
                  class="user-avatar-button"
                  :aria-expanded="showUserMenu"
                  aria-haspopup="menu"
                  :title="userStore.user.name"
                  @click="toggleUserMenu"
                >
                  <UserAvatar
                    :user="{ name: userStore.user.name, avatarUrl: userStore.user.avatar }"
                    class="w-8 h-8"
                  />
                </button>

                <transition name="user-menu">
                  <div v-if="showUserMenu" class="user-menu" role="menu">
                    <div class="user-menu-header">
                      <UserAvatar
                        :user="{ name: userStore.user.name, avatarUrl: userStore.user.avatar }"
                        class="w-9 h-9 flex-shrink-0"
                      />
                      <div class="user-menu-identity">
                        <span class="user-menu-name">{{ userStore.user.name }}</span>
                        <span v-if="userStore.user.email" class="user-menu-email">{{ userStore.user.email }}</span>
                      </div>
                    </div>
                    <BaseButton variant="secondary" class="user-menu-logout" @click="logout">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </BaseButton>
                  </div>
                </transition>
              </div>

              <!-- Logged out: login button -->
              <div v-else class="hidden md:flex items-center">
                <BaseButton variant="primary" @click="goToLogin">Login</BaseButton>
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
@reference "#main.css";

.column {
  height: 100%;
  flex-direction: column;
}
.bottom {
  @apply scrollbar-thin scrollbar-thumb-brand-500 scrollbar-track-brand-50;
  flex-grow: 1;
  overflow-y: auto;
}

.user-avatar-button {
  @apply rounded-full cursor-pointer transition-shadow;
  @apply outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2;
}

.user-menu {
  @apply absolute right-0 top-full mt-2 z-50 w-64 p-4;
  @apply rounded-lg border border-app-light-blue bg-secondary-50 shadow-lg;
}

.user-menu-header {
  @apply flex items-center gap-3 pb-3 mb-3 border-b border-app-light-blue;
}

.user-menu-identity {
  @apply flex flex-col min-w-0;
}

.user-menu-name {
  @apply font-semibold text-default-50 truncate;
}

.user-menu-email {
  @apply text-sm text-default-300 truncate;
}

.user-menu-logout {
  @apply w-full justify-center;
}

/* Popover transition */
.user-menu-enter-active,
.user-menu-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.user-menu-enter-from,
.user-menu-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
