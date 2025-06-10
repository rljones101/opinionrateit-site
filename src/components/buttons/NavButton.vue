<script setup lang="ts">
import { type NavLink } from '@/types'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const props = defineProps<{ link: NavLink }>()

const route = useRoute()
const router = useRouter()

const goToPath = async (link: NavLink) => {
  await router.push({ name: link.name, params: link.params })
}

const isActive = computed(() => {
  return route.name === props.link.name
})
</script>

<template>
  <button
    :key="link.id"
    class="group user-nav-btn border border-transparent font-bold rounded p-2 pl-4 pr-4 flex items-center gap-4 hover:bg-brand-500 hover:text-white ease-in-out transition-all duration-300"
    :class="{
      'bg-gray-700 border border-red bg-opacity-10 text-brand-500 pointer-events-none active':
        isActive
    }"
    @click="goToPath(link)"
  >
    <span
      v-if="link.icon"
      class="group-hover:text-secondary-50"
      :class="[{ 'text-brand-500': isActive }, { 'text-brand-800': !isActive }]"
      ><component :is="link.icon" class="w-6 h-6"
    /></span>
    <span class="hidden lg:flex uppercase font-bold">{{ link.label }}</span>
  </button>
</template>

<style scoped>
.user-nav-btn {
  min-height: 48px;
  line-height: 1rem;
  white-space: nowrap;
}
</style>
