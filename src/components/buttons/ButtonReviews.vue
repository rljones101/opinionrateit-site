<script setup lang="ts">
const details = () => {}
</script>

<template>
  <button class="btn" @click="details">
    <span class="font-bold uppercase">Details</span>
  </button>
</template>

<style scoped>
.btn {
  @apply border-2 hover:bg-orange-500 hover:text-white hover:font-bold border-gray-700 rounded-full p-2 flex justify-center;
  transform: translateY(0);
  transition: transform .3s ease-in-out;
  box-shadow: rgba(0,0,0, 0.5) 0 10px 10px
}

.btn:hover {
  transform: translate(0, -0.5em);
}
</style>