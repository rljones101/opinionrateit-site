<script setup lang="ts">
defineProps<{
  emoji: string
  title: string
  description: string
  features: string[]
}>()
</script>

<template>
  <div
    class="flex-1 flex flex-col gap-4 bg-secondary-50 p-8 rounded-lg shadow transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
  >
    <div class="text-4xl" aria-hidden="true">{{ emoji }}</div>
    <h3 class="font-bold text-xl text-brand-300 uppercase">{{ title }}</h3>
    <p class="text-default-300">{{ description }}</p>
    <ul class="mt-2 space-y-2">
      <li v-for="(feature, index) in features" :key="index" class="flex items-start gap-2">
        <svg
          class="flex-shrink-0 w-5 h-5 text-brand-500 mt-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="text-default-300">{{ feature }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
