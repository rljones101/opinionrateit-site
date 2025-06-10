<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  // @ts-ignore if using TypeScript
  ...RouterLink.props
})

const isExternalLink = computed(() => {
  return typeof props.to === 'string' && props.to.startsWith('http')
})
</script>

<template>
  <a v-if="isExternalLink" :href="props.to" class="text-brand-500 hover:underline"><slot /></a>
  <RouterLink v-else :to="props.to" class="text-brand-500 hover:underline"><slot /></RouterLink>
</template>

<style scoped></style>
