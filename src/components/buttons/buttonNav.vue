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
  <div class="relative group ml-4 mr-4">
    <button
      class="flex transition ease-out hover:ease-in duration-300 pt-2 pb-2 text-white font-bold uppercase"
      @click="goToPath"
    >
      {{ label }}
    </button>
    <span class="absolute -bottom-1 w-0 h-1 bg-orange-500 transition-all group-hover:w-full"></span>
  </div>
</template>

<style scoped></style>
