<script setup lang="ts">
import { useField } from 'vee-validate'

const props = defineProps<{
  name: string
  label?: string
  modelValue: string
}>()

defineOptions({
  inheritAttrs: false
})

const { value, errorMessage, meta, handleChange, handleBlur } = useField(
  () => props.name,
  undefined,
  {
    syncVModel: true
  }
)
</script>

<template>
  <div class="w-full py-2">
    <!--    <pre>Field touched: {{ meta.touched }}, valid: {{ meta.valid }}</pre>-->
    <label v-if="label" :for="name" class="block mb-2 text-sm font-medium text-slate-300">{{
      label
    }}</label>
    <input
      :name="name"
      :id="name"
      class="bg-app-blue shadow-inner border border-slate-700 text-slate-400 text-sm rounded-lg focus:ring-white focus:border-white block w-full p-2.5"
      v-bind="$attrs"
      v-model="value"
      :class="{ invalid: meta.touched && !meta.valid }"
      @change="handleChange"
      @blur="handleBlur($event, true)"
    />
    <div class="relative">
      <p class="text-red-500 absolute" v-if="meta.touched && !meta.valid">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.invalid {
  @apply border-red-500;
}
</style>
