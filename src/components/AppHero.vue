<script setup lang="ts">
import { useNavRoutes } from '@/composables/useNavRoutes'

const { goToSignup, goToVideos } = useNavRoutes()
</script>

<template>
  <div class="hero w-full flex items-center justify-end">
    <div class="flex md:mr-4 flex-col text-left hero-text">
      <h1 class="hero-heading text-4xl lg:text-6xl mb-4 uppercase font-extrabold tracking-tight">
        <span class="text-gradient-brand">Discover &amp; Share</span><br />
        <span class="text-white">Tech Product Reviews</span>
      </h1>
      <p class="text-default-300">
        Join a community of tech enthusiasts. Browse expert reviews, save favorites, and share
        your own insights.
      </p>
      <div class="mt-6 flex flex-wrap gap-4">
        <button
          type="button"
          class="btn-brand inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          @click="goToSignup()"
        >
          Sign Up Free
        </button>
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-lg border border-brand-500 bg-white px-6 py-3 text-base font-medium text-brand-800 transition-colors duration-200 hover:bg-brand-500 hover:text-white hover:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          @click="goToVideos"
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
  max-width: 30rem;
}

/* Soft orange glow behind the heading so it lifts off the dark hero art. */
.hero-heading {
  text-shadow: 0 2px 24px rgb(249 116 21 / 0.25);
  line-height: 1.05;
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
