<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{
  label: string
  name: string
  params?: any
}>()
const goToPath = async () => {
  await router.push({ name: props.name, params: props.params })
}
</script>

<template>
  <div class="relative group">
    <button
      class="flex items-center justify-center transition ease-out hover:ease-in duration-300 px-3 py-2 font-medium text-gray-700 hover:text-brand-500 uppercase text-center"
      @click="goToPath"
    >
      {{ label }}
    </button>
    <span class="absolute -bottom-1 left-0 w-0 h-1 bg-brand-500 transition-all group-hover:w-full"></span>
  </div>
</template>

<style scoped></style>
