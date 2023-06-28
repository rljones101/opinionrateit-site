<script setup lang="ts">
import { onMounted, ref } from 'vue'

const showReadMore = ref(true)
const ContentRef = ref('')

async function showHideReadMore() {
  try {
    setTimeout(() => {
      const el: HTMLElement = ContentRef.value as HTMLElement
      if (el) {
        showReadMore.value = el.offsetHeight < el.scrollHeight || el.offsetWidth < el.scrollHeight
      }
    }, 500)
  } catch (err) {
    console.error(err)
  }
}

onMounted(async () => {
  await showHideReadMore()
})
</script>

<template>
  <div class="w-full">
    <div
      ref="ContentRef"
      class="w-full h-full content-container"
      :class="{ 'line-clamp-4': showReadMore }"
    >
      <slot />
    </div>
    <button
      class="text-app-orange mt-4 hover:border-b hover:border-app-orange"
      @click="showReadMore = !showReadMore"
    >
      {{ showReadMore ? 'Read More...' : 'Read less...' }}
    </button>
  </div>
</template>

<style scoped>
.content-container {
  @apply scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-slate-800;
  max-height: 24rem;
  overflow-y: auto;
}
.line-clamp-4 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  /* truncate to 4 lines */
  -webkit-line-clamp: 2;
}
</style>
