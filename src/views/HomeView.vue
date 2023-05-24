<script setup lang="ts">
import JoinMessage from "@/components/JoinMessage.vue";
import Reviewers from "@/views/reviewers.vue";
</script>

<template>
  <section>
    <JoinMessage />
  </section>
  <section>
    <Reviewers />
  </section>
  <section class="section-info rounded mt-8 flex flex-col p-8 text-white">
    <h1 class="font-bold text-2xl">Find what motivates you!</h1>
    <p>Need to know what content is right for you? Get on demand information that will help you grow and be a better tech reviewer!</p>
  </section>
</template>

<style scoped>


.section-info {
  min-height: 500px;
  position: relative;
}
.section-background::before {
  background: rgba(16, 25, 45, 0.9);
  content: '';
  display: block;
  height: 100%;
  width: 100%;
  position: absolute;
}

.section-background {
  background-image: url('../assets/img/20180809_092515.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: .5;
}
</style>