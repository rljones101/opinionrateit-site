<script setup lang="ts">
import { LightBulbIcon, ScaleIcon, FilmIcon, BookOpenIcon } from '@heroicons/vue/24/outline'

const benefits = [
  {
    icon: LightBulbIcon,
    title: 'Clear & Detailed',
    description: 'Easy to understand with great product visibility.'
  },
  {
    icon: ScaleIcon,
    title: 'Unbiased & Focused',
    description: 'Honest opinions that stay on topic.'
  },
  {
    icon: FilmIcon,
    title: 'Well Produced',
    description: 'High-quality audio, video, and presentation.'
  },
  {
    icon: BookOpenIcon,
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
        class="flex flex-col gap-3 bg-secondary-200 p-6 rounded-lg"
      >
        <div class="flex items-center gap-3">
          <component :is="benefit.icon" class="flex-shrink-0 w-8 h-8 text-brand-500" aria-hidden="true" />
          <h3 class="font-bold text-lg text-brand-300">{{ benefit.title }}</h3>
        </div>
        <p class="text-default-300">{{ benefit.description }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
