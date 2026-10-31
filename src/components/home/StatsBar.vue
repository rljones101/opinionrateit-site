<script setup lang="ts">
const stats = [
  { label: 'Reviews', value: 'Growing' },
  { label: 'Reviewers', value: 'Growing' },
  { label: 'Products Covered', value: 'Growing' },
  { label: 'Community Members', value: 'Growing' }
]
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <h2 class="text-2xl text-center text-brand-300 uppercase mb-8">A Growing Community</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="flex flex-col items-center text-center p-4"
      >
        <span class="text-3xl font-extrabold text-brand-500">{{ stat.value }}</span>
        <span class="mt-1 text-sm uppercase tracking-wide text-default-300">{{ stat.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
