<script setup lang="ts">
import BaseButton from "@/components/buttons/BaseButton.vue";
</script>

<template>
  <div class="app-hero">
    <div class="mr-24 app-hero-text slide-in-left-animation">
      <h1 class="text-5xl mb-4">Create <span class="font-bold text-orange-500">Tech Reviews</span> With Confidence</h1>
      <p>Need to know what content is right for you? Get on demand information that will help you grow and be a better tech reviewer!</p>
      <BaseButton class="mt-4 w-40 bg-orange-500 hover:bg-orange-600">Get Started</BaseButton>
    </div>
    <div class="hero-image-container">
      <div class="desktop-background image-block slide-in-right-animation-1"></div>
      <div class="headphone-background image-block slide-in-right-animation-2"></div>
      <div class="computer-background image-block slide-in-right-animation-3"></div>
    </div>
  </div>
</template>

<style scoped>
.image-block {
  min-width: 250px;
  min-height: 450px;
  margin-left: -30px;
  margin-right: -30px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%);
}

.hero-image-container {
  @apply flex bg-orange-500;
}

.app-hero {
  @apply flex items-center gap-4 max-w-7xl mx-auto;
}

.desktop-background {
  background-image: url("../assets/img/20180809_092515.jpg");
}
.computer-background {
  background-image: url("../assets/img/20180519_223759.jpg");
}
.headphone-background {
  background-image: url("../assets/img/20220411_172601.jpg");
}
</style>