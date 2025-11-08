<script setup lang="ts">
import { getInitials } from '@/utils/StringUtils'
import { computed, ref } from 'vue'

const props = defineProps<{
  user: {
    name: string
    avatarUrl: string
  }
}>()

const avatarImage = ref<string | null>(null)
const initials = computed(() => getInitials(props.user.name))
</script>

<template>
  <div>
    <img :alt="user.name" :src="avatarImage" v-if="avatarImage" class="rounded-full shadow" />
    <div
      v-else
      class="bg-default-50 border-brand-500 border-2 w-full h-full flex items-center justify-center text-brand-500 font-bold uppercase rounded-full shadow p-2"
    >
      {{ initials }}
    </div>
  </div>
</template>

<style scoped></style>
