<script setup lang="ts">
defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

function inputHandler($event: Event) {
  const el = $event.target as HTMLInputElement
  emit('update:modelValue', el.value)
}
</script>

<template>
  <textarea
    class="bg-app-blue border-none text-slate-400 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5"
    :value="modelValue"
    @input="inputHandler"
  ></textarea>
</template>

<style scoped></style>
