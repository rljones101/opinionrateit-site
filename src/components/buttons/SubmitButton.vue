<script setup lang="ts">
import BaseButton from './BaseButton.vue'

defineProps<{ disabled?: boolean }>()
</script>

<template>
  <BaseButton variant="primary" type="submit" :disabled="disabled"><slot>Submit</slot></BaseButton>
</template>

<style scoped></style>
