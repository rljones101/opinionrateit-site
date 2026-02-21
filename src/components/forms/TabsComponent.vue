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
  display: inline-block;
  padding: 1rem;
  border-bottom: 2px solid transparent;
  border-radius: 0.5rem 0.5rem 0 0;
  color: var(--color-default-200);
}

.tab:hover {
  color: var(--color-default-400);
}

.tab:disabled {
  display: inline-block;
  padding: 1rem;
  color: #9ca3af;
  border-radius: 0.5rem 0.5rem 0 0;
  cursor: not-allowed;
}

.tab-active {
  color: var(--color-brand-500);
}
</style>
