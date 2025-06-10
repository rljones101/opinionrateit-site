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
  <div class="text-sm font-medium text-center border-b border-default-200">
    <ul class="flex flex-wrap -mb-px">
      <li v-for="(tab, idx) in tabs" :key="tab.label">
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
  @apply text-default-200 inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-default-400;
}

.tab:disabled {
  @apply inline-block p-4 text-gray-400 rounded-t-lg cursor-not-allowed;
}

.tab-active {
  @apply text-brand-500;
}
</style>
