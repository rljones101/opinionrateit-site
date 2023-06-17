<script setup lang="ts">
import BaseButton from '@/components/buttons/BaseButton.vue'
import { useNavRoutes } from '@/composables/useNavRoutes'

const { goToSignup } = useNavRoutes()
</script>

<template>
  <div class="app-hero flex">
    <div class="mr-24 app-hero-text flex-1 flex flex-col slide-in-left-animation p-8">
      <h1 class="text-5xl mb-4">
        Create <span class="font-bold text-orange-500">Tech Reviews</span> With Confidence
      </h1>
      <p>
        Need to know what content is right for you? Get on demand information that will help you
        grow and be a better tech reviewer!
      </p>
      <BaseButton class="mt-4 w-40 bg-orange-500 hover:bg-orange-600" @click="goToSignup"
        >Let's do this!</BaseButton
      >
    </div>
    <div class="hero-image-container flex-1 hidden md:flex">
      <div class="desktop-background image-block slide-in-right-animation-1"></div>
      <div class="headphone-background image-block slide-in-right-animation-2"></div>
      <div class="computer-background image-block slide-in-right-animation-3"></div>
    </div>
  </div>
</template>

<style scoped>
.image-block {
  @apply border-4 border-orange-500 shadow-lg shadow-slate-800;
  min-width: 450px;
  min-height: 250px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-origin: content-box;
  /*clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%);*/
}

.hero-image-container {
  position: relative;
  height: 450px;
}

.app-hero {
  @apply flex items-center gap-4 max-w-7xl mx-auto;
}

.app-hero .app-hero-text {
  /*max-width: 450px;*/
}

.desktop-background {
  background-image: url('../assets/img/20180809_092515.jpg');
  position: absolute;
  top: 16px;
  left: -74px;
  z-index: 2;
}
.computer-background {
  background-image: url('../assets/img/20180519_223759.jpg');
  position: absolute;
  top: 244px;
  left: 125px;
}
.headphone-background {
  background-image: url('../assets/img/20220411_172601.jpg');
  position: absolute;
  top: 50px;
  left: 259px;
}
</style>
