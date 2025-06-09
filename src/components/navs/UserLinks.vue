<script setup lang="ts">
import { BookmarkIcon, UserCircleIcon } from '@heroicons/vue/20/solid'
import { useUserStore } from '@/stores/user'
import NavButton from '@/components/buttons/NavButton.vue'

const user = useUserStore()

const links = [
  {
    id: 0,
    label: 'My Profile',
    name: 'my-profile',
    icon: UserCircleIcon,
    params: { name: user.user.name }
  },
  {
    id: 1,
    label: 'My Saved Reviews',
    name: 'my-saved-reviews',
    icon: BookmarkIcon
  }
]
</script>

<template>
  <nav
    id="userNav"
    class="flex flex-col w-full transition space-y-2 border-t-2 border-brand-800 pt-4 mt-4"
    v-if="user.isLoggedIn"
  >
    <NavButton v-for="link in links" :link="link" :key="link.id" />
  </nav>
</template>

<style scoped></style>
