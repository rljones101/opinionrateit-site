<script setup lang="ts">
defineProps<{
  id: string
  label?: string
  modelValue: string
}>()

defineEmits(['update:modelValue'])

defineOptions({
  inheritAttrs: false
})
</script>

<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block mb-2 text-sm font-medium text-slate-300">{{
      label
    }}</label>
    <input
      :name="id"
      :id="id"
      class="bg-app-blue border-none text-slate-400 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5"
      v-bind="$attrs"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<style scoped></style>
