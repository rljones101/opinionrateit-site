<script setup lang="ts"></script>

<template>
  <button class="btn">
    <span class="font-bold uppercase bg-app-blue hover:bg-app-orange hover:text-white hover:font-bold border-gray-700 rounded-lg p-2 flex justify-center"><slot /></span>
  </button>
</template>

<style scoped>
.btn {
  transform: translateY(0);
  transition: all 0.3s ease-in-out;
}

.btn:hover {
  transform: translate(0, -0.5em);
  box-shadow: rgba(0, 0, 0, 0.5) 0 10px 10px;
}
</style>
