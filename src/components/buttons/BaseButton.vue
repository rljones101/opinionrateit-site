<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  isPrimary?: boolean
}>()

const getClasses = computed(() => {
  return props.isPrimary
    ? 'border border-transparent bg-app-orange text-orange-100 hover:bg-app-orange-muted'
    : 'border border-app-orange text-app-orange hover:bg-app-orange-muted'
})
</script>

<template>
  <button type="button" class="btn font-bold uppercase" :class="getClasses"><slot /></button>
</template>

<style scoped>
.btn {
  @apply py-2
  px-4
  rounded-lg;
  transform: translateY(0);
  transition: all 150ms ease-in-out;
  box-shadow: none;
}

.btn:hover {
  @apply transition ease-in-out delay-150 -translate-y-1 scale-105 border border-app-orange;
  box-shadow: rgba(0, 0, 0, 0.2) 0 10px 10px;
}
.btn:disabled {
  @apply pointer-events-none bg-gray-700 text-slate-500 border-none transition-none transform-none;
}
</style>
