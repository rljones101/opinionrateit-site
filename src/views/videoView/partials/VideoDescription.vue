<script setup lang="ts">
import AppSimpleCollapsibile from '@/components/base/AppSimpleCollapsibile.vue'

defineProps<{
  description?: string
}>()
</script>

<template>
  <div class="rounded bg-default-50 p-4">
    <AppSimpleCollapsibile>
      <template #header> Description </template>
      <template #content>
        <div class="text-sm description-content" v-html="description"></div>
      </template>
    </AppSimpleCollapsibile>
  </div>
</template>

<style scoped></style>
