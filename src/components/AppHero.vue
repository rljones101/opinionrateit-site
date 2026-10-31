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
  <div class="hero w-full flex items-center justify-end">
    <div class="flex md:mr-4 flex-col text-left hero-text">
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
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 28rem;
  padding: 3rem 1.5rem;
  border-radius: 0.75rem;
  overflow: hidden;
  background-image: url('../assets/img/hero-background-image.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* Readability overlay: darken the right side where the text sits so the
   headline/paragraph stay legible over the artwork. */
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to left,
    rgba(14, 20, 32, 0.9) 0%,
    rgba(14, 20, 32, 0.6) 40%,
    rgba(14, 20, 32, 0) 70%
  );
  z-index: 0;
}

.hero-text {
  position: relative;
  z-index: 1;
  max-width: 28rem;
}

@media (max-width: 768px) {
  .hero {
    justify-content: center;
    min-height: 24rem;
    padding: 2rem 1rem;
  }

  /* On mobile the art is less visible; darken more evenly for readability. */
  .hero::before {
    background: rgba(14, 20, 32, 0.72);
  }
}
</style>
