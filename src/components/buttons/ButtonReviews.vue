<script setup lang="ts">
const details = () => {}
</script>

<template>
  <button class="btn" @click="details">
    <span class="font-bold uppercase">View</span>
  </button>
</template>

<style scoped>
.btn {
  @apply border-2 bg-orange-500 hover:text-white hover:font-bold border-gray-700 rounded-full p-2 flex justify-center;
  transform: translateY(0);
  transition: all 0.3s ease-in-out;
}

.btn:hover {
  transform: translate(0, -0.5em);
  box-shadow: rgba(0, 0, 0, 0.5) 0 10px 10px;
}
</style>
