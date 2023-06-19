<script setup lang="ts"></script>

<template>
  <div class="pl-8 pr-8 w-full flex flex-col items-center space-y-8">
    <div class="flex flex-col lg:max-w-xl text-center mt-8 mb-8">
      <h1 class="text-3xl lg:text-5xl mb-4 uppercase">
        Create <br /><span class="font-bold text-orange-500">Product Reviews</span><br />
        With Confidence
      </h1>
      <p>
        Need to know what content is right for you? Get on demand information that will help you
        grow and be a better product reviewer!
      </p>
    </div>
    <div class="hidden lg:flex w-full">
      <div class="desktop-background image-block rounded-lg"></div>
    </div>
  </div>
</template>

<style scoped>
.image-block {
  min-width: 100%;
  min-height: 475px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-origin: content-box;
  opacity: 0.5;
  /*clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%);*/
}

.desktop-background {
  background-image: url('../assets/img/stanley-li-sW6qUDc0uQY-unsplash.jpg');
}
</style>
