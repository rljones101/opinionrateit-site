<script setup lang="ts"></script>

<template>
  <div class="relative p-4 rounded-lg sm:p-6 md:p-8 bg-secondary-50 shadow">
    <form class="space-y-6" @submit.prevent>
      <slot />
    </form>
  </div>
</template>

<style scoped></style>
