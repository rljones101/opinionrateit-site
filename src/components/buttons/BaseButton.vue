<script setup lang="ts"></script>

<template>
  <button class="btn" type="button">
    <span class="font-bold uppercase"><slot /></span>
  </button>
</template>

<style scoped>
.btn {
  @apply py-2
  px-4
  rounded-lg;
  transform: translateY(0);
  transition: transform 0.3s ease-in-out;
  box-shadow: none;
}

.btn:hover {
  transform: translate(0, -0.5em);
  box-shadow: rgba(0, 0, 0, 0.2) 0 10px 10px;
}
.btn:disabled {
  @apply bg-slate-300 text-slate-500 border-none transition-none transform-none;
}
</style>
