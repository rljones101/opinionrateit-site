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
  <div class="w-full py-2">
    <label v-if="label" :for="id" class="block mb-2 text-sm font-medium text-slate-300">{{
      label
    }}</label>
    <input
      :name="id"
      :id="id"
      class="bg-app-blue shadow-inner border-none text-slate-400 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5"
      v-bind="$attrs"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <div class="relative">
      <p class="text-red-500 absolute"><slot name="errorMessage" /></p>
    </div>
  </div>
</template>

<style scoped></style>
