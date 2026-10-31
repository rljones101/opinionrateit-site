<script setup lang="ts">
const steps = [
  {
    number: '1',
    title: 'Sign Up Free',
    description: 'Create your account in 30 seconds. No credit card required.'
  },
  {
    number: '2',
    title: 'Explore or Create',
    description: 'Browse thousands of reviews or start sharing your own insights.'
  },
  {
    number: '3',
    title: 'Join the Community',
    description: 'Follow reviewers, save favorites, and engage with fellow tech enthusiasts.'
  }
]
</script>

<template>
  <div class="flex flex-col items-center">
    <h2 class="text-4xl text-center text-brand-300 uppercase">How It Works</h2>
    <p class="mt-3 mb-10 text-center text-default-300">Get started in three simple steps.</p>
    <div class="flex flex-col md:flex-row gap-8 md:gap-4 w-full justify-center">
      <div
        v-for="(step, index) in steps"
        :key="step.number"
        class="flex-1 flex flex-col items-center text-center gap-4 relative"
      >
        <div
          class="flex items-center justify-center w-14 h-14 rounded-full bg-brand-500 text-white text-2xl font-bold"
        >
          {{ step.number }}
        </div>
        <h3 class="font-bold text-xl text-brand-300 uppercase">{{ step.title }}</h3>
        <p class="text-default-300 max-w-xs">{{ step.description }}</p>
        <!-- Connector line (desktop only, not after last step) -->
        <div
          v-if="index < steps.length - 1"
          class="hidden md:block absolute top-7 left-1/2 w-full h-0.5 bg-secondary-200 -z-10"
          aria-hidden="true"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
