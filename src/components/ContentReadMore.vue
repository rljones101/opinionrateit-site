<script setup lang="ts">
import { onMounted, ref } from 'vue'

const showReadMore = ref(true)
const ContentRef = ref<HTMLElement | null>(null)

async function showHideReadMore() {
  try {
    setTimeout(() => {
      const el = ContentRef.value
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
      class="w-full h-full content-container scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-slate-800"
      :class="{ 'line-clamp-2': showReadMore }"
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
  max-height: 24rem;
  overflow-y: auto;
}
</style>
