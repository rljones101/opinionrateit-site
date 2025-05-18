<script setup lang="ts">
import { type NavLink } from '@/types'
import { useRoute, useRouter } from 'vue-router'

defineProps<{ link: NavLink }>()

const route = useRoute()
const router = useRouter()

const goToPath = async (link: NavLink) => {
  await router.push({ name: link.name, params: link.params })
}
</script>

<template>
  <button
    :key="link.id"
    class="user-nav-btn text-orange-100 border border-transparent font-bold rounded-lg p-2 pl-4 pr-4 flex items-center gap-4 hover:bg-app-orange-muted hover:border hover:border-app-orange transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105"
    :class="{
      'bg-white bg-opacity-10 text-app-orange pointer-events-none active': route.name === link.name
    }"
    @click="goToPath(link)"
  >
    <span v-if="link.icon" class="text-orange-100"
      ><component :is="link.icon" class="w-6 h-6"
    /></span>
    <span class="hidden lg:flex uppercase font-bold">{{ link.label }}</span>
  </button>
</template>

<style scoped>
.user-nav-btn {
  min-height: 48px;
  line-height: 1rem;
  transform: translateY(0);
  transition: all 0.3s ease-in-out;
  white-space: nowrap;
}

.user-nav-btn:hover:not(.active) {
  transform: translate(0, -0.5em);
  box-shadow: rgba(0, 0, 0, 0.5) 0 10px 10px;
}
</style>
