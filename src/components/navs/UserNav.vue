<script setup lang="ts">
import {
  HomeIcon,
  UserGroupIcon,
  BookmarkIcon,
  ChartBarIcon,
  VideoCameraIcon,
  UserCircleIcon
} from '@heroicons/vue/20/solid'
import { useUserStore } from '@/stores/user'
import { type NavLink } from '@/types'
import NavButton from '../buttons/NavButton.vue'

const user = useUserStore()

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

const userLinks = [
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

const reviewerLinks = [
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
  <div class="pl-4 pr-4 relative">
    <nav id="nav" class="flex flex-col w-full transition space-y-2">
      <NavButton v-for="link in navLinks" :link="link" :key="link.id" />
    </nav>
    <div class="border-t border-app-blue pt-4 mt-8">
      <nav id="userNav" class="flex flex-col w-full transition space-y-2">
        <NavButton v-for="link in userLinks" :link="link" :key="link.id" />
      </nav>
      <nav
        id="reviewerNav"
        class="flex flex-col w-full transition space-y-2"
        v-if="user.restrictTo('reviewer-basic', 'reviewer-plus', 'admin')"
      >
        <NavButton v-for="link in reviewerLinks" :link="link" :key="link.id" />
      </nav>
    </div>
  </div>
</template>

<style scoped></style>
