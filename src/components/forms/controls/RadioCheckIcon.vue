<script setup lang="ts">
withDefaults(
  defineProps<{
    isChecked?: boolean
  }>(),
  {
    isChecked: false
  }
)
</script>

<template>
  <div :class="[{ 'fill-brand-500': isChecked }, { 'fill-brand-200': !isChecked }]">
    <svg
      aria-hidden="true"
      class="flex-shrink-0 w-5 h-5"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Check icon</title>
      <path
        fill-rule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clip-rule="evenodd"
      ></path>
    </svg>
  </div>
</template>

<style scoped></style>
