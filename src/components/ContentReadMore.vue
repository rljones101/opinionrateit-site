<script setup lang="ts">
import { ref } from 'vue'
import AppSimpleCollapsibile from '@/components/base/AppSimpleCollapsibile.vue'

const HeaderText = {
  READ_MORE: 'Read more',
  READ_LESS: 'Read less'
}

const accordionHeaderText = ref(HeaderText.READ_MORE)

const handleUpdate = (value: undefined | null | string | string[]) => {
  if (value !== null) {
    accordionHeaderText.value = HeaderText.READ_LESS
  } else {
    accordionHeaderText.value = HeaderText.READ_MORE
  }
}
</script>

<template>
  <AppSimpleCollapsibile @update:value="handleUpdate">
    <template #header>{{ accordionHeaderText }}</template>
    <template #content>
      <slot></slot>
    </template>
  </AppSimpleCollapsibile>
</template>

<style></style>
