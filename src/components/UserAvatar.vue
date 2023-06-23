<script setup lang="ts">
defineProps<{
  alt: string
  src: string
}>()
</script>

<template>
  <div class="image-avatar-container">
    <img :alt="alt" :src="src" />
  </div>
</template>

<style scoped>
.image-avatar-container {
  border-radius: 50%;
  width: 88px;
  height: 88px;
  overflow: hidden;
  margin-bottom: 20px;
}
</style>
