<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import UserAvatar from '@/components/UserAvatar.vue'
import BaseButton from '@/components/buttons/BaseButton.vue'

/**
 * The logged-in user's avatar (initials) button that opens a popover showing
 * the user's name + email with a Logout action. Shared across the app's
 * headers so there's a single source of truth.
 */
const router = useRouter()
const userStore = useUserStore()

const open = ref(false)
const rootRef = ref<HTMLElement | null>(null)

const toggle = () => {
  open.value = !open.value
}

const close = () => {
  open.value = false
}

const handleDocumentClick = (event: MouseEvent) => {
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) {
    close()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
  document.removeEventListener('keydown', handleKeydown)
})

const logout = async () => {
  close()
  await userStore.logoutUser()
  router.push({ name: 'home' })
}
</script>

<template>
  <div ref="rootRef" class="relative flex items-center justify-center">
    <button
      type="button"
      class="user-avatar-button"
      :aria-expanded="open"
      aria-haspopup="menu"
      :title="userStore.user.name"
      @click="toggle"
    >
      <UserAvatar
        :user="{ name: userStore.user.name, avatarUrl: userStore.user.avatar }"
        class="w-8 h-8"
      />
    </button>

    <transition name="user-menu">
      <div v-if="open" class="user-menu" role="menu">
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
</template>

<style scoped>
@reference "#main.css";

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
