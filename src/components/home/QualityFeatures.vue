<script setup lang="ts">
const benefits = [
  {
    emoji: '💡',
    title: 'Clear & Detailed',
    description: 'Easy to understand with great product visibility.'
  },
  {
    emoji: '⚖️',
    title: 'Unbiased & Focused',
    description: 'Honest opinions that stay on topic.'
  },
  {
    emoji: '🎬',
    title: 'Well Produced',
    description: 'High-quality audio, video, and presentation.'
  },
  {
    emoji: '📚',
    title: 'Informative',
    description: 'Includes additional resources and context.'
  }
]
</script>

<template>
  <div class="flex flex-col items-center">
    <h2 class="text-4xl text-center text-brand-300 uppercase">What Makes a Great Review?</h2>
    <p class="mt-3 mb-10 text-center text-default-300 max-w-2xl">
      Every review on OpinionRateIt is measured against the standards that matter most.
    </p>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
      <div
        v-for="benefit in benefits"
        :key="benefit.title"
        class="flex items-start gap-4 bg-secondary-200 p-6 rounded-lg"
      >
        <div class="text-3xl" aria-hidden="true">{{ benefit.emoji }}</div>
        <div>
          <h3 class="font-bold text-lg text-brand-300">{{ benefit.title }}</h3>
          <p class="text-default-300">{{ benefit.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
