<script setup lang="ts">
import { ref } from 'vue'

interface tab {
  label: string
}

defineProps<{
  tabs: tab[]
}>()

const emit = defineEmits(['selectedIndex'])

const active = ref(0)

const selectedHandler = (index: number) => {
  active.value = index
  emit('selectedIndex', index)
}
</script>

<template>
  <div
    class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700"
  >
    <ul class="flex flex-wrap -mb-px">
      <li class="mr-2" v-for="(tab, idx) in tabs" :key="tab.label">
        <button
          class="tab font-bold"
          :class="{ 'tab-active': idx === active }"
          @click="selectedHandler(idx)"
        >
          {{ tab.label }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.tab {
  @apply inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300;
}

.tab:disabled {
  @apply inline-block p-4 text-gray-400 rounded-t-lg cursor-not-allowed dark:text-gray-500;
}

.tab-active {
  @apply text-orange-600 border-orange-600 dark:text-orange-500 dark:border-orange-500;
}
</style>
