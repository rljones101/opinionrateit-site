<script setup lang="ts">
import {
  HomeIcon,
  UserGroupIcon,
  BookmarkIcon,
  ChartBarIcon,
  VideoCameraIcon,
  UserCircleIcon
} from '@heroicons/vue/20/solid'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const user = useUserStore()

interface userLinkItem {
  id: number
  label: string
  name: string
  icon: any
  params?: any
}

const navLinks: userLinkItem[] = [
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
  },
  {
    id: 2,
    label: 'My Saved Reviews',
    name: 'my-saved-reviews',
    icon: BookmarkIcon
  },
  {
    id: 3,
    label: 'My Profile',
    name: 'my-profile',
    icon: UserCircleIcon,
    params: { name: user.user.name }
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

const goToPath = async (link: userLinkItem) => {
  await router.push({ name: link.name, params: link.params })
}
</script>

<template>
  <div class="pl-4 pr-4 relative">
    <nav id="nav" class="relative z-50 flex flex-col w-full transition space-y-2 pt-4">
      <button
        v-for="link in navLinks"
        :key="link.id"
        class="user-nav-btn whitespace-nowrap"
        :class="{ active: route.name === link.name }"
        @click="goToPath(link)"
      >
        <span v-if="link.icon" class="text-white"
          ><component :is="link.icon" class="w-6 h-6"
        /></span>
        <span class="hidden lg:flex uppercase font-bold">{{ link.label }}</span>
      </button>
    </nav>
    <nav
      id="reviewerNav"
      class="flex flex-col w-full transition space-y-2 border-t border-app-blue pt-4 mt-4"
      v-if="user.restrictTo('reviewer-basic', 'reviewer-plus', 'admin')"
    >
      <button
        v-for="link in reviewerLinks"
        :key="link.id"
        class="user-nav-btn whitespace-nowrap"
        :class="{ active: route.name === link.name }"
        @click="goToPath(link)"
      >
        <span v-if="link.icon" class="text-white"
          ><component :is="link.icon" class="w-6 h-6"
        /></span>
        <span class="hidden lg:flex uppercase font-bold">{{ link.label }}</span>
      </button>
    </nav>
  </div>
</template>

<style scoped>
.user-nav-btn {
  @apply hover:bg-app-orange font-bold rounded-lg p-2 pl-4 pr-4 flex items-center gap-4;
  min-height: 48px;
  line-height: 1rem;
  transform: translateY(0);
  transition: all 0.3s ease-in-out;
}

.user-nav-btn.active {
  @apply border border-app-orange text-app-orange bg-opacity-10 hover:shadow-none;
}

.user-nav-btn:hover:not(.active) {
  @apply text-white;
  transform: translate(0, -0.5em);
  box-shadow: rgba(0, 0, 0, 0.5) 0 10px 10px;
}
</style>
