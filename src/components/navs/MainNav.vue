<script setup lang="ts">
import { HomeIcon, UserGroupIcon } from '@heroicons/vue/20/solid'
import { type NavLink } from '@/types'
import NavButton from '../buttons/NavButton.vue'
import UserLinks from '@/components/navs/UserLinks.vue'
import ReviewerLinks from '@/components/navs/ReviewerLinks.vue'

const navLinks: NavLink[] = [
  {
    id: 0,
    label: 'Home',
    name: 'videos',
    icon: HomeIcon
  },
  {
    id: 1,
    label: 'Reviewers',
    name: 'reviewers',
    icon: UserGroupIcon
  }
]
</script>

<template>
  <div class="pl-4 pr-4 relative">
    <nav id="nav" class="flex flex-col w-full transition space-y-2">
      <NavButton v-for="link in navLinks" :link="link" :key="link.id" />
    </nav>
    <div>
      <UserLinks />
      <ReviewerLinks />
    </div>
  </div>
</template>

<style scoped></style>
