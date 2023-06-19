<script setup lang="ts"></script>

<template>
  <div class="form-container">
    <form class="space-y-6" @submit.prevent>
      <slot />
    </form>
  </div>
</template>

<style scoped>
.form-container {
  @apply relative p-4 text-white rounded-lg sm:p-6 md:p-8 bg-app-blue-soft shadow shadow-black;
}
</style>
