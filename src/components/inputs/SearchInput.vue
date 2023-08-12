<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const emitSearchChange = () => {
  emit('update:modelValue', search?.value)
}

const search = computed({
  get() {
    return props.modelValue
  },
  set(value: string) {
    emit('update:modelValue', value)
  }
})

const clearSearch = () => {
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="flex w-full">
    <label for="simple-search" class="sr-only">Search</label>
    <div class="relative w-full">
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          aria-hidden="true"
          class="w-5 h-5 text-gray-500 dark:text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </div>
      <input
        v-model="search"
        @keydown.enter="emitSearchChange()"
        id="simple-search"
        class="bg-app-blue text-slate-300 text-sm rounded-full focus:ring-orange-500 focus:border-orange-500 w-full pl-10 p-2.5"
        placeholder="Search"
        required
      />
      <button
        v-if="search !== ''"
        @click="clearSearch"
        type="button"
        class="absolute top-2.5 right-3 ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-full focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
        aria-label="Close"
      >
        <span class="sr-only">Close</span>
        <svg
          aria-hidden="true"
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
    <button
      @click="emitSearchChange()"
      type="submit"
      class="p-2.5 ml-2 text-sm font-medium text-white bg-app-orange rounded-lg hover:bg-app-orange-muted focus:ring-1 focus:outline-none focus:ring-slate-700"
    >
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        ></path>
      </svg>
      <span class="sr-only">Search</span>
    </button>
  </div>
</template>

<style scoped></style>
