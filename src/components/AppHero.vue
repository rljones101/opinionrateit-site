<script setup lang="ts">
import BaseButton from "@/components/buttons/BaseButton.vue";
</script>

<template>
  <div class="app-hero">
    <div class="mr-24">
      <h1 class="text-5xl mb-4">Create <span class="font-bold text-orange-500">Tech Reviews</span> With Confidence</h1>
      <p>Need to know what content is right for you? Get on demand information that will help you grow and be a better tech reviewer!</p>
      <BaseButton class="mt-4 w-40 bg-orange-500 hover:bg-orange-600">Get Started</BaseButton>
    </div>
    <div class="hero-image-container">
      <div class="desktop-background image-block"></div>
      <div class="headphone-background image-block"></div>
      <div class="computer-background image-block"></div>
    </div>
  </div>
</template>

<style scoped>
.image-block {
  min-width: 250px;
  min-height: 450px;
  margin-left: -30px;
  margin-right: -30px;
}

.hero-image-container {
  @apply flex bg-orange-500;
}

.app-hero {
  @apply flex items-center gap-4 max-w-7xl mx-auto;
}

.desktop-background {
//background-image: url("../assets/img/20180809_092515.jpg"), linear-gradient(rgba(0,0,0,1), rgba(16, 25, 45,0.5));
  background-image: url("../assets/img/20180809_092515.jpg");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%);
}
.computer-background {
//background-image: url("../assets/img/20180809_092515.jpg"), linear-gradient(rgba(0,0,0,1), rgba(16, 25, 45,0.5));
  background-image: url("../assets/img/20180519_223759.jpg");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%);
}

.headphone-background {
  background-image: url("../assets/img/20220411_172601.jpg");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%);
}
</style>