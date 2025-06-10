<script setup lang="ts">
import NavButton from '@/components/buttons/NavButton.vue'
import { ChartBarIcon, VideoCameraIcon } from '@heroicons/vue/20/solid'
import { useUserStore } from '@/stores/user'

const user = useUserStore()

const links = [
  {
    id: 0,
    label: 'My Stats',
    name: 'my-stats',
    icon: ChartBarIcon,
    params: { name: user.user.name }
  },
  {
    id: 1,
    label: 'My Videos',
    name: 'my-videos',
    icon: VideoCameraIcon,
    params: { name: user.user.name }
  }
]
</script>

<template>
  <nav
    id="reviewerNav"
    class="flex flex-col w-full transition space-y-2"
    v-if="user.restrictTo('reviewer-basic', 'reviewer-plus', 'admin')"
  >
    <NavButton v-for="link in links" :link="link" :key="link.id" />
  </nav>
</template>

<style scoped></style>
