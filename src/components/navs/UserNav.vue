<script setup lang="ts">
import { watch } from 'vue'
import { HomeIcon, UserGroupIcon, BookmarkIcon } from '@heroicons/vue/20/solid'
import { useRouter, useRoute } from 'vue-router'
import SiteLogo from '@/components/siteLogo.vue'

const router = useRouter()
const route = useRoute()

interface linkItem {
  link: string
  path: string
  name?: string
  command?: any
}

const navLinks = [
  {
    id: 0,
    label: 'Home',
    path: '/videos',
    name: 'videos',
    icon: HomeIcon
  },
  {
    id: 1,
    label: 'Reviewers',
    path: '/reviewers',
    name: 'reviewers',
    icon: UserGroupIcon
  },
  {
    id: 2,
    label: 'My Saved Reviews',
    path: '/my-saved-reviews',
    name: 'my-saved-reviews',
    icon: BookmarkIcon
  }
]

watch(
  () => route.name,
  (routeName) => {
    console.log('route name:', routeName)
  }
)

const goToPath = async (link: any) => {
  await router.push(link.path)
}
</script>

<template>
  <div class="pl-8 pr-8">
    <SiteLogo class="pt-8 pb-8" />
    <nav id="nav" class="hidden md:flex flex-col w-full transition space-y-2">
      <button
        v-for="link in navLinks"
        :key="link.id"
        class="user-nav-btn"
        :class="{ active: route.name === link.name }"
        @click="goToPath(link)"
      >
        <span v-if="link.icon"><component :is="link.icon" class="w-6 h-6" /></span>{{ link.label }}
      </button>
    </nav>
  </div>
</template>

<style scoped>
.user-nav-btn {
  @apply hover:bg-orange-500 font-bold rounded-full p-4 flex items-center gap-4;
  transform: translateY(0);
  transition: all 0.3s ease-in-out;
}

.user-nav-btn.active {
  @apply bg-app-blue hover:shadow-none;
}

.user-nav-btn:hover:not(.active) {
  @apply text-white;
  transform: translate(0, -0.5em);
  box-shadow: rgba(0, 0, 0, 0.5) 0 10px 10px;
}
</style>
