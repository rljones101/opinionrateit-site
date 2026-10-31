<script setup lang="ts">
import { useNavRoutes } from '@/composables/useNavRoutes'

const { goToSignup } = useNavRoutes()

// "Browse Reviews" scrolls down to the How It Works / content sections.
// The in-app video browser is behind auth, so a logged-out visitor can't be
// routed straight there. Scrolling keeps them engaged on the landing page.
const scrollToLearnMore = () => {
  document.getElementById('learn-more')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <div class="flex items-center w-full">
      <div class="hidden md:flex">
        <div class="flex">
          <img src="../assets/img/site-screens.png" alt="Desktop Image" class="object-contain" />
        </div>
      </div>
      <div class="flex md:ml-4 flex-col text-left hero-text">
        <h1 class="text-3xl lg:text-5xl mb-4 uppercase">
          <span class="text-brand-300">Discover &amp; Share</span><br />
          <span class="font-bold text-brand-500">Tech Product Reviews</span>
        </h1>
        <p class="text-default-300">
          Join a community of tech enthusiasts. Browse expert reviews, save favorites, and share
          your own insights.
        </p>
        <div class="mt-6 flex flex-wrap gap-4">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-6 py-3 text-base font-medium text-white transition-colors duration-200 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            @click="goToSignup"
          >
            Sign Up Free
          </button>
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-lg border border-brand-500 bg-white px-6 py-3 text-base font-medium text-brand-800 transition-colors duration-200 hover:bg-secondary-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            @click="scrollToLearnMore"
          >
            Browse Reviews
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-text {
  max-width: 28rem;
}
</style>
