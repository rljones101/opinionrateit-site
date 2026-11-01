<script setup lang="ts">
import { useNavRoutes } from '@/composables/useNavRoutes'

const { goToSignup } = useNavRoutes()
</script>

<template>
  <div
    class="w-full py-20 px-8 flex flex-col items-center text-center bg-gradient-to-r from-brand-500 to-brand-800"
  >
    <h2 class="text-3xl md:text-4xl font-bold text-white uppercase">Ready to Get Started?</h2>
    <p class="mt-4 text-lg text-white/90 max-w-2xl">
      Join thousands of tech enthusiasts discovering and sharing product reviews.
    </p>
    <button
      type="button"
      class="mt-8 inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-semibold text-brand-800 shadow transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-500"
      @click="goToSignup()"
    >
      Sign Up Free
    </button>
    <p class="mt-4 text-sm text-white/80">No credit card required • Free forever</p>
  </div>
</template>

<style scoped></style>
